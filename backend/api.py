"""
Leger API - Main FastAPI Application

This is the main entry point for the Leger API, built on top of FastAPI.
It initializes the database connection, sets up CORS, and includes all API routers.
The API is designed to be deployed on Cloudflare Workers.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from utils.logger import logger
from utils.config import config, EnvMode
from services.supabase import DBConnection
import asyncio
import time
from collections import OrderedDict
import uuid

# Import API routers
from services import auth
from services import accounts
from services import billing
from services import configuration
from services import version

# Load environment variables (available through config)
db = DBConnection()
instance_id = str(uuid.uuid4())[:8]  # Generate a unique ID for this instance

# Rate limiter state
ip_tracker = OrderedDict()
MAX_CONCURRENT_IPS = 25

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Starting up Leger API with instance ID: {instance_id} in {config.ENV_MODE.value} mode")
    
    try:
        # Initialize database
        await db.initialize()
        logger.info("Database connection initialized")
        
        # Initialize Redis connection if needed
        try:
            from services import redis
            await redis.initialize_async()
            logger.info("Redis connection initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Redis connection: {e}")
        
        yield
        
        # Cleanup database connection
        logger.info("Disconnecting from database")
        await db.disconnect()
        
        # Cleanup Redis connection if initialized
        try:
            from services import redis
            await redis.close()
            logger.info("Redis connection closed successfully")
        except Exception as e:
            logger.error(f"Error closing Redis connection: {e}")
    
    except Exception as e:
        logger.error(f"Error during application startup: {e}")
        raise

app = FastAPI(
    title="Leger API",
    description="API for Leger configuration management and account services",
    version="1.0.0",
    lifespan=lifespan
)

@app.middleware("http")
async def log_requests_middleware(request: Request, call_next):
    """Middleware to log all incoming requests and their processing time."""
    start_time = time.time()
    client_ip = request.client.host
    method = request.method
    path = request.url.path
    query_params = str(request.query_params)
    
    # Log the incoming request
    logger.info(f"Request started: {method} {path} from {client_ip} | Query: {query_params}")
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.debug(f"Request completed: {method} {path} | Status: {response.status_code} | Time: {process_time:.2f}s")
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(f"Request failed: {method} {path} | Error: {str(e)} | Time: {process_time:.2f}s")
        raise

# Define allowed origins based on environment
allowed_origins = ["https://app.leger.io", "https://www.leger.io", "https://leger.io"]

# Add environment-specific origins
if config.ENV_MODE in [EnvMode.STAGING, EnvMode.LOCAL]:
    allowed_origins.extend(["http://localhost:3000", "https://staging.leger.io"])

# Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-API-Key"],
)

# Include all API routers
app.include_router(auth.router, prefix="/api")
app.include_router(accounts.router, prefix="/api")
app.include_router(billing.router, prefix="/api")
app.include_router(configuration.router, prefix="/api")
app.include_router(version.router, prefix="/api")

@app.get("/api/health")
async def health_check():
    """Health check endpoint to verify API is working."""
    logger.info("Health check endpoint called")
    return {
        "status": "ok", 
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "instance_id": instance_id,
        "version": config.LEGER_VERSION
    }

if __name__ == "__main__":
    import uvicorn
    
    workers = 2
    
    logger.info(f"Starting Leger API server on 0.0.0.0:8000 with {workers} workers")
    uvicorn.run(
        "api:app", 
        host="0.0.0.0", 
        port=8000,
        workers=workers,
        reload=True
    )

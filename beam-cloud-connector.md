# Leger-Beam Configuration Deployment System

## Overview
[THIS IS PREVIOUS CONTEXT, NOT A PROMPT]
I'll create a Beam.cloud integration system for Leger that allows OpenWebUI configurations stored in Supabase to be automatically transformed into environment variables and deployed as Beam Pods. This aligns with the design described in `paste.txt` about the "JSON Configuration to Beam.cloud Pod Integration Strategy."

## System Architecture

The system follows these core principles:

1. **JSON-Based Configuration Storage**: 
   - All OpenWebUI configurations are stored as JSON documents in Supabase
   - Existing configuration tables will be used with minor extensions

2. **Last-Mile .env Generation**:
   - JSON configurations are converted to environment variables at deployment time
   - A structured transformation process handles special types (booleans, arrays, etc.)

3. **External Secrets Management**:
   - Sensitive values are stored in Beam.cloud's secrets system
   - References to these secrets are included in Pod deployments

## Files to Implement

1. **`beam_deployment_service.py`** - Core service for transforming configurations and managing deployments
2. **`migrations/20250505000000_configuration_deployment.sql`** - SQL migration for adding deployment tracking columns
3. **`models/deployment.py`** - Pydantic models for deployment-related functionality
4. **`services/deployments.py`** - FastAPI route handlers and business logic
5. **`utils/config_transformer.py`** - Utilities for JSON-to-environment variable transformation

## Error Handling Strategy

The implementation will include:
- Detailed error logging with contextual information in Supabase
- Failed deployments will be marked as "failed" with the error message captured
- No automatic retries (will be added in a future iteration)
- Deployment history will be maintained to enable rollbacks

## Secret Management Policy

- Keys containing "api_key", "secret", "password", "token", etc. will be automatically detected as sensitive
- Schema annotations (x-sensitive: true) will also be used to identify sensitive fields
- When sensitive values are changed, new secrets will be generated
- Secrets will be named following the pattern `{key_name}_{random_uuid}`

## Environment Variable Transformation Rules

- Arrays/lists will be transformed to JSON strings
- Boolean values will be represented as lowercase "true"/"false"
- Nested JSON objects will be transformed to JSON strings (not flattened)
- Null/None values will be skipped (not included in environment variables)

## Deployment Status Tracking

The system will track:
- Deployment status: "pending", "active", "failed", "stopped"
- Pod ID, URL, and creation time
- Resource configuration (CPU, memory, GPU)
- User who initiated the deployment
- Deployment history for each configuration

## API Endpoint Design

- Create deployment: `POST /api/configurations/{config_id}/deploy`
- Get deployment status: `GET /api/configurations/{config_id}/deployment`
- Stop deployment: `POST /api/configurations/{config_id}/stop`
- List deployments: `GET /api/configurations/{config_id}/deployments`

## Directory Structure

The new files should be placed in the following locations in the Leger repo:

```
backend/
├── migrations/
│   └── 20250505000000_configuration_deployment.sql
├── models/
│   └── deployment.py
├── services/
│   ├── beam_deployment_service.py
│   └── deployments.py
└── utils/
    └── config_transformer.py
```

## Key Implementation Notes

1. The system starts simple but is designed to be extended with more sophisticated features
2. It leverages the existing configuration management system rather than creating parallel structures
3. Deployments are stateless - they read directly from Supabase when needed
4. Secrets are managed automatically based on field names and schema annotations
5. Detailed deployment information is stored for audit and debugging purposes

Please implement each file, making sure to reference the existing codebase patterns and maintain compatibility with the current system. Start with the core functionality that enables basic deployment workflows, and then enhance with additional features if time permits.


Error Handling Strategy
The implementation will include:

Detailed error logging with contextual information in Supabase
Failed deployments will be marked as "failed" with the error message captured
No automatic retries (will be added in a future iteration)
Deployment history will be maintained to enable rollbacks

Secret Management Policy

Keys containing "api_key", "secret", "password", "token", etc. will be automatically detected as sensitive
Schema annotations (x-sensitive: true) will also be used to identify sensitive fields
When sensitive values are changed, new secrets will be generated
Secrets will be named following the pattern {key_name}_{random_uuid}

Environment Variable Transformation Rules

Arrays/lists will be transformed to JSON strings
Boolean values will be represented as lowercase "true"/"false"
Nested JSON objects will be transformed to JSON strings (not flattened)
Null/None values will be skipped (not included in environment variables)

Deployment Status Tracking
The system will track:

Deployment status: "pending", "active", "failed", "stopped"
Pod ID, URL, and creation time
Resource configuration (CPU, memory, GPU)
User who initiated the deployment
Deployment history for each configuration

API Endpoint Design

Create deployment: POST /api/configurations/{config_id}/deploy
Get deployment status: GET /api/configurations/{config_id}/deployment
Stop deployment: POST /api/configurations/{config_id}/stop
List deployments: GET /api/configurations/{config_id}/deployments

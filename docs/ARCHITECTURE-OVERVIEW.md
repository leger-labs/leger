- [S3 Storage for uploaded files](https://docs.openwebui.com/tutorials/s3-storage)
- [Offloading background tasks to smaller LLM](https://docs.openwebui.com/tutorials/tips/improve-performance-local/)
- [Redis for session consistency/persistency](https://docs.openwebui.com/getting-started/env-configuration#redis)
- [Database structure, sqlite by default Postgres](https://docs.openwebui.com/tutorials/tips/sqlite-database)

##  Configuration Management:
The configuration management system now follows a documentation-first approach:
- OpenAPI specification automatically derived from Open WebUI's official documentation
- Parsing system extracts all environment variables and their metadata
- Validation rules generated from the documentation ensure configurations meet requirements
- Future updates to Open WebUI will be automatically incorporated through documentation scanning

Beam.cloud remains the core infrastructure for OWUI deployments, with several key components:

Wrapper around Beam CLI/SDK that handles deployment and management of OWUI instances on Beam Pods
Configuration transformation from Leger's validated schema to Beam deployment parameters
Integration with the OpenAPI specifications derived from OWUI documentation to ensure all environment variables are properly set

This approach ensures deployments follow a "configuration as code" model that is version controlled and validated before deployment.

### Beam Cloud Connector:

The backend is very light. We use fly.io to host serverless functions, acting as a wrapper on top of the beam.cloud CLI used to spin up the actual OWUI instances.

#### System Architecture

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
NOTE: Secret management is slightly convoluted with Leger. We use both Cloudflare KV (easy to build front-end on top of it), and this gets synced with the [beam.cloud secret management](https://docs.beam.cloud/v2/environment/secrets). Secrets are never stored in the JSON file. We only have {references} to the API secret (which as mentioned are duplicated between cloudflare KV and beam.cloud secret store).

---

I had previously prepared a thorough plan for anything beam.cloud related, which you can find below. Everything below might need more refinemenent or change:

##### Files to Implement
1. **`beam_deployment_service.py`** - Core service for transforming configurations and managing deployments
2. **`migrations/20250505000000_configuration_deployment.sql`** - SQL migration for adding deployment tracking columns
3. **`models/deployment.py`** - Pydantic models for deployment-related functionality
4. **`services/deployments.py`** - FastAPI route handlers and business logic
5. **`utils/config_transformer.py`** - Utilities for JSON-to-environment variable transformation
##### Error Handling Strategy
The implementation will include:
- Detailed error logging with contextual information in Supabase
- Failed deployments will be marked as "failed" with the error message captured
- No automatic retries (will be added in a future iteration)
- Deployment history will be maintained to enable rollbacks
##### Secret Management Policy
- Keys containing "api_key", "secret", "password", "token", etc. will be automatically detected as sensitive
- Schema annotations (x-sensitive: true) will also be used to identify sensitive fields
- When sensitive values are changed, new secrets will be generated
- Secrets will be named following the pattern `{key_name}_{random_uuid}`
##### Environment Variable Transformation Rules
- Arrays/lists will be transformed to JSON strings
- Boolean values will be represented as lowercase "true"/"false"
- Nested JSON objects will be transformed to JSON strings (not flattened)
- Null/None values will be skipped (not included in environment variables)
##### Deployment Status Tracking
The system will track:
- Deployment status: "pending", "active", "failed", "stopped"
- Pod ID, URL, and creation time
- Resource configuration (CPU, memory, GPU)
- User who initiated the deployment
- Deployment history for each configuration
##### API Endpoint Design
- Create deployment: `POST /api/configurations/{config_id}/deploy`
- Get deployment status: `GET /api/configurations/{config_id}/deployment`
- Stop deployment: `POST /api/configurations/{config_id}/stop`
- List deployments: `GET /api/configurations/{config_id}/deployments`
##### Directory Structure
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
##### Key Implementation Notes
1. The system starts simple but is designed to be extended with more sophisticated features
2. It leverages the existing configuration management system rather than creating parallel structures
3. Deployments are stateless - they read directly from Supabase when needed
4. Secrets are managed automatically based on field names and schema annotations
5. Detailed deployment information is stored for audit and debugging purposes
Please implement each file, making sure to reference the existing codebase patterns and maintain compatibility with the current system. Start with the core functionality that enables basic deployment workflows, and then enhance with additional features if time permits.

---
Some notes on the front-end environment varible selection side of things. Includes some unknowns that we need to discuss further, and some were already solved elsewhere:
```
* Some env variables are "redundant", to be hidden away precisely because Leger is a middleman between the user and the Beam.cloud-hosted OWUI sessions. Specifically, items like authentication do not need to be present on the OWUI side of things since the user would have already authenticated into Leger. This is a "sensible defaults" approach that Leger offers as a feature (reducing complexity from OWUI configuration)
* I am not sure how to handle situations where a single functionality may have multiple different providers: for example with "Web Search". There are around 10 different providers for this same functionality, and each different provider may need some specific configuration/env variables to be declared if and only if the option is selected by the admin. The Leger configuration UI should reflect that: first, a drop-down of all the different providers. Depending on what provider is selected, the front end wil manifest the specific required fields that correspond to that choice, ensuring that everything is correctly configured.
* As you will have noted from the PRD, Secrets is a separate part of the dashboard (because they are hosted on a different place than the env config itself), but we still  count on the user to mention WHICH secret is to be used in a specific OWUI environment config. 
* Leger provides a "fully featured"/"decked-out" OWUI configuration, meaning that there are some services that are typically "optional" which we provision automatically. Namely: Redit database is provided by default, so is an S3 object storage. In this case both of them are provided by cloudflare, to be provisioned automatically when a new Leger account is created.
```



# Executive Summary

## System Overview

Leger is a configuration management SaaS platform that enables users to create, store, share, and version configuration data for OpenWebUI deployments across personal and team accounts. The system employs a multi-tenant architecture with subscription-based access to premium features, leveraging Cloudflare's edge computing platform and Beam.cloud for deployment orchestration.

### Core Capabilities

- **Configuration Management**: Create, update, and version JSON configuration data for OpenWebUI
- **Template System**: Create and share configuration templates
- **Team Collaboration**: Team accounts with role-based permissions
- **Version Control**: Track changes to configurations with comparison and restoration
- **Subscription Model**: Tiered access with free and paid options
- **Per-Account Resource Provisioning**: Dedicated storage and services for each account

## Architecture Overview

Leger employs a single-worker architecture powered by Cloudflare Workers that handles both frontend and backend responsibilities in a cohesive, domain-driven design:

1. **Single Cloudflare Worker**: Handles all application logic, frontend rendering, and backend operations
2. **Cloudflare D1**: Provides relational database capabilities for structured data
3. **Cloudflare KV**: Enables fast access to configuration and cache data
4. **Cloudflare R2**: Offers object storage for each tenant, provisioned per account
5. **Cloudflare Access**: Manages authentication and identity
6. **Beam.cloud**: Orchestrates OpenWebUI deployments based on configurations

This architecture provides a seamless, responsive experience while maintaining strong isolation between tenant resources.

## Data Architecture

The system uses a relational data model with these core entities:

1. **Users**: Authenticated users of the system (managed through Cloudflare Access)
2. **Accounts**: Personal or team accounts containing configurations
3. **Configurations**: JSON configuration data with versioning
4. **Subscriptions**: Subscription status tracking via Stripe

The relationships between these entities form a cohesive data model that supports multi-tenant isolation, role-based access control, and feature availability based on subscription status. Each entity is stored in Cloudflare D1 using Drizzle ORM for type-safe database access.

## Business Logic

The business logic in Leger revolves around several key functional areas:

1. **User Management**: Profile management and Cloudflare Access integration
2. **Account Management**: Team creation, member management, invitations
3. **Configuration Management**: Creating, updating, versioning configurations
4. **Template System**: Creating, sharing, and applying templates
5. **Subscription Control**: Managing feature access based on subscription status
6. **Tenant Resource Management**: Provisioning isolated resources for each account

Each area has well-defined workflows, validation rules, and state transitions that ensure data integrity and proper access controls, implemented within domain-specific modules in the Cloudflare Worker.

## API Structure

Rather than a traditional REST API, Leger implements domain-driven route handlers within the single Worker architecture:

1. **Authentication Domain**: User identity managed by Cloudflare Access
2. **Account Domain**: Account and team management
3. **Configuration Domain**: Configuration CRUD operations
4. **Version Domain**: Version management and comparison
5. **Billing Domain**: Subscription management via Stripe

Each domain has clearly defined request/response formats, validation powered by Zod schemas shared between frontend and backend, and consistent error handling patterns.

## External Integrations

The system integrates with external services:

1. **Stripe**: Subscription management and payment processing
2. **Cloudflare Email Workers**: Transactional emails for invitations and notifications
3. **Beam.cloud**: Deployment of OpenWebUI instances based on configurations

These integrations follow established patterns for API communication, webhook processing, and error handling, all managed through the single Worker.

## Multi-Tenant Resource Provisioning

A key feature of Leger is its ability to provision dedicated resources for each account:

1. **Per-Account R2 Buckets**: Each tenant receives isolated object storage
2. **Per-Account Redis Instances**: Dedicated Upstash Redis for each tenant
3. **Account-Specific Service Configurations**: Isolated configuration for third-party services

This approach ensures complete data isolation between tenants while providing a seamless experience for administrators. The provisioning process is automatically triggered during account creation.

## Cloudflare Worker Organization

The single Cloudflare Worker architecture follows a domain-driven approach to code organization:

1. **Route Handler Layer**: Entry points that parse requests, validate input, and dispatch to appropriate domain services
2. **Domain Services Layer**: Core business logic organized by domain (accounts, configurations, versions, etc.)
3. **Data Access Layer**: Type-safe database operations using Drizzle ORM
4. **Shared Utilities**: Cross-cutting concerns like validation, error handling, and security

This layered approach within a single Worker provides several advantages:
- Clear separation of concerns without multiple deployment units
- Consistent error handling and validation
- Type safety throughout the entire application
- Simpler deployment and maintenance

Each domain maintains its own set of handlers, services, schemas, and types while sharing core infrastructure like database access and authentication.

## Implementation Strategy

The Leger implementation strategy leverages modern frontend and edge computing technologies:

1. **Frontend**: React with shadcn/ui components, React Hook Form, and Zod validation
2. **Backend**: Domain-driven design within a single Cloudflare Worker
3. **Database**: Type-safe data access via Drizzle ORM with Cloudflare D1
4. **Authentication**: Cloudflare Access for identity and session management
5. **Edge Caching**: Strategic caching for optimal performance

This approach combines the best aspects of serverless, edge computing, and modern frontend development to create a responsive, scalable platform with minimal operational overhead.

## Critical Considerations

For successful implementation, special attention should be paid to:

1. **Authentication Integration**: Implementing JWT validation for Cloudflare Access with proper caching to minimize overhead
2. **Authorization Logic**: Using middleware-based access controls with role verification before business logic execution
3. **Versioning System**: Implementing explicit versioning with transaction-based operations and proper rollback handling
4. **Subscription Controls**: Creating helper functions to verify feature access based on subscription status
5. **Resource Provisioning**: Utilizing background queues for non-blocking resource provisioning operations
6. **Worker Size Optimization**: Employing code splitting and tree shaking to keep the Worker bundle within size limits
7. **Error Handling**: Implementing consistent error response formats with appropriate status codes and error messages
8. **Edge Caching**: Strategically caching responses to improve performance while maintaining data consistency

By carefully implementing the business logic with these considerations in mind, Leger will provide a powerful, efficient platform for managing OpenWebUI deployments with minimal operational overhead.

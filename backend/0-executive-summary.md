# Executive Summary

## System Overview

Leger is a configuration management SaaS platform that enables users to create, store, share, and version configuration data across personal and team accounts. The system employs a multi-tenant architecture with subscription-based access to premium features. The platform is designed to facilitate collaboration while maintaining secure access controls.

### Core Capabilities

- **Configuration Management**: Create, update, and version JSON configuration data
- **Template System**: Create and share configuration templates
- **Team Collaboration**: Team accounts with role-based permissions
- **Version Control**: Track changes to configurations with comparison and restoration
- **Subscription Model**: Tiered access with free and paid options

## Data Architecture

The system uses a relational data model with these core entities:

1. **Users**: Authenticated users of the system
2. **Accounts**: Personal or team accounts containing configurations
3. **Configurations**: JSON configuration data with versioning
4. **Subscriptions**: Subscription status tracking via Stripe

The relationships between these entities form a cohesive data model that supports multi-tenant isolation, role-based access control, and feature availability based on subscription status.

## Business Logic

The business logic in Leger revolves around several key functional areas:

1. **User Management**: Registration, profile management, authentication
2. **Account Management**: Team creation, member management, invitations
3. **Configuration Management**: Creating, updating, versioning configurations
4. **Template System**: Creating, sharing, and applying templates
5. **Subscription Control**: Managing feature access based on subscription status

Each area has well-defined workflows, validation rules, and state transitions that ensure data integrity and proper access controls.

## API Structure

The API is organized into functional domains:

1. **Authentication APIs**: User identity and session management
2. **Account APIs**: Account and team management
3. **Configuration APIs**: Configuration CRUD operations
4. **Version APIs**: Version management and comparison
5. **Billing APIs**: Subscription management via Stripe

Each endpoint has clearly defined request/response formats, authentication requirements, and error handling patterns.

## External Integrations

The system integrates with external services:

1. **Stripe**: Subscription management and payment processing
2. **Email Service**: Transactional emails for invitations and notifications
3. **Fly.io**: Integration with Beam.cloud for processing

These integrations follow established patterns for API communication, webhook processing, and error handling.

## Migration Readiness

The documented business logic, data models, and workflows provide a comprehensive blueprint for reimplementing the system using Cloudflare services:

1. **Cloudflare Workers** will replace the FastAPI application code
2. **Cloudflare D1** will replace the PostgreSQL database
3. **Cloudflare KV and R2** will provide caching and storage
4. **Cloudflare Access** will replace custom authentication
5. **Cloudflare Email Workers** will handle transactional emails

The implementation should maintain all current functionality while leveraging Cloudflare's infrastructure for improved performance, security, and scalability.

## Critical Considerations

For successful implementation, special attention should be paid to:

1. **Authentication Flows**: Mapping Cloudflare Access identities to internal user records
2. **Authorization Logic**: Moving access control from database to application level
3. **Versioning System**: Replacing automatic triggers with explicit versioning code
4. **Subscription Controls**: Maintaining feature access based on subscription status
5. **Webhook Processing**: Ensuring secure and reliable Stripe webhook handling

By carefully implementing the documented business logic and data models, the new system will provide a seamless transition while opening opportunities for future enhancements.

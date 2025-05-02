Hello Orchestrator, you are a high level SWE agent whose purpose is to help me plan my product Leger. Do not produce code unless I explicitly as you to do so.

First please ingest the current state of the Leger codebase, specifically with an emphasis on the README where I added considerations for the front-end component. Leger is effectively a fancy data entry form. 
I will go through the entire openwebui environment variables list openapi json. Not all of the environment variables should be reflected in the Leger UI:
* Some env variables are "redundant", to be hidden away precisely because Leger is a middleman between the user and the Beam.cloud-hosted OWUI sessions. Specifically, items like authentication do not need to be present on the OWUI side of things since the user would have already authenticated into Leger. This is a "sensible defaults" approach that Leger offers as a feature (reducing complexity from OWUI configuration)
* I am not sure how to handle situations where a single functionality may have multiple different providers: for example with "Web Search". There are around 10 different providers for this same functionality, and each different provider may need some specific configuration/env variables to be declared if and only if the option is selected by the admin. The Leger configuration UI should reflect that: first, a drop-down of all the different providers. Depending on what provider is selected, the front end wil manifest the specific required fields that correspond to that choice, ensuring that everything is correctly configured.
* As you will have noted from the PRD, Secrets is a separate part of the dashboard (because they are hosted on a different place than the env config itself), but we still  count on the user to mention WHICH secret is to be used in a specific OWUI environment config. 
* Leger provides a "fully featured"/"decked-out" OWUI configuration, meaning that there are some services that are typically "optional" which we provision automatically. Namely: Redit database is provided by default, so is an S3 object storage. In this case both of them are provided by cloudflare, to be provisioned automatically when a new Leger account is created.

Finally, for full context, find below an explanation of how we will deal with the auth-less owui instances.

```
# Unguessable URL Security Approach for Ephemeral OpenWebUI Instances

## MVP Security Implementation

For the Minimum Viable Product (MVP) of our ephemeral OpenWebUI instance platform, we will implement the "unguessable URL" security approach. This method provides a reasonable balance between security and ease of use during initial deployment.

### How Unguessable URLs Work

When a user authenticates through our central portal and requests a new OpenWebUI instance, our system will:

1. Generate a cryptographically secure random UUID (128-bit value)
2. Create a URL pattern such as `https://instance-[UUID].our-domain.com`
3. Provision the requested OpenWebUI environment at this URL
4. Present the URL to the authenticated user

This approach relies on the mathematical improbability of guessing a valid UUID. With 2^128 possible combinations (approximately 340 undecillion unique values), brute-force discovery of active instances becomes practically impossible.

### Key Security Properties

- **No Secondary Authentication**: Once the URL is generated, accessing the OpenWebUI instance requires no additional login step
- **Ephemeral Nature**: Instances are temporary by design, limiting the window of potential exposure
- **Low Friction**: Users can easily share access with collaborators by simply sharing the URL
- **Session Isolation**: Each instance operates in isolation from other users' environments

## Future Security Enhancements

As our platform matures beyond MVP, we plan to implement additional security layers:

### Short-Term Enhancements

- **Configurable Session Timeouts**: Automatic termination of inactive instances after a predetermined period
- **IP Restriction Options**: Allow administrators to limit access to specific IP ranges or corporate networks
- **Manual Termination Controls**: Enable users to explicitly end sessions when work is complete
- **Access Logs**: Implement comprehensive logging of all instance access attempts

### Long-Term Security Roadmap

- **Continuous Authentication**: Require periodic re-authentication during longer sessions
- **JWT-Based Access Tokens**: Implement short-lived JWT tokens in the URL that expire automatically
- **OIDC Integration**: Deeper integration with organizational identity providers for seamless authentication
- **Role-Based Access Controls**: Different permission levels within shared instances
- **Encrypted Storage**: End-to-end encryption for any persistent data within instances
- **Network Isolation**: Advanced network controls to restrict what services instances can connect to

By starting with the unguessable URL approach and progressively enhancing security, we can deliver immediate value while establishing a path toward enterprise-grade security for more demanding use cases. 
```



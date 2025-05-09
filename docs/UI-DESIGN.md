## Front-end Dashboard Considerations
OWUI has over 340 configuration variables. Currently this was converted to a single OpenAPI json file (in `/schemas`) but we need to further refine the groupings or hierarchies.

Specifically we must first decide which flags to have by default, since Leger provisions some additional functionality by default (as mentioned previously: Redis and S3 storage at the minimum).

From the OWUI environment variables docs, we find that it has the following headers, implying an intuitive grouping:
- App/Backend
- Security Variables
- Vector Database
- RAG Content Extraction Engine
- Retrieval Augmented Generation (RAG)
- Web Search
- Audio
- Image Generation
- OAuth
- LDAP
- User Permissions
- Misc Environment Variables

Leger dashboard is actually used for more than only the OWUI environment variables configuration. 
namely there should be sections for:
* team management (since each admin can add people to his team) which lets them manage invites and other users to be added to their group [INVESTIGATE the leger /backend files to make sure that this is indeed possibler in my data model]; there might also be the opportunity for the admin to set user-specific permissions within the openwebui interface 
* secrets: this is where the admin can input LLM API keys (like openai, openrouter, claude anthropic etc etc) 
* tools: COMING SOON, but Leger goes beyond "simple" openwebui front end deployments. indeed, the admin should also be able to provision tools on demand. with openwebui, tools can be "injected" directly into the chat interface, or "abstracted" into an openwebui pipeline. we want to have a "gallery view" which shows all the preset/"approved" tools 
* api keys: some tools are MCP servers which connect to third-party services; for example a google calendar, linear.app or other servers (related to some of but not all the Tools in the section above)
* billing/plans: a simple button for managing account billing. is a stripe redirect to begin with but then is managed in-webapp.
* analytics: COMNG SOON lets the admin do some monitoring on their team's openwebui usage activity
Note: api keys and Secrets are managed by beam.cloud secrets directly rather than through my own database.




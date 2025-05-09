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

# Work in progress:
1) Prompt:
```
now moving on to the most important task at hand: creating the full GUI that illustrates the user journey from start to finish. for that we will use cloudflare workers (blog post atached here).  we are aiming for a full drill-thru, so to begin with we can keep the "default" python script to start the beam.cloud hosted pods running openwebui (it spins up a new openwebui instance each time), and "simulate"/use the actual user flow. so we generate the shadcn frontend and deploy the webapp on cloudflare workers, with account creation (only free access for now). no even need for staging right now just aim for mvp drillthrough.
i was working on the immedsiate next steps indivudsually but realiozed that this is not the most pressing metter. the most pressing matter is to have a comprehensive mockup ui that i can click through and underastand the barebones journey. it s about "deploying" or the first time and ironing out all the issues. it s about creating the asccounts and setting up the databases and api keys oin the actual services. 
i think this approahc is mofre sensible. prepare a comprhensive systme prompt that i can feed ot anm LLM whhich has acces to the whole leger labs ui codebase so far wit hthe above in mind. 
use markdown and favor artifacts for each according to an oprchestrator-type level of thinking.
```

2) Notes
#### UX Design Philosophy
- Leger is essentially a fancy data entry form, but a very opinionated one: we hide complexity and reduce surface area.
- Most OpenWebUI variables are pre-filled or hidden from the user—Leger acts as a middleware layer to provide sensible defaults.
- You must simulate a deployment journey from landing page to successful pod creation using dummy data or placeholder states.
#### Key UX Rules
- Some config options (like auth settings) are omitted from the UI because users are already authenticated in Leger.
- If a setting (e.g., "Web Search Provider") supports multiple values, show a dropdown. When a provider is selected, render only the fields relevant to that choice.
- Secrets (e.g., API keys) are stored separately and linked by name. The config UI only refers to them by name, not value.
- Certain services (Redis, Object Storage) are auto-provisioned and need no user input. Just show that they’re "enabled by default".



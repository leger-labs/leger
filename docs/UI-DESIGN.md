## Front-end Dashboard Considerations
OWUI has over 350 configuration variables. Currently this is managed through a single OpenAPI json file (in `/schemas`) but we need to further refine the groupings or hierarchies.

Leger dashboard is a classic shadcn look, 2025 standard webapp with a breadcrumb-style look: on the left first the leger logo 🌍 / {team name} and on the right: feedback (sento email), Docs and top right a user menu which drops some settings down: username, email, Account settings, BAR, command menu (ctrl+K), Theme (system, light, dark), BAR, Log out, and a button that says "Upgrade to Pro" or "Pro" depending on the plan).

Below that we have a horizontal menu with the following tabs:
- Configs: The default page in Leger. Lets the user create OWUI configurations and launch OWUI instances. From the OWUI environment variables docs, we find that it has the following headers, implying an intuitive grouping (we removed groupings that are not used in the case of Leger):
    - Vector Database
    - RAG Content Extraction Engine
    - Retrieval Augmented Generation (RAG)
    - Web Search
    - Audio
    - Image Generation
    - Misc 
* team management (since each admin can add people to his team) which lets them manage invites and other users to be added to their group [INVESTIGATE the leger /backend files to make sure that this is indeed possible in my data model]; there might also be the opportunity for the admin to set user-specific permissions within the openwebui interface 
* tools: COMING SOON, but Leger goes beyond "simple" openwebui front end deployments. indeed, the admin should also be able to provision tools on demand. with openwebui, tools can be "injected" directly into the chat interface, or "abstracted" into an openwebui pipeline. we want to have a "gallery view" which shows all the preset/"approved" tools 
* api keys: some tools are MCP servers which connect to third-party services; for example a google calendar, linear.app or other servers (related to some of but not all the Tools in the section above)
* secrets: this is where the admin can input LLM API keys (like openai, openrouter, claude anthropic etc etc) 
* analytics: COMNG SOON lets the admin do some monitoring on their team's openwebui usage activity

In the account settings we have the following:
- user settings like how Vercel does it
* billing: a simple button for managing account billing. is a stripe redirect to begin with but then is managed in-webapp. We use Stripe's Customer Portal for subscription management, seamlessly integrated with our UI through a "Manage Billing" option within the dashboard. When users navigate to billing, they'll be redirected to a secure Stripe-hosted page where they can view their current subscription details, payment methods, invoicing history, and make changes to their plan. This approach balances simplicity with functionality, providing a professional billing experience while minimizing development complexity. Though visually distinct from our main interface, this separation clearly signals to users when they're entering a payment-related section, enhancing trust and security perception. The portal will return users to Leger upon completion of any billing actions, maintaining a cohesive overall experience despite the temporary UI context switch.

# Work in progress:
1) Prompt:
```
now moving on to the most important task at hand: creating the full GUI that illustrates the user journey from start to finish. for that we will use cloudflare workers (blog post atached here).  we are aiming for a full drill-thru, so to begin with we can keep the "default" python script to start the beam.cloud hosted pods running openwebui (it spins up a new openwebui instance each time), and "simulate"/use the actual user flow. so we generate the shadcn frontend and deploy the webapp on cloudflare workers, with account creation (only free access for now). no even need for staging right now just aim for mvp drillthrough.
i was working on the immedsiate next steps indivudsually but realiozed that this is not the most pressing metter. the most pressing matter is to have a comprehensive mockup ui that i can click through and underastand the barebones journey. it s about "deploying" or the first time and ironing out all the issues. it s about creating the asccounts and setting up the databases and api keys oin the actual services. 
i think this approahc is more sensible. prepare a comprhensive systme prompt that i can feed ot anm LLM whhich has acces to the whole leger labs ui codebase so far wit hthe above in mind. 
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


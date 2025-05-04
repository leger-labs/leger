Currently want: full slice to be able to launch webapp end to end. Definition of done: have a webui instance deployed on command.
For MVP
This is regardless of whether i am able to build an entire webapp from the openwebui spec programmatically, "new owui" should the defrault example config. Conceptually, app.leger.run login with google account, free trial begins (email sent), navigate the ui with skeleton of all options (if successful), can click "start owui" sand the vanilla launches in new URL
Finish the openapi centralized spec for openwebui configuration; then investigate going to zod > reactwebform and shadcn code.
Can the openwebui json oenapi spec act as a full sitemap for the webapp with descriptions for each page?


---
Notes on the work in progress /schema part of the leger repo:
- variable annotation task did not properly ingest data types from the markdown docs. redo
- not sure on using {{brackets}} for scerets, user info (email), prompt update from variable 150 i see they point to another variable ${openapi_url}. we want to reuse secrets (api keys) across each account since they may create multiple owui configs. 
- once we understand the above (this is a design decision) make api secrets external, that way the user gets it auto-loaded (set once per accoumt, get it for all the owui configs on his account)
- in the "final" leger annotation, i added fields for future "feature" numbers > heklps with the further breakdown into tasks. the logic here is that we use the front-end as "design" visually showing all the features to be built while they are not even ready yet.

---
uncertainties:
- python vs ts operations in the backend for example user account creating

new insight: the zod validation schema was not a good choice for being single source of truth because it has to be per-page. it is not a unified file and on a per data entry form per entity basis (entity is a grouping of env variables)


----
## "Side Activities" on owui side of things:
1) Gh repo ingestion mechanism (new feature) https://github.com/open-webui/open-webui/discussions/10893
2) cloudflare vectorize add flags to opebui+docs
3) add in aider based code editing tool as PR's (better than openhands)



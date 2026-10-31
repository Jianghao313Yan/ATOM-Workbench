# ATOM cloud AI setup

The repository includes an authenticated Supabase Edge Function at `supabase/functions/atom-assistant/index.ts`. It keeps the OpenAI API key on the server and requires a signed-in Supabase user.

## Required accounts and costs
- A Supabase project with Edge Functions enabled.
- An OpenAI API key with API billing configured. ChatGPT subscriptions do not automatically include API usage.
- The model defaults to `gpt-6-astra`; optionally set `OPENAI_MODEL` to another model available to your API project.

## Deploy using GitHub Actions (phone-friendly)
1. In Supabase Dashboard, create/open your project and copy its project reference from the project URL.
2. In Supabase Dashboard → Project Settings → Edge Functions / Secrets, add `OPENAI_API_KEY`. Optionally add `OPENAI_MODEL`.
3. In GitHub repository Settings → Secrets and variables → Actions, add:
   - `SUPABASE_ACCESS_TOKEN`: a Supabase personal access token.
   - `SUPABASE_PROJECT_REF`: your project reference.
4. Run the workflow **Deploy Supabase Assistant** from the GitHub Actions page, or push a change under `supabase/functions/`.
5. The workflow deploys only the `atom-assistant` function. The function requires a valid Supabase user JWT; do not disable JWT verification.
6. Open ATOM, configure the same Supabase Project URL and anon/public key, register/login, then send a normal question in the assistant panel.

## What is sent to the AI
When signed in and the function is deployed, the current message and up to eight recent chat turns are sent to the OpenAI API. Card contents are not included. The function sets `store: false` on the Responses API request. Provider-side data handling is still governed by your OpenAI API account and applicable terms.

## Secret handling
- Never put `OPENAI_API_KEY`, `SUPABASE_ACCESS_TOKEN`, or a Supabase `service_role` key in browser storage, HTML, JavaScript, APKs, or Git commits.
- The GitHub Actions secrets are used only for deployment. The OpenAI key belongs in Supabase Edge Function secrets.
- The browser receives only the public anon/publishable key and a user's own short-lived session.

## Current boundaries
The AI function is a text assistant only. It does not run tools, manipulate other apps, access the device filesystem, or execute tasks autonomously. No rate-limit or per-user usage quota is configured yet; monitor API usage and set provider spending limits before broad use.

# ATOM Workbench

A phone-first personal workspace prototype for foldable devices, initially targeting Huawei HarmonyOS and Samsung Android.

## Current features
- Responsive installable PWA.
- Local card create, edit, delete, search, reorder and voice input where browser speech recognition is supported.
- Local command assistant for adding tasks, searching cards and listing the workspace. Once the optional authenticated Edge Function is deployed and the OpenAI server secret is configured, free-form messages can be sent to the OpenAI Responses API.
- JSON backup export/import for manual transfer.
- Optional Supabase email/password account and **manual** per-account cloud upload/restore, protected by row-level security (RLS).
- Android WebView wrapper and preliminary HarmonyOS ArkTS entry source.

## Enable cloud transfer
1. Create a Supabase project at https://supabase.com/ (free tier may be sufficient for initial testing).
2. Open Supabase Dashboard → SQL Editor and run the complete script in `supabase/atom-workspaces.sql`.
3. Open Project Settings → API and copy the Project URL and anon/public (or publishable) client key. Never use the `service_role` secret key.
4. Open the deployed ATOM PWA, expand **首次设置**, enter those two values and save.
5. Register the same email/password on both devices (verify email if requested).
6. On the first device choose **上传本机数据**. On the second choose **从云端恢复**. Restore replaces that device's local cards after a confirmation prompt.

The cloud controls currently provide explicit manual upload and restore, not background or real-time synchronization. Local cards and chat history remain on each device unless cards are uploaded. The Supabase client key is a public client key; access is restricted by database RLS so authenticated users can access only their own row.

## Important limitations
This is an early prototype, not a complete recreation of vivo Atomic Workbench. The assistant is a local command parser, not an LLM. It cannot answer open-ended questions or control other apps. No AI model/backend, automatic conflict-aware sync, native system-level drag-and-drop, background agents, or OS-level automation are implemented. Android and HarmonyOS compatibility must be tested on the actual devices. The Android wrapper requires the PWA URL to be deployed first. The HarmonyOS source is not yet a complete buildable HAP project.

## Deploy and build
1. In repository Settings → Pages, select **GitHub Actions** as the source.
2. The PWA workflow deploys the contents of `pwa/` to GitHub Pages on changes under that directory.
3. The Android workflow builds a debug APK on changes under `android/`; download it from the successful workflow run's Artifacts section.

## Security
This repository is public. Never commit passwords, API keys, access tokens, customer information, or private data. The browser stores the Supabase URL and public anon/publishable key locally on the device. Never enter or publish the Supabase `service_role` key. Do not put AI provider secrets in browser JavaScript or the APK; a separate trusted server-side function is required for AI integration.

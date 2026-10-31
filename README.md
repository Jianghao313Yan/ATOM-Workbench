# ATOM Workbench

A cross-device personal workbench prototype for foldable Android and HarmonyOS devices.

## Current prototype
- `pwa/`: responsive installable web app, local card storage, create/edit/delete cards, desktop drag-and-drop and touch long-press reorder, browser speech recognition where supported.
- `android/`: Android WebView wrapper that loads the hosted PWA; APK is intended to be produced by GitHub Actions.
- `harmony/`: preliminary ArkTS entry-point source only; this is not yet a complete, buildable HarmonyOS application.
- `.github/workflows/`: GitHub Pages deployment and Android debug APK build workflows.

## Important limitations
This is an early prototype, not a complete recreation of vivo Atomic Workbench. It does not yet include an AI model/backend, account login, cloud synchronization, cross-device shared data, native system-level drag-and-drop, background agents, or OS-level automation. Android and HarmonyOS compatibility must be tested on the actual devices. The Android wrapper requires the PWA URL to be deployed first.

## Deploy and build
1. In repository Settings → Pages, select **GitHub Actions** as the source.
2. The PWA workflow deploys the contents of `pwa/` to GitHub Pages on changes under that directory.
3. The Android workflow builds a debug APK on changes under `android/`; download it from the successful workflow run's Artifacts section.

## Security
This repository is public. Never commit passwords, API keys, access tokens, customer information, or private data. Provider credentials must be kept on a backend, not in browser JavaScript or the APK.

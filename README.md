# ATOM Workbench

A cross-device personal AI workbench prototype for foldable Android and HarmonyOS devices.

## What's included
- `pwa/`: installable web-app prototype with a responsive dashboard, local card storage, and browser-dependent speech recognition.
- `docs/`: architecture, security, deployment, and current-status notes.
- `.github/workflows/deploy-pwa.yml`: GitHub Pages deployment workflow.

## Important status
This is an early prototype, not a complete recreation of vivo Atomic Workbench. AI model integration, cloud sync, drag-and-drop orchestration, Android native packaging, HarmonyOS HAP packaging, and device-level automation are not yet implemented or verified. The native Android and HarmonyOS folders from the preliminary design package have not yet been committed to this repository.

## Deploy
Enable GitHub Pages with **GitHub Actions** as the source in repository Settings → Pages, then run the **Deploy PWA** workflow under Actions.

## Security
This repository is public. Never commit passwords, API keys, access tokens, customer data, or other secrets. Put model-provider credentials on a backend and use GitHub Actions secrets for CI.

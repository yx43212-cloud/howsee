# SHowSexy

A static prototype for rewriting direct adult prompts into image-generation-oriented English prompts with Traditional Chinese confirmation text. The app preserves the user's high-level intent while adding adult-only consent guardrails and more visual language around mood, composition, pose, lighting, and texture.

## Features

- Rule-based prompt rewriting with Traditional Chinese review text and English copy output.
- Intensity selector with soft, medium, and strong output styles.
- Guardrails that reject underage, non-consensual, voyeuristic, and graphic violence cues.
- Browser-only implementation with no backend or data collection.
- 50 lighting-direction presets, 20 camera-angle presets, and 50 art-style presets for richer visual direction.
- Gender selection plus 100 race presets, split into 50 daily and 50 rare options.
- 100 outfit presets and 100 scene presets, each split into 50 daily and 50 rare options.
- 30 emotion presets, 30 outfit-color presets, 30 body-feature presets, outfit-integrity controls, 30 face presets, 20 count/composition presets, and 50 usable body pose/posture presets.
- Lighting presets avoid scene terms, and pose/outfit presets avoid leaking lighting or scene terms so prompt elements do not conflict.
- Output shows Chinese confirmation text only for review; the copyable result area contains the English generation prompt only.
- Free-form custom conditions field that can be appended to the final prompt after the same safety validation.

## Run locally

Open `index.html` in a browser, or run the included static server:

```bash
npm run dev
```

By default the app listens on `0.0.0.0:3000`. In a local terminal, open `http://localhost:3000/`. To choose another port, run `PORT=8080 npm run dev` or `npm run dev -- --port 8080`.

## Deploy to Vercel

This project is ready for Vercel as a static site. Use these settings when importing the repository:

- Framework Preset: `Other`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Development Command: `npm run dev`

The included `vercel.json` sets the build command and output directory for Vercel automatically.

## Test

```bash
npm test
npm run check
npm run build
```

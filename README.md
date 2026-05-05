# 好想瑟瑟 Prompt Rewriter

A static prototype for rewriting direct adult prompts into image-generation-oriented Traditional Chinese descriptions. The app preserves the user's high-level intent while adding adult-only consent guardrails and more visual language around mood, composition, pose, lighting, and texture.

## Features

- Rule-based Traditional Chinese prompt rewriting.
- Intensity selector with soft, medium, and strong output styles.
- Guardrails that reject underage, non-consensual, voyeuristic, and graphic violence cues.
- Browser-only implementation with no backend or data collection.
- 20 Chinese lighting-direction presets, 20 Chinese camera-angle presets, and 50 Chinese art-style presets for richer visual direction.
- 50 race presets, 50 expression presets, 20 time-point presets, plus 300 role customization options across face, outfit, character count, scene, and pose categories, including 100 outfit presets, 100 scene presets, and 50 usable body pose/posture presets.
- Output includes a Chinese confirmation prompt first, then an English generation prompt for final copy/paste use.
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

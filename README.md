# 好色之圖HowSir

A static prototype for rewriting direct adult prompts into image-generation-oriented English prompts with Traditional Chinese confirmation text. The app preserves the user's high-level intent while adding adult-only consent guardrails and more visual language around mood, composition, pose, lighting, and texture.

## Features

- Rule-based prompt rewriting with Traditional Chinese review text and English copy output.
- Intensity selector with soft, medium, and strong output styles.
- Guardrails that reject underage, non-consensual, voyeuristic, and graphic violence cues.
- Browser-only implementation with no backend or data collection.
- 50 lighting-direction presets, 50 pure camera/viewpoint presets, 50 composition-structure presets, and 50 art-style presets for richer visual direction.
- Gender selection plus 100 race presets, with the latter 50 dedicated to non-natural fantasy/sci-fi races and no visible category tags in the selector labels.
- 100 outfit presets split into 50 everyday looks followed by 50 seductive/intimate looks, plus 100 scene presets and 100 accessory/prop presets without visible category tags in the selector labels.
- 20 time-point presets with Chinese light/color/texture annotations, 50 emotion presets, 50 outfit-color presets, 50 outfit-material presets, 50 occupation presets, 50 body-proportion presets, age brackets through 60, 30 body-feature presets, outfit-integrity controls, 30 face presets, 20 count/composition presets, 300 count-aware action presets for 1/2/3 characters including 50 more provocative adult-only actions, 300 count-aware position/interaction presets, and per-character customization when more than one character is selected.
- Every selector includes an AI-decide option; camera/viewpoint presets avoid scenes/actions, lighting presets avoid expression terms, and source prompt text takes precedence over duplicate or conflicting presets.
- Output shows Chinese confirmation text only for review; the copyable result area contains the English generation prompt only.
- Image-to-video prompt suggestions: upload a reference image, estimate an adult-only explicitness score from 1-10 locally in the browser, and generate selectable score-aware Chinese meaning confirmations plus English copyable image-to-video prompts.
- Optional user-directed image-to-video motion requests are safety-screened; rejected requests include Chinese/English revision advice for making the prompt pass guardrails.
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

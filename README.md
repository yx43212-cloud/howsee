# 好想瑟瑟 Prompt Rewriter

A static prototype for rewriting direct adult prompts into image-generation-oriented Traditional Chinese descriptions. The app preserves the user's high-level intent while adding adult-only consent guardrails and more visual language around mood, composition, pose, lighting, and texture.

## Features

- Rule-based Traditional Chinese prompt rewriting.
- Intensity selector with soft, medium, and strong output styles.
- Guardrails that reject underage, non-consensual, voyeuristic, and graphic violence cues.
- Browser-only implementation with no backend or data collection.

## Run locally

Open `index.html` in a browser, or serve the directory with any static file server.

## Test

```bash
npm test
npm run check
```

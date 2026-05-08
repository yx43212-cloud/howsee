# 擬愛 NIAI

擬出你愛的提示詞，把想像都變現實。A static prototype for rewriting prompts into image-generation-oriented English prompts with Traditional Chinese confirmation text. The app preserves the user's high-level intent while adding adult-only consent guardrails and more visual language around mood, composition, pose, lighting, and texture.

## Features

- Rule-based prompt rewriting with Traditional Chinese review text and English copy output.
- Lower-pressure multi-page UX: Gmail-bound local login splits 設友/色友 modes, allows in-page mode switching without reload, keeps Cosplay as the only main prompt input, and uses previous/next wizard pages so each step exposes only 2-3 controls, adds a practical 業配 placement workflow, and further splits character and scene/action controls into smaller substeps.
- Independent 色友-only adult-atmosphere selector with soft, medium, and strong output styles that now inject distinct applied guidance for camera distance, body language, and tension.
- Guardrails that reject underage, non-consensual, voyeuristic, and graphic violence cues; 設友 mode only shows general design presets, filters adult-oriented materials and outfit-integrity controls, while 色友 reveals a separate adult-oriented area after confirmation.
- Browser-only implementation with no backend or data collection.

- Anonymous 紅線公寓 community prototype: after Gmail login, users receive 1 point for daily login and 1 point for anonymously sharing their current prompt; 3 points draw one redline card and 5 points draw two cards from anonymous bilingual prompt shares filtered by desired gender, adult age bracket, and 設友/色友 nature.
- Language switching now also refreshes generated/local saved/community comparison text into the selected interface language paired with the unchanged English prompt output.
- 50 lighting-direction presets, 50 pure camera/viewpoint presets, 20 composition-structure presets, and 100 art-style presets for richer visual direction.
- Gender selection plus 100 race presets, with the latter 50 dedicated to non-natural fantasy/sci-fi races and no visible category tags in the selector labels.
- 400 explicitly named outfit presets split into male/female 100 normal and 100 adult-oriented sets, plus 200 explicitly named scene presets (100 everyday and 100 mysterious) and 150 explicitly named accessory/prop presets without visible category prefixes in selector labels.
- 20 time-point presets with Chinese light/color/texture annotations, 50 emotion presets, 50 outfit-color presets, 50 outfit-material presets, 50 occupation presets, 50 body-proportion presets, age brackets through 60, 30 body-feature presets, outfit-integrity controls, 30 face presets, 20 count presets, 200 action/posture presets split into four modes, each with 25 normal and 25 adult-oriented options, and expanded per-character customization for gender, race, emotion, job, age, body, face, outfit, color, material, body feature, and outfit integrity when more than one character is selected.
- Every selector includes an AI-decide option; camera/viewpoint presets avoid scenes/actions, lighting presets avoid expression terms, and Cosplay input takes precedence over duplicate or conflicting presets.
- Cosplay field consolidates custom character direction into one place, accepts Chinese or English role/style notes, translates supported Chinese Cosplay phrases and modifiers into English prompt text instead of collapsing them to one noun, and keeps Chinese confirmation text only for review.
- Text-to-image generation automatically creates 5 AI-judged image-to-video variants with Chinese explanation text for review and separate copyable English prompts; 業配 settings include placement content, audience age/identity, campaign goal, exposure timing, and exposure form; the Dialogue area supports camera-facing and character-to-character lines that update video prompts automatically; users can save titled prompt threads with Chinese/English pairs, delete saved prompts, and attach compressed non-downloadable result images locally for comparison.
- Optional user-directed image-to-video motion requests are safety-screened; 設友 image-to-video output stays general-audience and proposes 3-5 motions inferred from the uploaded image description/file context, while 色友 keeps adult-only guardrails and rejected requests include Chinese/English revision advice.

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

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  rewritePrompt,
  createImageToVideoPrompt,
  estimateExplicitnessScore,
  COMPOSITION_STRUCTURES,
  OCCUPATION_OPTIONS,
  BODY_PROPORTION_OPTIONS,
  AGE_BRACKET_OPTIONS,
  getActionDetailsForMode,
  ACTION_MODE_OPTIONS,
  ACTION_DETAIL_OPTIONS,
  LIGHTING_DESCRIPTIONS,
  CAMERA_ANGLES,
  ART_STYLES,
  RACE_OPTIONS,
  EMOTION_OPTIONS,
  EXPRESSION_OPTIONS,
  TIME_POINTS,
  CUSTOMIZATION_OPTIONS,
  checkElementBoundaries
} = require('../src/translator');

test('rewrites direct adult wording into safe English copy output with Chinese confirmation separated', () => {
  const result = rewritePrompt('脫衣服 親吻', { intensity: 'medium' });

  assert.equal(result.ok, true);
  assert.equal(result.screened, true);
  assert.match(result.englishPrompt, /subject\/action: .*fabric sliding/);
  assert.match(result.englishPrompt, /passionate kissing/);
  assert.match(result.englishPrompt, /safety: all characters are clearly 18\+/);
  assert.match(result.chineseConfirmation, /中文|主題|性別|光感|安全/);
  assert.equal(result.prompt, result.englishPrompt);
  assert.doesNotMatch(result.prompt, /【中文確認提示詞】|【English generation prompt】|主題／動作|光感/);
});

test('keeps semantic intent for solo intimate prompt without using the original keyword', () => {
  const result = rewritePrompt('自慰', { intensity: 'soft' });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /private adult sensual mood/);
  assert.match(result.prompt, /intensity: soft sensuality/);
});

test('rejects underage content', () => {
  const result = rewritePrompt('學生 脫衣服');

  assert.equal(result.ok, false);
  assert.equal(result.screened, false);
  assert.match(result.reason, /未成年人/);
});

test('rejects non-consensual content', () => {
  const result = rewritePrompt('強迫 親吻');

  assert.equal(result.ok, false);
  assert.match(result.reason, /非合意/);
});

test('provides requested preset counts for visual controls', () => {
  assert.equal(LIGHTING_DESCRIPTIONS.length, 50);
  assert.equal(CAMERA_ANGLES.length, 50);
  assert.equal(COMPOSITION_STRUCTURES.length, 50);
  assert.equal(ART_STYLES.length, 100);
  assert.equal(TIME_POINTS.length, 20);
  assert.ok(TIME_POINTS.every(({ en }) => /light|color|texture/.test(en)));
  assert.ok(TIME_POINTS.every(({ zh }) => /光|色|質感/.test(zh)));
});

test('provides requested gender, race, emotion, outfit, scene, and body customization counts', () => {
  assert.equal(CUSTOMIZATION_OPTIONS.genders.length, 5);
  assert.equal(RACE_OPTIONS.length, 100);
  assert.equal(RACE_OPTIONS.filter(({ rarity }) => rarity === 'daily').length, 50);
  assert.equal(RACE_OPTIONS.filter(({ rarity }) => rarity === 'rare').length, 50);
  assert.ok(RACE_OPTIONS.slice(50).every(({ en }) => /adult/.test(en)));
  assert.equal(EMOTION_OPTIONS.length, 50);
  assert.equal(EXPRESSION_OPTIONS, EMOTION_OPTIONS);
  assert.equal(CUSTOMIZATION_OPTIONS.faces.length, 30);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.length, 100);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.filter(({ rarity }) => rarity === 'daily').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.filter(({ rarity }) => rarity === 'rare').length, 50);
  assert.match(CUSTOMIZATION_OPTIONS.outfits[0].en, /shirt|trousers|dress|jacket|cardigan|jeans|knit|blouse|sweater|suit|casual|linen|denim|sleepwear/);
  assert.match(CUSTOMIZATION_OPTIONS.outfits[50].en, /lace|satin|sheer|corset|bodysuit|garter|latex|seduction|cutout|mesh/);
  assert.equal(CUSTOMIZATION_OPTIONS.outfitColors.length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.outfitMaterials.length, 50);
  assert.equal(OCCUPATION_OPTIONS.length, 50);
  assert.equal(BODY_PROPORTION_OPTIONS.length, 50);
  assert.equal(AGE_BRACKET_OPTIONS.at(-1).zh, '56-60 歲');
  assert.equal(CUSTOMIZATION_OPTIONS.bodyFeatures.length, 30);
  assert.equal(CUSTOMIZATION_OPTIONS.outfitIntegrity.length, 10);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.length, 100);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.filter(({ rarity }) => rarity === 'daily').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.filter(({ rarity }) => rarity === 'rare').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.accessories.length, 100);
  assert.equal(CUSTOMIZATION_OPTIONS.accessories.filter(({ rarity }) => rarity === 'daily').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.accessories.filter(({ rarity }) => rarity === 'intimate').length, 50);
  assert.equal(ACTION_MODE_OPTIONS.length, 4);
  assert.equal(CUSTOMIZATION_OPTIONS.actions.length, 200);
  for (const mode of ACTION_MODE_OPTIONS) {
    const details = getActionDetailsForMode(mode.zh);
    assert.equal(details.length, 50);
    assert.equal(details.filter(({ zh }) => /正常/.test(zh)).length, 25);
    assert.equal(details.filter(({ zh }) => /情慾/.test(zh)).length, 25);
  }
  assert.equal(Object.keys(ACTION_DETAIL_OPTIONS).length, 4);
  assert.equal(CUSTOMIZATION_OPTIONS.poses.length, 0);
});

test('keeps lighting, pose, and outfit preset domains from leaking conflicting scene or light terms', () => {
  assert.deepEqual(checkElementBoundaries(), {
    lightingHasSceneLeak: false,
    lightingHasExpressionLeak: false,
    cameraHasSceneOrActionLeak: false,
    poseHasLightingOrSceneLeak: false,
    outfitHasSceneLeak: false
  });
});

test('adds selected gender, race, emotion, body, outfit, and scene customization to separated prompts', () => {
  const result = rewritePrompt('親吻', {
    lighting: LIGHTING_DESCRIPTIONS[3].zh,
    camera: CAMERA_ANGLES[4].zh,
    artStyle: ART_STYLES[2].zh,
    gender: CUSTOMIZATION_OPTIONS.genders[1].zh,
    race: RACE_OPTIONS[50].zh,
    emotion: EMOTION_OPTIONS[6].zh,
    timePoint: TIME_POINTS[7].zh,
    face: CUSTOMIZATION_OPTIONS.faces[2].zh,
    outfit: CUSTOMIZATION_OPTIONS.outfits[50].zh,
    outfitColor: CUSTOMIZATION_OPTIONS.outfitColors[2].zh,
    bodyFeature: CUSTOMIZATION_OPTIONS.bodyFeatures[0].zh,
    outfitIntegrity: CUSTOMIZATION_OPTIONS.outfitIntegrity[3].zh,
    count: CUSTOMIZATION_OPTIONS.counts[1].zh,
    scene: CUSTOMIZATION_OPTIONS.scenes[50].zh,
    accessory: CUSTOMIZATION_OPTIONS.accessories[55].zh,
    actionMode: ACTION_MODE_OPTIONS[1].zh,
    actionDetail: getActionDetailsForMode(ACTION_MODE_OPTIONS[1].zh)[25].zh,
    cosplayPrompt: 'vampire queen with pearl accessories'
  });

  assert.equal(result.ok, true);
  assert.match(result.chineseConfirmation, /性別：男性成人/);
  assert.match(result.chineseConfirmation, /種族：精靈族/);
  assert.match(result.chineseConfirmation, /情緒：咬唇表情/);
  assert.match(result.chineseConfirmation, /身上特徵：豐滿胸型/);
  assert.match(result.chineseConfirmation, /服裝：蕾絲深V連身衣/);
  assert.match(result.chineseConfirmation, /服裝配色：酒紅/);
  assert.match(result.chineseConfirmation, /服裝完整度：外套半披/);
  assert.match(result.chineseConfirmation, /場景：金色宮殿內室/);
  assert.match(result.chineseConfirmation, /光感：正面柔光/);
  assert.match(result.chineseConfirmation, /配件／道具：皮革腿環/);
  assert.match(result.chineseConfirmation, /Cosplay：vampire queen with pearl accessories/);
  assert.match(result.englishPrompt, /gender: adult man/);
  assert.match(result.englishPrompt, /race: elf/);
  assert.match(result.englishPrompt, /emotion: soft lip-biting expression/);
  assert.match(result.englishPrompt, /body feature: full bust/);
  assert.match(result.englishPrompt, /outfit: lace deep-V bodysuit/);
  assert.match(result.englishPrompt, /outfit color palette: wine red/);
  assert.match(result.englishPrompt, /outfit integrity: jacket half-draped/);
  assert.match(result.englishPrompt, /scene: golden palace inner chamber/);
  assert.match(result.englishPrompt, /lighting: front soft light/);
  assert.match(result.englishPrompt, /accessory\/prop: leather thigh garter/);
  assert.match(result.englishPrompt, /cosplay\/character direction: vampire queen with pearl accessories/);
  assert.match(result.chineseConfirmation, /動作／姿態類型：手部動作/);
  assert.match(result.chineseConfirmation, /動作／姿態細項：.*情慾/);
  assert.match(result.englishPrompt, /action\/posture detail: kneading fabric over chest/);
  assert.doesNotMatch(result.englishPrompt, /性別|種族|情緒|服裝|場景|光感/);
});


test('does not append category tag text to browser option labels', () => {
  const appSource = require('node:fs').readFileSync(require('node:path').join(__dirname, '../src/app.js'), 'utf8');

  assert.doesNotMatch(appSource, /稀少|少見|（日常）|（情趣）|rarityLabel/);
  assert.match(appSource, /return typeof optionText === 'string' \? optionText : optionText\.zh/);
});

test('keeps copyable output English-only even when the source has unsupported Chinese terms', () => {
  const result = rewritePrompt('性感站著', { intensity: 'medium' });

  assert.equal(result.ok, true);
  assert.doesNotMatch(result.englishPrompt, /[\u3400-\u9fff]/);
  assert.match(result.chineseConfirmation, /性感站著/);
  assert.match(result.englishPrompt, /adult sensual visual direction based on the reviewed source request/);
});

test('appends safe Cosplay character direction to the English prompt and confirmation', () => {
  const result = rewritePrompt('親吻', {
    cosplayPrompt: '珍珠配件 vampire queen'
  });

  assert.equal(result.ok, true);
  assert.match(result.chineseConfirmation, /Cosplay：珍珠配件 vampire queen/);
  assert.match(result.englishPrompt, /cosplay\/character direction: user-provided cosplay or character direction/);
});

test('rejects unsafe Cosplay character direction', () => {
  const result = rewritePrompt('親吻', {
    cosplayPrompt: '學生 costume'
  });

  assert.equal(result.ok, false);
  assert.match(result.reason, /未成年人/);
});

test('preview UI is removed from the simplified layout', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const indexSource = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const appSource = fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf8');
  const styleSource = fs.readFileSync(path.join(__dirname, '../src/styles.css'), 'utf8');

  assert.doesNotMatch(indexSource, /beginnerPreview|imagePreview|客製化條件/);
  assert.doesNotMatch(appSource, /beginnerPreview|imagePreview|customConditions/);
  assert.doesNotMatch(styleSource, /beginner-preview|image-preview/);
});

test('all customization selectors include AI judgment in the browser', () => {
  const appSource = require('node:fs').readFileSync(require('node:path').join(__dirname, '../src/app.js'), 'utf8');

  assert.match(appSource, /aiOption\.textContent = 'AI判斷'/);
  assert.match(appSource, /populateSelect\(composition, COMPOSITION_STRUCTURES\)/);
  assert.match(appSource, /populateSelect\(outfitMaterial, CUSTOMIZATION_OPTIONS\.outfitMaterials\)/);
  assert.match(appSource, /populateSelect\(actionMode, ACTION_MODE_OPTIONS\)/);
  assert.match(appSource, /getTextRewriteSource/);
  assert.match(appSource, /selected customization controls/);
  assert.match(appSource, /buildAutoVideoChoices/);
  assert.match(appSource, /autoVideoChoice/);
});

test('key prompt element groups do not contain duplicate visible labels', () => {
  const groups = [
    LIGHTING_DESCRIPTIONS,
    CAMERA_ANGLES,
    COMPOSITION_STRUCTURES,
    ART_STYLES,
    EMOTION_OPTIONS,
    CUSTOMIZATION_OPTIONS.outfits,
    CUSTOMIZATION_OPTIONS.outfitColors,
    CUSTOMIZATION_OPTIONS.outfitMaterials,
    CUSTOMIZATION_OPTIONS.accessories,
    CUSTOMIZATION_OPTIONS.actions,
    OCCUPATION_OPTIONS,
    BODY_PROPORTION_OPTIONS
  ];

  for (const group of groups) {
    const labels = group.map(({ zh }) => zh);
    assert.equal(new Set(labels).size, labels.length);
  }
});

test('estimates image-to-video explicitness from image signals and desired motion', () => {
  assert.equal(estimateExplicitnessScore({ skinToneRatio: 0 }), 1);
  assert.ok(estimateExplicitnessScore({ skinToneRatio: 0.55, desiredMotion: 'sensual lingerie slow push-in' }) >= 7);
});

test('creates safe image-to-video prompts with Chinese meaning confirmation and English copy output', () => {
  const result = createImageToVideoPrompt({
    fileName: 'adult-boudoir.png',
    imageDescription: '成人女性、黑色連身裙、室內寫真',
    desiredMotion: 'slow push-in, hair and fabric gently moving, confident gaze',
    skinToneRatio: 0.35,
    durationSeconds: 8,
    motionStrength: 'subtle'
  });

  assert.equal(result.ok, true);
  assert.equal(result.prompt, result.englishPrompt);
  assert.match(result.chineseConfirmation, /圖轉影色情程度：\d+\/10/);
  assert.match(result.chineseConfirmation, /中文對照詞意/);
  assert.match(result.englishPrompt, /image-to-video prompt/);
  assert.match(result.englishPrompt, /adult-only explicitness rating: \d+\/10/);
  assert.match(result.englishPrompt, /duration: 8 seconds/);
  assert.match(result.englishPrompt, /user requested safe motion: slow push-in/);
  assert.ok(result.promptChoices.length >= 2);
  assert.ok(result.promptChoices.every((choice) => choice.score >= 1 && choice.score <= 10));
  assert.doesNotMatch(result.englishPrompt, /圖轉影|色情程度|中文對照/);
});

test('rejects unsafe image-to-video wishes and returns revision advice', () => {
  const result = createImageToVideoPrompt({
    imageDescription: '成人角色',
    desiredMotion: 'forced kiss while unconscious',
    skinToneRatio: 0.2
  });

  assert.equal(result.ok, false);
  assert.equal(result.screened, false);
  assert.match(result.reason, /非合意/);
  assert.match(result.suggestedFix.zh, /合意成人/);
  assert.match(result.suggestedFix.en, /consenting adult/);
  assert.ok(result.explicitnessScore >= 1 && result.explicitnessScore <= 10);
});

test('keeps image-to-video copy output English-only for Chinese desired motion', () => {
  const result = createImageToVideoPrompt({
    imageDescription: '成人模特兒',
    desiredMotion: '親吻並撫摸頭髮',
    skinToneRatio: 0.2
  });

  assert.equal(result.ok, true);
  assert.doesNotMatch(result.englishPrompt, /[\u3400-\u9fff]/);
  assert.match(result.chineseConfirmation, /親吻並撫摸頭髮/);
  assert.match(result.englishPrompt, /user-requested safe motion direction/);
});


test('provides ten image-to-video selectable explicitness prompt states', () => {
  const { IMAGE_TO_VIDEO_TIER_PROMPTS } = require('../src/translator');

  assert.equal(IMAGE_TO_VIDEO_TIER_PROMPTS.length, 10);
  assert.deepEqual(IMAGE_TO_VIDEO_TIER_PROMPTS.map(({ score }) => score), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  rewritePrompt,
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
  assert.equal(CAMERA_ANGLES.length, 20);
  assert.equal(ART_STYLES.length, 50);
  assert.equal(TIME_POINTS.length, 20);
});

test('provides requested gender, race, emotion, outfit, scene, and body customization counts', () => {
  assert.equal(CUSTOMIZATION_OPTIONS.genders.length, 5);
  assert.equal(RACE_OPTIONS.length, 100);
  assert.equal(RACE_OPTIONS.filter(({ rarity }) => rarity === 'daily').length, 50);
  assert.equal(RACE_OPTIONS.filter(({ rarity }) => rarity === 'rare').length, 50);
  assert.equal(EMOTION_OPTIONS.length, 30);
  assert.equal(EXPRESSION_OPTIONS, EMOTION_OPTIONS);
  assert.equal(CUSTOMIZATION_OPTIONS.faces.length, 30);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.length, 100);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.filter(({ rarity }) => rarity === 'daily').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.filter(({ rarity }) => rarity === 'rare').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.outfitColors.length, 30);
  assert.equal(CUSTOMIZATION_OPTIONS.bodyFeatures.length, 30);
  assert.equal(CUSTOMIZATION_OPTIONS.outfitIntegrity.length, 10);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.length, 100);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.filter(({ rarity }) => rarity === 'daily').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.filter(({ rarity }) => rarity === 'rare').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.poses.length, 50);
});

test('keeps lighting, pose, and outfit preset domains from leaking conflicting scene or light terms', () => {
  assert.deepEqual(checkElementBoundaries(), {
    lightingHasSceneLeak: false,
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
    pose: CUSTOMIZATION_OPTIONS.poses[10].zh
  });

  assert.equal(result.ok, true);
  assert.match(result.chineseConfirmation, /性別：男性成人/);
  assert.match(result.chineseConfirmation, /種族：精靈族/);
  assert.match(result.chineseConfirmation, /情緒：咬唇表情/);
  assert.match(result.chineseConfirmation, /身上特徵：豐滿胸型/);
  assert.match(result.chineseConfirmation, /服裝：皮革束腰/);
  assert.match(result.chineseConfirmation, /服裝配色：酒紅/);
  assert.match(result.chineseConfirmation, /服裝完整度：外套半披/);
  assert.match(result.chineseConfirmation, /場景：金色宮殿內室/);
  assert.match(result.chineseConfirmation, /光感：正面柔光/);
  assert.match(result.englishPrompt, /gender: adult man/);
  assert.match(result.englishPrompt, /race: elf/);
  assert.match(result.englishPrompt, /emotion: soft lip-biting expression/);
  assert.match(result.englishPrompt, /body feature: full bust/);
  assert.match(result.englishPrompt, /outfit: leather corset/);
  assert.match(result.englishPrompt, /outfit color palette: wine red/);
  assert.match(result.englishPrompt, /outfit integrity: jacket half-draped/);
  assert.match(result.englishPrompt, /scene: golden palace inner chamber/);
  assert.match(result.englishPrompt, /lighting: front soft light/);
  assert.doesNotMatch(result.englishPrompt, /性別|種族|情緒|服裝|場景|光感/);
});


test('keeps copyable output English-only even when the source has unsupported Chinese terms', () => {
  const result = rewritePrompt('性感站著', { intensity: 'medium' });

  assert.equal(result.ok, true);
  assert.doesNotMatch(result.englishPrompt, /[\u3400-\u9fff]/);
  assert.match(result.chineseConfirmation, /性感站著/);
  assert.match(result.englishPrompt, /adult sensual visual direction based on the reviewed source request/);
});

test('appends safe free-form custom conditions to the English prompt and confirmation', () => {
  const result = rewritePrompt('親吻', {
    customConditions: '85mm lens, pearl accessories, no watermark, clean background'
  });

  assert.equal(result.ok, true);
  assert.match(result.chineseConfirmation, /客製化條件：85mm lens, pearl accessories, no watermark, clean background/);
  assert.match(result.englishPrompt, /custom conditions: 85mm lens, pearl accessories, no watermark, clean background/);
});

test('rejects Chinese free-form custom conditions because copy output is English-only', () => {
  const result = rewritePrompt('親吻', {
    customConditions: '珍珠配件'
  });

  assert.equal(result.ok, false);
  assert.match(result.reason, /英文/);
});

test('rejects unsafe free-form custom conditions', () => {
  const result = rewritePrompt('親吻', {
    customConditions: '學生 costume'
  });

  assert.equal(result.ok, false);
  assert.match(result.reason, /未成年人/);
});

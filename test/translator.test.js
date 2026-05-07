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


test('intensity selection changes applied prompt guidance, not only the dropdown value', () => {
  const soft = rewritePrompt('吸血鬼女王', { intensity: 'soft' });
  const strong = rewritePrompt('吸血鬼女王', { intensity: 'strong' });

  assert.equal(soft.ok, true);
  assert.equal(strong.ok, true);
  assert.match(soft.englishPrompt, /intensity application: soft intensity profile: restrained distance/);
  assert.match(strong.englishPrompt, /intensity application: strong intensity profile: more direct gaze and posture/);
  assert.match(soft.chineseConfirmation, /情慾強度運用：柔和：保留距離感/);
  assert.match(strong.chineseConfirmation, /情慾強度運用：強烈：眼神與姿態更直接/);
  assert.notEqual(soft.englishPrompt, strong.englishPrompt);
});


test('designer mode blocks erotic direction while sensual mode allows it after login choice', () => {
  const designer = rewritePrompt('淫亂的迪士尼公主', { audienceMode: 'designer' });
  const sensual = rewritePrompt('淫亂的迪士尼公主', { audienceMode: 'sensual' });

  assert.equal(designer.ok, false);
  assert.match(designer.reason, /設友模式全域阻擋/);
  assert.equal(sensual.ok, true);
  assert.match(sensual.englishPrompt, /debauched adult Disney-inspired princess archetype/);
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
  assert.equal(COMPOSITION_STRUCTURES.length, 20);
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
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.length, 400);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.filter(({ rarity }) => rarity === 'male-normal').length, 100);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.filter(({ rarity }) => rarity === 'male-sensual').length, 100);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.filter(({ rarity }) => rarity === 'female-normal').length, 100);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.filter(({ rarity }) => rarity === 'female-sensual').length, 100);
  assert.doesNotMatch(CUSTOMIZATION_OPTIONS.outfits.map(({ zh }) => zh).join(' '), /黑|白|紅|金|銀|藍|綠|紫/);
  assert.equal(CUSTOMIZATION_OPTIONS.outfitColors.length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.outfitMaterials.length, 50);
  assert.equal(OCCUPATION_OPTIONS.length, 50);
  assert.equal(BODY_PROPORTION_OPTIONS.length, 50);
  assert.equal(AGE_BRACKET_OPTIONS.at(-1).zh, '56-60 歲');
  assert.equal(CUSTOMIZATION_OPTIONS.bodyFeatures.length, 30);
  assert.equal(CUSTOMIZATION_OPTIONS.outfitIntegrity.length, 10);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.length, 200);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.filter(({ rarity }) => rarity === 'normal').length, 100);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.filter(({ rarity }) => rarity === 'taboo').length, 100);
  assert.doesNotMatch(CUSTOMIZATION_OPTIONS.scenes.map(({ zh, en }) => `${zh} ${en}`).join(' '), /光|燈|light|lighting/i);
  assert.equal(CUSTOMIZATION_OPTIONS.accessories.length, 150);
  assert.equal(CUSTOMIZATION_OPTIONS.accessories.filter(({ rarity }) => rarity === 'daily').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.accessories.filter(({ rarity }) => rarity === 'intimate').length, 50);
  assert.equal(CUSTOMIZATION_OPTIONS.accessories.filter(({ rarity }) => rarity === 'taboo').length, 50);
  assert.deepEqual(ACTION_MODE_OPTIONS.map(({ zh }) => zh), [
    '姿態',
    '肩上',
    '手部',
    '下半身'
  ]);
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

test('legacy separate action and pose banks are removed from translator exports', () => {
  const translatorSource = require('node:fs').readFileSync(require('node:path').join(__dirname, '../src/translator.js'), 'utf8');

  assert.doesNotMatch(translatorSource, /SINGLE_ACTION_OPTIONS|TWO_ACTION_OPTIONS|THREE_ACTION_OPTIONS/);
  assert.doesNotMatch(translatorSource, /SINGLE_POSE_OPTIONS|TWO_POSE_OPTIONS|THREE_POSE_OPTIONS/);
  assert.doesNotMatch(translatorSource, /getActionsForCount|getPosesForCount/);
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
    actionMode: ACTION_MODE_OPTIONS[2].zh,
    actionDetail: getActionDetailsForMode(ACTION_MODE_OPTIONS[2].zh)[25].zh,
    cosplayPrompt: 'vampire queen with pearl accessories'
  });

  assert.equal(result.ok, true);
  assert.match(result.chineseConfirmation, /性別：男性成人/);
  assert.match(result.chineseConfirmation, /種族：精靈族/);
  assert.match(result.chineseConfirmation, /情緒：咬唇表情/);
  assert.match(result.chineseConfirmation, /身上特徵：鎖骨小痣/);
  assert.match(result.chineseConfirmation, /服裝：男正常服裝051/);
  assert.match(result.chineseConfirmation, /服裝配色：酒紅/);
  assert.match(result.chineseConfirmation, /服裝完整度：外套半披/);
  assert.match(result.chineseConfirmation, /場景：日常場景051/);
  assert.match(result.chineseConfirmation, /光感：正面柔光/);
  assert.match(result.chineseConfirmation, /配件／道具：皮革腿環/);
  assert.match(result.chineseConfirmation, /Cosplay：vampire queen with pearl accessories/);
  assert.match(result.englishPrompt, /gender: adult man/);
  assert.match(result.englishPrompt, /race: elf/);
  assert.match(result.englishPrompt, /emotion: soft lip-biting expression/);
  assert.match(result.englishPrompt, /body feature: beauty mark near collarbone/);
  assert.match(result.englishPrompt, /outfit: male everyday outfit 51/);
  assert.match(result.englishPrompt, /outfit color palette: wine red/);
  assert.match(result.englishPrompt, /outfit integrity: jacket half-draped/);
  assert.match(result.englishPrompt, /scene: everyday lived-in scene 51/);
  assert.match(result.englishPrompt, /lighting: front soft light/);
  assert.match(result.englishPrompt, /accessory\/prop: leather thigh garter/);
  assert.match(result.englishPrompt, /cosplay\/character direction: vampire queen with pearl accessories/);
  assert.match(result.chineseConfirmation, /動作／姿態類型：手部/);
  assert.match(result.chineseConfirmation, /動作／姿態細項：.*情慾/);
  assert.match(result.englishPrompt, /action\/posture detail: kneading fabric over chest/);
  assert.doesNotMatch(result.englishPrompt, /性別|種族|情緒|服裝|場景|光感/);
});



test('per-character detail objects can override each adult character without duplicating global defaults', () => {
  const result = rewritePrompt('吸血鬼女王', {
    count: CUSTOMIZATION_OPTIONS.counts[1].zh,
    gender: CUSTOMIZATION_OPTIONS.genders[1].zh,
    outfit: CUSTOMIZATION_OPTIONS.outfits[50].zh,
    characterDetails: [
      { zh: '角色1: 性別 女性成人，種族 精靈族，情緒 自信微笑，服裝 蕾絲深V連身衣', en: 'gender: adult woman, race: elf, emotion: confident smile, outfit: lace deep-V bodysuit' },
      { zh: '角色2: 性別 男性成人，職業 私人保鑣，服裝 黑色西裝', en: 'gender: adult man, occupation: private bodyguard, outfit: black suit' }
    ]
  });

  assert.equal(result.ok, true);
  assert.match(result.chineseConfirmation, /全局角色設定：已由角色卡分別指定/);
  assert.match(result.chineseConfirmation, /角色1細節：角色1: 性別 女性成人/);
  assert.match(result.chineseConfirmation, /角色2細節：角色2: 性別 男性成人/);
  assert.match(result.englishPrompt, /global character defaults: omitted because per-character detail lines are specified/);
  assert.match(result.englishPrompt, /character 1 details: gender: adult woman, race: elf/);
  assert.match(result.englishPrompt, /character 2 details: gender: adult man, occupation: private bodyguard/);
  assert.doesNotMatch(result.englishPrompt, /gender: adult man, race: AI decides/);
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
  assert.match(result.englishPrompt, /subject\/action: sensual/);
});

test('translates safe Chinese Cosplay character direction into English prompt text', () => {
  const result = rewritePrompt('吸血鬼女王 珍珠配件', {
    cosplayPrompt: '吸血鬼女王 珍珠配件'
  });

  assert.equal(result.ok, true);
  assert.match(result.chineseConfirmation, /Cosplay：吸血鬼女王 珍珠配件/);
  assert.match(result.englishPrompt, /subject\/action: vampire queen pearl accessories/);
  assert.match(result.englishPrompt, /cosplay\/character direction: vampire queen pearl accessories/);
  assert.doesNotMatch(result.englishPrompt, /[㐀-鿿]|user-provided cosplay/);
});

test('preserves multi-word Chinese Cosplay modifiers instead of collapsing to one noun', () => {
  const result = rewritePrompt('淫亂的迪士尼公主', {
    cosplayPrompt: '淫亂的迪士尼公主'
  });

  assert.equal(result.ok, true);
  assert.match(result.chineseConfirmation, /Cosplay：淫亂的迪士尼公主/);
  assert.match(result.englishPrompt, /subject\/action: debauched adult Disney-inspired princess archetype/);
  assert.match(result.englishPrompt, /cosplay\/character direction: debauched adult Disney-inspired princess archetype/);
  assert.doesNotMatch(result.englishPrompt, /[㐀-鿿]/);
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


test('text-to-image controls are split into guided setup tabs', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const indexSource = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const appSource = fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf8');
  const styleSource = fs.readFileSync(path.join(__dirname, '../src/styles.css'), 'utf8');

  assert.match(indexSource, /Easy Flow/);
  assert.match(indexSource, /<h2 id="input-title">Cosplay<\/h2>/);
  assert.doesNotMatch(indexSource, /sourcePrompt|原始描述|輸入提示詞/);
  assert.match(indexSource, /中文也可以/);
  assert.match(indexSource, /data-text-step="visual"/);
  assert.match(indexSource, /data-text-step="character"/);
  assert.match(indexSource, /data-text-step="scene"/);
  assert.match(indexSource, /data-text-step="sensual"/);
  assert.match(indexSource, /登入設友/);
  assert.match(indexSource, /登入色友/);
  assert.match(indexSource, /savePromptButton/);
  assert.match(indexSource, /resultImageInput/);
  assert.match(indexSource, /data-text-step-panel="visual"/);
  assert.match(indexSource, /data-text-step-panel="character"[^>]*hidden/);
  assert.match(indexSource, /data-text-step-panel="scene"[^>]*hidden/);
  assert.match(indexSource, /每個下拉都可維持 AI 判斷/);
  assert.match(indexSource, /不確定的選項保持 AI 判斷即可/);
  assert.match(appSource, /function setTextStep/);
  assert.match(appSource, /button\.addEventListener\('click', \(\) => setTextStep\(button\.dataset\.textStep\)\)/);
  assert.match(styleSource, /\.quick-guide/);
  assert.match(styleSource, /\.text-step-tabs/);
  assert.match(styleSource, /overflow-x: auto/);
  assert.match(styleSource, /flex: 0 0 min\(46vw, 168px\)/);
});

test('all customization selectors include AI judgment in the browser', () => {
  const appSource = require('node:fs').readFileSync(require('node:path').join(__dirname, '../src/app.js'), 'utf8');

  assert.match(appSource, /aiOption\.textContent = 'AI判斷'/);
  assert.match(appSource, /populateSelect\(composition, COMPOSITION_STRUCTURES\)/);
  assert.match(appSource, /populateSelect\(outfitMaterial, CUSTOMIZATION_OPTIONS\.outfitMaterials\)/);
  assert.match(appSource, /populateSelect\(actionMode, ACTION_MODE_OPTIONS\)/);
  assert.match(appSource, /getTextRewriteSource/);
  assert.match(appSource, /cosplayPrompt\.value\.trim\(\)/);
  assert.doesNotMatch(appSource, /sourcePrompt/);
  assert.match(appSource, /selected customization controls/);
  assert.match(appSource, /buildAutoVideoChoices/);
  assert.match(appSource, /autoVideoChoice/);
  assert.match(appSource, /autoVideoConfirmation/);
  assert.match(appSource, /中文說明：/);
  assert.match(appSource, /localStorage/);
  assert.match(appSource, /compressResultImage/);
  assert.match(appSource, /activeAudienceMode/);
  assert.match(appSource, /character\$\{index\}Race/);
  assert.match(appSource, /character\$\{index\}OutfitIntegrity/);

  const indexSource = require('node:fs').readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
  assert.match(indexSource, /data-autovideo-count="5"/);
  assert.match(indexSource, /autoVideoConfirmation/);
  assert.match(indexSource, /中文圖轉影說明/);
  assert.match(indexSource, /character1Race/);
  assert.match(indexSource, /character1OutfitIntegrity/);
  assert.match(indexSource, /動作和姿態共用這一欄/);
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

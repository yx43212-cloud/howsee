const test = require('node:test');
const assert = require('node:assert/strict');
const {
  rewritePrompt,
  validatePrompt,
  LIGHTING_DESCRIPTIONS,
  CAMERA_ANGLES,
  ART_STYLES,
  RACE_OPTIONS,
  EXPRESSION_OPTIONS,
  TIME_POINTS,
  CUSTOMIZATION_OPTIONS
} = require('../src/translator');

test('rewrites direct adult wording into safer descriptive prompt language', () => {
  const result = rewritePrompt('脫衣服 親吻', { intensity: 'medium' });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /subject\/action: .*布料滑落/);
  assert.match(result.prompt, /炙熱親吻/);
  assert.match(result.prompt, /safety: all characters are clearly 18\+/);
});

test('keeps semantic intent for solo intimate prompt without using the original keyword', () => {
  const result = rewritePrompt('自慰', { intensity: 'soft' });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /私密獨處/);
  assert.match(result.prompt, /intensity: 柔和曖昧/);
});

test('rejects underage content', () => {
  const result = validatePrompt('學生 脫衣服');

  assert.equal(result.ok, false);
  assert.match(result.reason, /未成年人/);
});

test('rejects non-consensual content', () => {
  const result = rewritePrompt('強迫 親吻');

  assert.equal(result.ok, false);
  assert.match(result.reason, /非合意/);
});

test('provides exactly 20 lighting, 20 camera-angle, and 50 art-style descriptions', () => {
  assert.equal(LIGHTING_DESCRIPTIONS.length, 20);
  assert.equal(CAMERA_ANGLES.length, 20);
  assert.equal(ART_STYLES.length, 50);
  assert.equal(RACE_OPTIONS.length, 50);
  assert.equal(EXPRESSION_OPTIONS.length, 50);
  assert.equal(TIME_POINTS.length, 20);
  assert.ok(LIGHTING_DESCRIPTIONS.every((option) => /左|右|上|下|正面|背後|逆光|主光|補光|柔光|硬光|漫射|環形光|聚光|背景|全局/.test(option.zh)));
});

test('provides exactly 50 usable body pose/posture presets', () => {
  assert.equal(CUSTOMIZATION_OPTIONS.poses.length, 50);
});

test('provides 160 role customization options across required categories', () => {
  const total = Object.values(CUSTOMIZATION_OPTIONS).reduce((sum, options) => sum + options.length, 0);

  assert.equal(CUSTOMIZATION_OPTIONS.faces.length, 30);
  assert.equal(CUSTOMIZATION_OPTIONS.outfits.length, 30);
  assert.equal(CUSTOMIZATION_OPTIONS.counts.length, 20);
  assert.equal(CUSTOMIZATION_OPTIONS.scenes.length, 30);
  assert.equal(total, 160);
});

test('adds selected lighting, camera, pose, and character customization to a usable prompt', () => {
  const result = rewritePrompt('親吻', {
    lighting: LIGHTING_DESCRIPTIONS[3].zh,
    camera: CAMERA_ANGLES[4].zh,
    artStyle: ART_STYLES[2].zh,
    race: RACE_OPTIONS[1].zh,
    expression: EXPRESSION_OPTIONS[10].zh,
    timePoint: TIME_POINTS[7].zh,
    lighting: LIGHTING_DESCRIPTIONS[3],
    camera: CAMERA_ANGLES[4],
    artStyle: ART_STYLES[2],
    face: CUSTOMIZATION_OPTIONS.faces[2],
    outfit: CUSTOMIZATION_OPTIONS.outfits[5],
    count: CUSTOMIZATION_OPTIONS.counts[1],
    scene: CUSTOMIZATION_OPTIONS.scenes[7],
    pose: CUSTOMIZATION_OPTIONS.poses[10]
  });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /【中文確認提示詞】/);
  assert.match(result.prompt, /【English generation prompt】/);
  assert.match(result.prompt, /主題／動作：.*炙熱親吻/);
  assert.match(result.prompt, /光感：正面柔光/);
  assert.match(result.prompt, /鏡位：近景特寫/);
  assert.match(result.prompt, /畫風：精品時尚封面風/);
  assert.match(result.prompt, /種族：精靈族/);
  assert.match(result.prompt, /表情：咬唇表情/);
  assert.match(result.prompt, /時間點：傍晚 5 點/);
  assert.match(result.prompt, /lighting: front soft light/);
  assert.match(result.prompt, /camera angle: close-up shot/);
  assert.match(result.prompt, /art style: luxury fashion magazine cover/);
  assert.match(result.prompt, /race: elf/);
  assert.match(result.prompt, /facial expression: soft lip-biting expression/);
  assert.match(result.prompt, /time point: 5 PM golden-hour soft light/);
  assert.match(result.prompt, /subject\/action: .*炙熱親吻/);
  assert.match(result.prompt, /lighting: 月光穿過百葉窗/);
  assert.match(result.prompt, /camera angle: close-up shot/);
  assert.match(result.prompt, /art style: luxury fashion magazine cover/);
  assert.match(result.prompt, /face: 成熟鵝蛋臉/);
  assert.match(result.prompt, /outfit: 皮革束腰/);
  assert.match(result.prompt, /character count\/composition: 雙人合意互動/);
  assert.match(result.prompt, /scene: 海邊玻璃屋/);
  assert.match(result.prompt, /body pose\/posture: 雙人一坐一站/);
});


test('appends safe free-form custom conditions to the usable prompt', () => {
  const result = rewritePrompt('親吻', {
    customConditions: '85mm lens, pearl accessories, no watermark, clean background'
  });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /客製化條件：85mm lens, pearl accessories, no watermark, clean background/);
  assert.match(result.prompt, /custom conditions: 85mm lens, pearl accessories, no watermark, clean background/);
});

test('rejects unsafe free-form custom conditions', () => {
  const result = rewritePrompt('親吻', {
    customConditions: '學生 costume'
  });

  assert.equal(result.ok, false);
  assert.match(result.reason, /未成年人/);
});

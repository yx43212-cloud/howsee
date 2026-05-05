const test = require('node:test');
const assert = require('node:assert/strict');
const { rewritePrompt, validatePrompt } = require('../src/translator');

test('rewrites direct adult wording into safer descriptive prompt language', () => {
  const result = rewritePrompt('脫衣服 親吻', { intensity: 'medium' });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /布料滑落/);
  assert.match(result.prompt, /炙熱親吻/);
  assert.match(result.prompt, /consenting adults/);
});

test('keeps semantic intent for solo intimate prompt without using the original keyword', () => {
  const result = rewritePrompt('自慰', { intensity: 'soft' });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /私密獨處/);
  assert.match(result.prompt, /柔和曖昧/);
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


test('provides exactly 20 lighting and 20 awe descriptions', () => {
  const { LIGHTING_DESCRIPTIONS, AWE_DESCRIPTIONS } = require('../src/translator');

  assert.equal(LIGHTING_DESCRIPTIONS.length, 20);
  assert.equal(AWE_DESCRIPTIONS.length, 20);
});

test('provides more than 100 role customization options across required categories', () => {
  const { CUSTOMIZATION_OPTIONS } = require('../src/translator');
  const total = Object.values(CUSTOMIZATION_OPTIONS).reduce((sum, options) => sum + options.length, 0);

  assert.ok(CUSTOMIZATION_OPTIONS.faces.length >= 20);
  assert.ok(CUSTOMIZATION_OPTIONS.outfits.length >= 20);
  assert.ok(CUSTOMIZATION_OPTIONS.counts.length >= 20);
  assert.ok(CUSTOMIZATION_OPTIONS.scenes.length >= 20);
  assert.ok(total > 100);
});

test('adds selected lighting, awe, and character customization to rewritten prompt', () => {
  const { LIGHTING_DESCRIPTIONS, AWE_DESCRIPTIONS, CUSTOMIZATION_OPTIONS } = require('../src/translator');
  const result = rewritePrompt('親吻', {
    lighting: LIGHTING_DESCRIPTIONS[3],
    awe: AWE_DESCRIPTIONS[4],
    face: CUSTOMIZATION_OPTIONS.faces[2],
    outfit: CUSTOMIZATION_OPTIONS.outfits[5],
    count: CUSTOMIZATION_OPTIONS.counts[1],
    scene: CUSTOMIZATION_OPTIONS.scenes[7]
  });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /月光穿過百葉窗/);
  assert.match(result.prompt, /低角度仰視/);
  assert.match(result.prompt, /成熟鵝蛋臉/);
  assert.match(result.prompt, /皮革束腰/);
  assert.match(result.prompt, /雙人合意互動/);
  assert.match(result.prompt, /海邊玻璃屋/);
});

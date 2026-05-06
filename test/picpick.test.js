const test = require('node:test');
const assert = require('node:assert/strict');
const { picpickData, assemblePrompt, normalizeState } = require('../src/picpick-core');

test('provides PicPick expandable option structures and requested counts', () => {
  assert.equal(picpickData.photo_types.length, 7);
  assert.equal(picpickData.age_modes.length, 18);
  assert.equal(picpickData.style_categories.length, 10);
  assert.equal(picpickData.styles.length, 200);
  assert.equal(picpickData.basic_style_groups.length, 10);
  assert.equal(picpickData.basic_plans.length, 500);
  assert.equal(picpickData.locations.length, 100);
  assert.equal(picpickData.outfits.length, 100);
  assert.equal(picpickData.accessories.length, 100);
  assert.equal(picpickData.color_palettes.length, 100);
  assert.ok(picpickData.color_palettes.every((palette) => palette.category));
  assert.equal(picpickData.moods.length, 100);
  assert.equal(picpickData.frames.length, 100);
  assert.equal(picpickData.layouts.length, 50);
  assert.equal(picpickData.outputs.length, 100);
});

test('assembles full, short, negative prompts and deterministic style code without raw slider fractions', () => {
  const state = normalizeState({
    photoTypeId: picpickData.photo_types[1].id,
    ageModeId: picpickData.age_modes[7].id,
    styleId: picpickData.styles[25].id,
    lightId: picpickData.lights[8].id,
    locationId: picpickData.locations[12].id,
    outfitId: picpickData.outfits[8].id,
    accessoryId: picpickData.accessories[8].id,
    paletteId: picpickData.color_palettes[2].id,
    moodId: picpickData.moods[3].id,
    frameId: picpickData.frames[4].id,
    layoutId: picpickData.layouts[10].id,
    outputId: picpickData.outputs[0].id,
    includeText: true,
    text: { title: '新品上市', subtitle: 'PicPick 風格測試' },
    tuning: { identity: 91, retouch: 38 }
  });
  const result = assemblePrompt(state);

  assert.match(result.fullPrompt, /照片類型 \/ 人物模式為「雙人」/);
  assert.match(result.fullPrompt, /加入文字：主標題「新品上市」、副標題「PicPick 風格測試」/);
  assert.match(result.fullPrompt, /嚴格保留原照片人物 \/ 主體的五官/);
  assert.doesNotMatch(result.fullPrompt, /\d+\/100/);
  assert.doesNotMatch(result.shortPrompt, /\d+\/100/);
  assert.match(result.shortPrompt, /雙人照片編輯/);
  assert.match(result.negativePrompt, /五官變形/);
  assert.match(result.styleCode, /^PP-STYLE-\d{3}$/);
  assert.equal(result.styleCode, assemblePrompt(state).styleCode);
});

test('uses product-aware preservation language and skips age edits for product photos', () => {
  const result = assemblePrompt(normalizeState({
    photoTypeId: picpickData.photo_types.find(({ label }) => label === '商品').id,
    outputId: picpickData.outputs.find(({ label }) => label === '商品廣告').id,
    tuning: { identity: 100, retouch: 12, background: 24, realism: 100 }
  }));

  assert.match(result.fullPrompt, /此照片類型不套用人物年紀調整/);
  assert.match(result.fullPrompt, /嚴格保留原商品的外型、比例、Logo、材質紋理/);
  assert.doesNotMatch(result.fullPrompt, /人物保留度 \d+\/100|修飾強度 \d+\/100|寫實 \/ 插畫程度 \d+\/100/);
  assert.doesNotMatch(result.shortPrompt, /\d+\/100/);
});


test('basic mode uses integrated planning instead of requiring granular customization or uploads', () => {
  const magazinePlan = picpickData.basic_plans.find(({ category }) => category === '雜誌插頁');
  const result = assemblePrompt(normalizeState({
    mode: 'basic',
    basicPlanId: magazinePlan.id,
    photoTypeId: picpickData.photo_types.find(({ label }) => label === '商品').id,
    outputId: picpickData.outputs.find(({ label }) => label === '商品廣告').id,
    text: { note: '咖啡新品 IG 商品廣告' }
  }));

  assert.match(result.fullPrompt, /基礎版統整規劃：「雜誌插頁/);
  assert.match(result.fullPrompt, /不要要求使用者逐項指定元素/);
  assert.match(result.fullPrompt, /使用者簡短需求：咖啡新品 IG 商品廣告/);
  assert.match(result.shortPrompt, /商品照片編輯，雜誌插頁/);
});

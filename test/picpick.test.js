const test = require('node:test');
const assert = require('node:assert/strict');
const { picpickData, assemblePrompt, normalizeState } = require('../src/picpick-core');

test('provides PicPick expandable option structures and requested counts', () => {
  assert.equal(picpickData.photo_types.length, 7);
  assert.equal(picpickData.age_modes.length, 18);
  assert.equal(picpickData.style_categories.length, 10);
  assert.equal(picpickData.styles.length, 200);
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

test('assembles full, short, negative prompts and deterministic style code', () => {
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
  assert.match(result.shortPrompt, /雙人照片編輯/);
  assert.match(result.negativePrompt, /五官變形/);
  assert.match(result.styleCode, /^PP-STYLE-\d{3}$/);
  assert.equal(result.styleCode, assemblePrompt(state).styleCode);
});

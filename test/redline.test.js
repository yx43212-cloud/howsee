const test = require('node:test');
const assert = require('node:assert/strict');

const {
  SHARE_POINTS,
  SINGLE_DRAW_COST,
  DOUBLE_DRAW_COST,
  createCommunityEntry,
  filterEntries,
  drawRedlineCards,
  getDrawCountForPoints,
  getDrawCost,
  awardDailyLogin,
  localizePromptText,
  getEntryLocalizedText
} = require('../src/redline.js');

test('redline point costs match the gacha rules', () => {
  assert.equal(SHARE_POINTS, 1);
  assert.equal(SINGLE_DRAW_COST, 3);
  assert.equal(DOUBLE_DRAW_COST, 5);
  assert.equal(getDrawCountForPoints(2), 0);
  assert.equal(getDrawCountForPoints(3), 1);
  assert.equal(getDrawCountForPoints(5), 2);
  assert.equal(getDrawCost(1), 3);
  assert.equal(getDrawCost(2), 5);
});

test('daily login awards only one point per date', () => {
  const first = awardDailyLogin({ points: 0 }, new Date('2026-05-08T12:00:00.000Z'));
  assert.equal(first.points, 1);
  assert.equal(first.awarded, true);

  const second = awardDailyLogin(first, new Date('2026-05-08T18:00:00.000Z'));
  assert.equal(second.points, 1);
  assert.equal(second.awarded, false);

  const nextDay = awardDailyLogin(second, new Date('2026-05-09T00:00:00.000Z'));
  assert.equal(nextDay.points, 2);
  assert.equal(nextDay.awarded, true);
});

test('redline entries are anonymous, filterable, and language paired with English', () => {
  const ownEntry = createCommunityEntry({
    gender: 'female',
    age: '25-29',
    nature: 'designer',
    sourceText: '中文確認：女性成人，場景：月光玻璃屋，服裝：銀白長裙。',
    englishPrompt: 'female adult, moonlit glass house, silver-white gown',
    language: 'zh'
  });
  const otherEntry = createCommunityEntry({
    gender: 'male',
    age: '25-29',
    nature: 'designer',
    sourceText: '中文確認：男性成人，場景：雨夜書店。',
    englishPrompt: 'male adult, rainy bookstore',
    language: 'zh'
  });

  assert.equal(ownEntry.anonymous, true);
  assert.equal(filterEntries([ownEntry, otherEntry], { gender: 'female', age: '25-29', nature: 'designer' }).length, 1);
  assert.match(getEntryLocalizedText(ownEntry, 'en'), /Localized comparison/);
  assert.equal(ownEntry.englishPrompt, 'female adult, moonlit glass house, silver-white gown');
});

test('drawRedlineCards returns matching anonymous prompt cards without duplicates', () => {
  const entries = ['a', 'b', 'c'].map((id) => createCommunityEntry({
    id,
    gender: 'female',
    age: '30-34',
    nature: 'sensual',
    sourceText: `中文確認：匿名 ${id}`,
    englishPrompt: `adult prompt ${id}`,
    language: 'zh'
  }));
  const drawn = drawRedlineCards(entries, { gender: 'female', age: '30-34', nature: 'sensual' }, 2, () => 0);
  assert.equal(drawn.length, 2);
  assert.notEqual(drawn[0].id, drawn[1].id);
});

test('localized comparison switches away from Chinese while preserving English separately', () => {
  const localized = localizePromptText('中文確認：角色女性成人，場景玫瑰溫室。', 'ja');
  assert.match(localized, /ローカル対照/);
  assert.match(localized, /シーン/);
});

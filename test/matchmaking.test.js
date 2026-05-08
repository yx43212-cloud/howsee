const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createCommunityEntry,
  filterEntries,
  drawHeartCards,
  revealHeartCard,
  localizePromptText,
  getEntryLocalizedText
} = require('../src/matchmaking.js');

test('heart card entries are anonymous and can retain a text-to-image thumbnail', () => {
  const entry = createCommunityEntry({
    gender: 'female',
    age: '25-29',
    nature: 'designer',
    sourceText: '中文確認：女性成人，場景：月光玻璃屋，服裝：銀白長裙。',
    englishPrompt: 'female adult, moonlit glass house, silver-white gown',
    thumbnailDataUrl: 'data:image/jpeg;base64,abc123',
    language: 'zh'
  });

  assert.equal(entry.anonymous, true);
  assert.equal(entry.thumbnailDataUrl, 'data:image/jpeg;base64,abc123');
  assert.equal(entry.englishPrompt, 'female adult, moonlit glass house, silver-white gown');
});

test('matchmaking filters require nature, gender, and adult age range', () => {
  const ownEntry = createCommunityEntry({
    gender: 'female',
    age: '25-29',
    nature: 'designer',
    sourceText: '中文確認：女性成人，場景：月光玻璃屋。',
    englishPrompt: 'female adult, moonlit glass house',
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

  const matched = filterEntries([ownEntry, otherEntry], { nature: 'designer', gender: 'female', age: '25-29' });
  assert.equal(matched.length, 1);
  assert.equal(matched[0].gender, 'female');
});

test('drawHeartCards surfaces three matching facedown candidates without duplicates', () => {
  const entries = ['a', 'b', 'c', 'd'].map((id) => createCommunityEntry({
    id,
    gender: 'female',
    age: '30-34',
    nature: 'sensual',
    sourceText: `中文確認：匿名 ${id}`,
    englishPrompt: `complete adult setting prompt ${id}`,
    language: 'zh'
  }));
  const drawn = drawHeartCards(entries, { nature: 'sensual', gender: 'female', age: '30-34' }, 3, () => 0);
  assert.equal(drawn.length, 3);
  assert.equal(new Set(drawn.map((entry) => entry.id)).size, 3);
});

test('choosing one heart card reveals the paired localized text and complete English prompt', () => {
  const cards = ['a', 'b', 'c'].map((id) => createCommunityEntry({
    id,
    gender: 'female',
    age: '30-34',
    nature: 'designer',
    sourceText: `中文確認：角色女性成人，場景玫瑰溫室 ${id}。`,
    englishPrompt: `complete text-to-image setting prompt ${id}`,
    language: 'zh'
  }));
  const revealed = revealHeartCard(cards, 'b');
  assert.equal(revealed.id, 'b');
  assert.match(getEntryLocalizedText(revealed, 'en'), /Localized comparison/);
  assert.equal(revealed.englishPrompt, 'complete text-to-image setting prompt b');
});

test('localized comparison switches away from Chinese while preserving English separately', () => {
  const localized = localizePromptText('中文確認：角色女性成人，場景玫瑰溫室。', 'ja');
  assert.match(localized, /ローカル対照/);
  assert.match(localized, /シーン/);
});

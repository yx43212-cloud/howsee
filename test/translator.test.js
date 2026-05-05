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

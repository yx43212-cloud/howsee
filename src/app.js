const sourcePrompt = document.querySelector('#sourcePrompt');
const intensity = document.querySelector('#intensity');
const rewriteButton = document.querySelector('#rewriteButton');
const resultPrompt = document.querySelector('#resultPrompt');
const statusMessage = document.querySelector('#status');
const copyButton = document.querySelector('#copyButton');

function setStatus(message, state = 'idle') {
  statusMessage.textContent = message;
  statusMessage.dataset.state = state;
}

rewriteButton.addEventListener('click', () => {
  const result = rewritePrompt(sourcePrompt.value, { intensity: intensity.value });

  if (!result.ok) {
    resultPrompt.value = '';
    setStatus(result.reason, 'error');
    return;
  }

  resultPrompt.value = result.prompt;
  setStatus('已完成轉譯，可直接複製到支援成人內容且符合法規的平台。', 'success');
});

copyButton.addEventListener('click', async () => {
  if (!resultPrompt.value) {
    setStatus('沒有可複製的轉譯結果。', 'error');
    return;
  }

  await navigator.clipboard.writeText(resultPrompt.value);
  setStatus('已複製到剪貼簿。', 'success');
});

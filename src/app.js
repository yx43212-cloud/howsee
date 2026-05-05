const sourcePrompt = document.querySelector('#sourcePrompt');
const intensity = document.querySelector('#intensity');
const lighting = document.querySelector('#lighting');
const camera = document.querySelector('#camera');
const artStyle = document.querySelector('#artStyle');
const face = document.querySelector('#face');
const outfit = document.querySelector('#outfit');
const count = document.querySelector('#count');
const scene = document.querySelector('#scene');
const pose = document.querySelector('#pose');
const customConditions = document.querySelector('#customConditions');
const rewriteButton = document.querySelector('#rewriteButton');
const resultPrompt = document.querySelector('#resultPrompt');
const statusMessage = document.querySelector('#status');
const copyButton = document.querySelector('#copyButton');

function setStatus(message, state = 'idle') {
  statusMessage.textContent = message;
  statusMessage.dataset.state = state;
}

function populateSelect(select, options) {
  const fragment = document.createDocumentFragment();

  for (const optionText of options) {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    fragment.append(option);
  }

  select.append(fragment);
}

function setupCustomizationControls() {
  populateSelect(lighting, LIGHTING_DESCRIPTIONS);
  populateSelect(camera, CAMERA_ANGLES);
  populateSelect(artStyle, ART_STYLES);
  populateSelect(face, CUSTOMIZATION_OPTIONS.faces);
  populateSelect(outfit, CUSTOMIZATION_OPTIONS.outfits);
  populateSelect(count, CUSTOMIZATION_OPTIONS.counts);
  populateSelect(scene, CUSTOMIZATION_OPTIONS.scenes);
  populateSelect(pose, CUSTOMIZATION_OPTIONS.poses);
}

setupCustomizationControls();

rewriteButton.addEventListener('click', () => {
  const result = rewritePrompt(sourcePrompt.value, {
    intensity: intensity.value,
    lighting: lighting.value,
    camera: camera.value,
    artStyle: artStyle.value,
    face: face.value,
    outfit: outfit.value,
    count: count.value,
    scene: scene.value,
    pose: pose.value,
    customConditions: customConditions.value
  });

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

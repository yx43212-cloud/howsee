const sourcePrompt = document.querySelector('#sourcePrompt');
const intensity = document.querySelector('#intensity');
const lighting = document.querySelector('#lighting');
const camera = document.querySelector('#camera');
const artStyle = document.querySelector('#artStyle');
const gender = document.querySelector('#gender');
const race = document.querySelector('#race');
const emotion = document.querySelector('#emotion');
const timePoint = document.querySelector('#timePoint');
const face = document.querySelector('#face');
const outfit = document.querySelector('#outfit');
const outfitColor = document.querySelector('#outfitColor');
const bodyFeature = document.querySelector('#bodyFeature');
const outfitIntegrity = document.querySelector('#outfitIntegrity');
const count = document.querySelector('#count');
const scene = document.querySelector('#scene');
const pose = document.querySelector('#pose');
const customConditions = document.querySelector('#customConditions');
const rewriteButton = document.querySelector('#rewriteButton');
const confirmationPrompt = document.querySelector('#confirmationPrompt');
const resultPrompt = document.querySelector('#resultPrompt');
const statusMessage = document.querySelector('#status');
const copyButton = document.querySelector('#copyButton');
const outputLabels = document.querySelectorAll('.output-label');

function setStatus(message, state = 'idle') {
  statusMessage.textContent = message;
  statusMessage.dataset.state = state;
}

function setResultVisibility(isVisible) {
  confirmationPrompt.hidden = !isVisible;
  resultPrompt.hidden = !isVisible;
  copyButton.hidden = !isVisible;

  for (const label of outputLabels) {
    label.hidden = !isVisible;
  }
}

function getOptionLabel(optionText) {
  const baseLabel = typeof optionText === 'string' ? optionText : optionText.zh;

  if (typeof optionText !== 'object' || !optionText.rarity) {
    return baseLabel;
  }

  const rarityLabel = optionText.rarity === 'rare' ? '稀少' : '日常';
  return `${baseLabel}（${rarityLabel}）`;
}

function populateSelect(select, options) {
  const fragment = document.createDocumentFragment();

  for (const optionText of options) {
    const option = document.createElement('option');
    const value = typeof optionText === 'string' ? optionText : optionText.zh;
    option.value = value;
    option.textContent = getOptionLabel(optionText);
    fragment.append(option);
  }

  select.append(fragment);
}

function setupCustomizationControls() {
  populateSelect(lighting, LIGHTING_DESCRIPTIONS);
  populateSelect(camera, CAMERA_ANGLES);
  populateSelect(artStyle, ART_STYLES);
  populateSelect(gender, CUSTOMIZATION_OPTIONS.genders);
  populateSelect(race, RACE_OPTIONS);
  populateSelect(emotion, EMOTION_OPTIONS);
  populateSelect(timePoint, TIME_POINTS);
  populateSelect(face, CUSTOMIZATION_OPTIONS.faces);
  populateSelect(outfit, CUSTOMIZATION_OPTIONS.outfits);
  populateSelect(outfitColor, CUSTOMIZATION_OPTIONS.outfitColors);
  populateSelect(bodyFeature, CUSTOMIZATION_OPTIONS.bodyFeatures);
  populateSelect(outfitIntegrity, CUSTOMIZATION_OPTIONS.outfitIntegrity);
  populateSelect(count, CUSTOMIZATION_OPTIONS.counts);
  populateSelect(scene, CUSTOMIZATION_OPTIONS.scenes);
  populateSelect(pose, CUSTOMIZATION_OPTIONS.poses);
}

setupCustomizationControls();
setResultVisibility(false);

rewriteButton.addEventListener('click', () => {
  const result = rewritePrompt(sourcePrompt.value, {
    intensity: intensity.value,
    lighting: lighting.value,
    camera: camera.value,
    artStyle: artStyle.value,
    gender: gender.value,
    race: race.value,
    emotion: emotion.value,
    timePoint: timePoint.value,
    face: face.value,
    outfit: outfit.value,
    outfitColor: outfitColor.value,
    bodyFeature: bodyFeature.value,
    outfitIntegrity: outfitIntegrity.value,
    count: count.value,
    scene: scene.value,
    pose: pose.value,
    customConditions: customConditions.value
  });

  if (!result.ok || !result.screened) {
    confirmationPrompt.value = '';
    resultPrompt.value = '';
    setResultVisibility(false);
    setStatus(result.reason || '提示詞未通過安全篩選。', 'error');
    return;
  }

  confirmationPrompt.value = result.chineseConfirmation;
  resultPrompt.value = result.englishPrompt;
  setResultVisibility(true);
  setStatus('已通過安全篩選：中文僅供確認，下方可複製區只包含英文提示詞。', 'success');
});

copyButton.addEventListener('click', async () => {
  if (!resultPrompt.value) {
    setStatus('沒有可複製的英文提示詞。', 'error');
    return;
  }

  await navigator.clipboard.writeText(resultPrompt.value);
  setStatus('已複製英文提示詞到剪貼簿。', 'success');
});

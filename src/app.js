const sourcePrompt = document.querySelector('#sourcePrompt');
const intensity = document.querySelector('#intensity');
const lighting = document.querySelector('#lighting');
const camera = document.querySelector('#camera');
const composition = document.querySelector('#composition');
const artStyle = document.querySelector('#artStyle');
const gender = document.querySelector('#gender');
const race = document.querySelector('#race');
const emotion = document.querySelector('#emotion');
const timePoint = document.querySelector('#timePoint');
const ageBracket = document.querySelector('#ageBracket');
const occupation = document.querySelector('#occupation');
const bodyProportion = document.querySelector('#bodyProportion');
const face = document.querySelector('#face');
const outfit = document.querySelector('#outfit');
const outfitColor = document.querySelector('#outfitColor');
const outfitMaterial = document.querySelector('#outfitMaterial');
const bodyFeature = document.querySelector('#bodyFeature');
const outfitIntegrity = document.querySelector('#outfitIntegrity');
const count = document.querySelector('#count');
const cosplayPrompt = document.querySelector('#cosplayPrompt');
const scene = document.querySelector('#scene');
const accessory = document.querySelector('#accessory');
const actionMode = document.querySelector('#actionMode');
const actionDetail = document.querySelector('#actionDetail');
const autoVideoPanel = document.querySelector('#autoVideoPanel');
const autoVideoChoice = document.querySelector('#autoVideoChoice');
const autoVideoPrompt = document.querySelector('#autoVideoPrompt');
const copyAutoVideoButton = document.querySelector('#copyAutoVideoButton');
const rewriteButton = document.querySelector('#rewriteButton');
const textModeButton = document.querySelector('#textModeButton');
const videoModeButton = document.querySelector('#videoModeButton');
const textPromptPanel = document.querySelector('#textPromptPanel');
const imageVideoPanel = document.querySelector('#imageVideoPanel');
const textOutputArea = document.querySelector('#textOutputArea');
const videoOutputArea = document.querySelector('#videoOutputArea');
const textConfirmationPrompt = document.querySelector('#textConfirmationPrompt');
const textResultPrompt = document.querySelector('#textResultPrompt');
const textStatus = document.querySelector('#textStatus');
const copyTextButton = document.querySelector('#copyTextButton');
const videoConfirmationPrompt = document.querySelector('#videoConfirmationPrompt');
const videoResultPrompt = document.querySelector('#videoResultPrompt');
const videoStatus = document.querySelector('#videoStatus');
const copyVideoButton = document.querySelector('#copyVideoButton');
const imageInput = document.querySelector('#imageInput');
const imageDescription = document.querySelector('#imageDescription');
const desiredMotion = document.querySelector('#desiredMotion');
const videoDuration = document.querySelector('#videoDuration');
const motionStrength = document.querySelector('#motionStrength');
const imageVideoButton = document.querySelector('#imageVideoButton');
const imageVideoChoiceField = document.querySelector('#imageVideoChoiceField');
const imageVideoPromptChoice = document.querySelector('#imageVideoPromptChoice');
const imageVideoStatus = document.querySelector('#imageVideoStatus');
const characterCards = Array.from(document.querySelectorAll('[data-character-card]'));
const textStepButtons = Array.from(document.querySelectorAll('[data-text-step]'));
const textStepPanels = Array.from(document.querySelectorAll('[data-text-step-panel]'));

let uploadedImageAnalysis = null;
let lastImageVideoResult = null;

function setStatus(element, message, state = 'idle') {
  element.textContent = message;
  element.dataset.state = state;
}

function setTextStep(stepName) {
  for (const button of textStepButtons) {
    const isActive = button.dataset.textStep === stepName;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  }

  for (const panel of textStepPanels) {
    panel.hidden = panel.dataset.textStepPanel !== stepName;
  }
}

function setMode(mode) {
  const isTextMode = mode === 'text';
  textModeButton.classList.toggle('active', isTextMode);
  videoModeButton.classList.toggle('active', !isTextMode);
  textPromptPanel.hidden = !isTextMode;
  imageVideoPanel.hidden = isTextMode;
  textOutputArea.hidden = !isTextMode;
  videoOutputArea.hidden = isTextMode;
}

function setOutputVisibility(kind, isVisible) {
  const prefix = kind === 'video' ? 'video' : 'text';
  const confirmation = prefix === 'video' ? videoConfirmationPrompt : textConfirmationPrompt;
  const result = prefix === 'video' ? videoResultPrompt : textResultPrompt;
  const copyButton = prefix === 'video' ? copyVideoButton : copyTextButton;
  const labels = document.querySelectorAll(`.${prefix}-output-label`);

  confirmation.hidden = !isVisible;
  result.hidden = !isVisible;
  copyButton.hidden = !isVisible;

  for (const label of labels) {
    label.hidden = !isVisible;
  }
}

function getOptionLabel(optionText) {
  return typeof optionText === 'string' ? optionText : optionText.zh;
}

function populateSelect(select, options, { includeAi = true } = {}) {
  const fragment = document.createDocumentFragment();

  if (includeAi) {
    const aiOption = document.createElement('option');
    aiOption.value = 'AI判斷';
    aiOption.textContent = 'AI判斷';
    fragment.append(aiOption);
  }

  for (const optionText of options) {
    const option = document.createElement('option');
    const value = typeof optionText === 'string' ? optionText : optionText.zh;
    option.value = value;
    option.textContent = getOptionLabel(optionText);
    fragment.append(option);
  }

  select.replaceChildren(fragment);
}

function getCountGroup() {
  if (/三人/.test(count.value)) {
    return 'three';
  }

  if (/雙人|兩人/.test(count.value)) {
    return 'two';
  }

  return 'single';
}

function getVisibleCharacterCount() {
  if (getCountGroup() === 'three') {
    return 3;
  }

  if (getCountGroup() === 'two') {
    return 2;
  }

  return 1;
}

function updateCharacterCards() {
  const visibleCount = getVisibleCharacterCount();
  characterCards.forEach((card, index) => {
    card.hidden = index >= visibleCount;
  });
}

function updateActionDetailOptions() {
  const previousDetail = actionDetail.value;
  const detailOptions = getActionDetailsForMode(actionMode.value);
  populateSelect(actionDetail, detailOptions);

  if (detailOptions.some((option) => option.zh === previousDetail)) {
    actionDetail.value = previousDetail;
  }
}

function setupCharacterControls() {
  for (let index = 1; index <= 3; index += 1) {
    populateSelect(document.querySelector(`#character${index}Gender`), CUSTOMIZATION_OPTIONS.genders);
    populateSelect(document.querySelector(`#character${index}Occupation`), OCCUPATION_OPTIONS);
    populateSelect(document.querySelector(`#character${index}Age`), AGE_BRACKET_OPTIONS);
    populateSelect(document.querySelector(`#character${index}Body`), BODY_PROPORTION_OPTIONS);
  }
}

function collectCharacterDetails() {
  const visibleCount = getVisibleCharacterCount();
  const details = [];

  for (let index = 1; index <= visibleCount; index += 1) {
    const selectedGender = document.querySelector(`#character${index}Gender`).value;
    const selectedOccupation = document.querySelector(`#character${index}Occupation`).value;
    const selectedAge = document.querySelector(`#character${index}Age`).value;
    const selectedBody = document.querySelector(`#character${index}Body`).value;
    details.push(`角色${index}: 性別 ${selectedGender}, 職業 ${selectedOccupation}, 年齡 ${selectedAge}, 身材比例 ${selectedBody}`);
  }

  return details;
}

function getTextRewriteSource() {
  return sourcePrompt.value.trim() || 'consenting adult visual portrait based on the selected customization controls';
}


function setupCustomizationControls() {
  populateSelect(lighting, LIGHTING_DESCRIPTIONS);
  populateSelect(camera, CAMERA_ANGLES);
  populateSelect(composition, COMPOSITION_STRUCTURES);
  populateSelect(artStyle, ART_STYLES);
  populateSelect(gender, CUSTOMIZATION_OPTIONS.genders);
  populateSelect(race, RACE_OPTIONS);
  populateSelect(emotion, EMOTION_OPTIONS);
  populateSelect(timePoint, TIME_POINTS);
  populateSelect(ageBracket, AGE_BRACKET_OPTIONS);
  populateSelect(occupation, OCCUPATION_OPTIONS);
  populateSelect(bodyProportion, BODY_PROPORTION_OPTIONS);
  populateSelect(face, CUSTOMIZATION_OPTIONS.faces);
  populateSelect(outfit, CUSTOMIZATION_OPTIONS.outfits);
  populateSelect(outfitColor, CUSTOMIZATION_OPTIONS.outfitColors);
  populateSelect(outfitMaterial, CUSTOMIZATION_OPTIONS.outfitMaterials);
  populateSelect(bodyFeature, CUSTOMIZATION_OPTIONS.bodyFeatures);
  populateSelect(outfitIntegrity, CUSTOMIZATION_OPTIONS.outfitIntegrity);
  populateSelect(count, CUSTOMIZATION_OPTIONS.counts);
  populateSelect(accessory, CUSTOMIZATION_OPTIONS.accessories);
  populateSelect(scene, CUSTOMIZATION_OPTIONS.scenes);
  populateSelect(actionMode, ACTION_MODE_OPTIONS);
  setupCharacterControls();
  updateActionDetailOptions();
  updateCharacterCards();
}

function getSkinToneRatioFromImage(imageElement) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const sampleSize = 96;
  const scale = Math.min(sampleSize / imageElement.naturalWidth, sampleSize / imageElement.naturalHeight, 1);
  canvas.width = Math.max(1, Math.round(imageElement.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(imageElement.naturalHeight * scale));
  context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  let skinLikePixels = 0;
  let visiblePixels = 0;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const alpha = data[index + 3];

    if (alpha < 16) {
      continue;
    }

    visiblePixels += 1;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const isSkinLike = red > 95 && green > 40 && blue > 20 && max - min > 15 && Math.abs(red - green) > 15 && red > green && red > blue;
    const isWarmLightSkinLike = red > 170 && green > 120 && blue > 80 && red >= green && green >= blue;

    if (isSkinLike || isWarmLightSkinLike) {
      skinLikePixels += 1;
    }
  }

  return visiblePixels ? skinLikePixels / visiblePixels : 0;
}

function loadImageAnalysis(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.addEventListener('load', () => {
      try {
        const skinToneRatio = getSkinToneRatioFromImage(image);
        URL.revokeObjectURL(objectUrl);
        resolve({
          fileName: file.name,
          skinToneRatio,
          width: image.naturalWidth,
          height: image.naturalHeight
        });
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    }, { once: true });

    image.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('無法讀取圖片，請改用 JPG、PNG 或 WebP。'));
    }, { once: true });

    image.src = objectUrl;
  });
}


function buildAutoVideoChoices(textPrompt) {
  const base = textPrompt.replace(/\s+/g, ' ').trim();
  const variants = [
    ['AI 1｜柔和呼吸運鏡', 'subtle breathing, gentle hair and fabric motion, slow cinematic push-in, preserve the source composition'],
    ['AI 2｜眼神與唇部微動', 'slow eye movement, soft lip micro-expression, slight head turn, elegant camera easing, no explicit act animation'],
    ['AI 3｜手部與服裝細節', 'hands adjust styling, fabric shifts naturally, accessory sparkle, controlled adult sensual tension'],
    ['AI 4｜姿態重心變化', 'slow posture weight shift, graceful body-line motion, light parallax, keep tasteful artistic coverage'],
    ['AI 5｜電影感環繞鏡頭', 'short cinematic orbit, layered depth, atmospheric light drift, smooth loop-ready motion']
  ];

  return variants.map(([label, motion], index) => ({
    label,
    prompt: `image-to-video prompt option ${index + 1}, adult-only consenting subject, use this text-to-image prompt as the source frame: ${base}, motion plan: ${motion}, duration: 5 seconds, motion strength: medium, preserve identity-agnostic appearance, outfit, scene, camera angle, and art style, no minors, no coercion, no voyeur framing, no graphic violence, no new explicit nudity beyond the source frame`
  }));
}

function renderAutoVideoChoices(textPrompt) {
  const choices = buildAutoVideoChoices(textPrompt);
  autoVideoChoice.replaceChildren();

  for (const choice of choices) {
    const option = document.createElement('option');
    option.value = choice.prompt;
    option.textContent = choice.label;
    autoVideoChoice.append(option);
  }

  autoVideoChoice.value = choices[0].prompt;
  autoVideoPrompt.value = choices[0].prompt;
  autoVideoPanel.hidden = false;
}

function renderTextResult(result, successMessage) {
  if (!result.ok || !result.screened) {
    textConfirmationPrompt.value = '';
    textResultPrompt.value = '';
    setOutputVisibility('text', false);
    autoVideoPanel.hidden = true;
    autoVideoPrompt.value = '';
    setStatus(textStatus, result.reason || '提示詞未通過安全篩選。', 'error');
    return;
  }

  textConfirmationPrompt.value = result.chineseConfirmation;
  textResultPrompt.value = result.englishPrompt;
  setOutputVisibility('text', true);
  renderAutoVideoChoices(result.englishPrompt);
  setStatus(textStatus, `${successMessage} 已同步產生 5 種 AI 判定圖轉影提示詞。`, 'success');
}

function renderVideoResult(result, successMessage) {
  if (!result.ok || !result.screened) {
    videoConfirmationPrompt.value = result.suggestedFix
      ? `修正建議：${result.suggestedFix.zh}\nSuggested fix: ${result.suggestedFix.en}`
      : '';
    videoResultPrompt.value = '';
    setOutputVisibility('video', Boolean(result.suggestedFix));
    videoResultPrompt.hidden = true;
    copyVideoButton.hidden = true;
    const englishLabel = document.querySelector(".video-output-label[for='videoResultPrompt']");
    if (englishLabel) {
      englishLabel.hidden = true;
    }
    setStatus(videoStatus, result.reason || '圖轉影提示詞未通過安全篩選。', 'error');
    return;
  }

  videoConfirmationPrompt.value = result.chineseConfirmation;
  videoResultPrompt.value = result.englishPrompt;
  setOutputVisibility('video', true);
  setStatus(videoStatus, successMessage, 'success');
}

function setImageVideoChoiceVisibility(isVisible) {
  imageVideoChoiceField.hidden = !isVisible;
}

function renderImageVideoChoice(result, selectedScore = result.explicitnessScore) {
  imageVideoPromptChoice.replaceChildren();

  for (const choice of result.promptChoices || []) {
    const option = document.createElement('option');
    option.value = String(choice.score);
    option.textContent = `${choice.score}/10：${choice.zh}`;
    imageVideoPromptChoice.append(option);
  }

  imageVideoPromptChoice.value = String(selectedScore);
  setImageVideoChoiceVisibility(Boolean(result.promptChoices?.length));
}

function applyImageVideoChoice(score) {
  if (!lastImageVideoResult) {
    return;
  }

  const choice = lastImageVideoResult.promptChoices.find((candidate) => String(candidate.score) === String(score));
  if (!choice) {
    return;
  }

  videoConfirmationPrompt.value = lastImageVideoResult.chineseConfirmation.replace(/中文對照詞意：[^，]+/, `中文對照詞意：${choice.zh}`);
  videoResultPrompt.value = lastImageVideoResult.englishPrompt.replace(/adult-only explicitness rating: \d+\/10, [^,]+/, `adult-only explicitness rating: ${choice.score}/10, ${choice.en}`);
  setOutputVisibility('video', true);
}

setupCustomizationControls();
setTextStep('visual');
setMode('text');
setOutputVisibility('text', false);
setOutputVisibility('video', false);

textModeButton.addEventListener('click', () => setMode('text'));
videoModeButton.addEventListener('click', () => setMode('video'));

for (const button of textStepButtons) {
  button.addEventListener('click', () => setTextStep(button.dataset.textStep));
}

count.addEventListener('change', () => {
  updateCharacterCards();
});

actionMode.addEventListener('change', updateActionDetailOptions);

autoVideoChoice.addEventListener('change', () => {
  autoVideoPrompt.value = autoVideoChoice.value;
});

imageInput.addEventListener('change', async () => {
  const [file] = imageInput.files;

  uploadedImageAnalysis = null;
  lastImageVideoResult = null;
  setImageVideoChoiceVisibility(false);

  if (!file) {
    setStatus(imageVideoStatus, '尚未上傳圖片；圖片分析只在本機瀏覽器進行。');
    return;
  }

  if (!file.type.startsWith('image/')) {
    setStatus(imageVideoStatus, '請上傳圖片檔案。', 'error');
    return;
  }

  try {
    uploadedImageAnalysis = await loadImageAnalysis(file);
    const roughScore = estimateExplicitnessScore({
      fileName: uploadedImageAnalysis.fileName,
      skinToneRatio: uploadedImageAnalysis.skinToneRatio,
      imageDescription: imageDescription.value,
      desiredMotion: desiredMotion.value
    });
    setStatus(imageVideoStatus, `已讀取圖片，初步色情程度約 ${roughScore}/10；可補充描述或希望動態後產生提示詞。`, 'success');
  } catch (error) {
    setStatus(imageVideoStatus, error.message, 'error');
  }
});

rewriteButton.addEventListener('click', () => {
  const result = rewritePrompt(getTextRewriteSource(), {
    intensity: intensity.value,
    lighting: lighting.value,
    camera: camera.value,
    composition: composition.value,
    artStyle: artStyle.value,
    gender: gender.value,
    race: race.value,
    emotion: emotion.value,
    timePoint: timePoint.value,
    ageBracket: ageBracket.value,
    occupation: occupation.value,
    bodyProportion: bodyProportion.value,
    face: face.value,
    outfit: outfit.value,
    outfitColor: outfitColor.value,
    outfitMaterial: outfitMaterial.value,
    bodyFeature: bodyFeature.value,
    outfitIntegrity: outfitIntegrity.value,
    count: count.value,
    cosplayPrompt: cosplayPrompt.value,
    characterDetails: collectCharacterDetails(),
    accessory: accessory.value,
    scene: scene.value,
    actionMode: actionMode.value,
    actionDetail: actionDetail.value
  });

  renderTextResult(result, '文生圖提示詞已產生：中文僅供確認，下方可複製區只包含英文提示詞。');
});

imageVideoButton.addEventListener('click', () => {
  if (!uploadedImageAnalysis) {
    setStatus(imageVideoStatus, '請先上傳圖片。', 'error');
    return;
  }

  const result = createImageToVideoPrompt({
    fileName: uploadedImageAnalysis.fileName,
    skinToneRatio: uploadedImageAnalysis.skinToneRatio,
    imageDescription: imageDescription.value,
    desiredMotion: desiredMotion.value,
    durationSeconds: videoDuration.value,
    motionStrength: motionStrength.value
  });

  if (!result.ok) {
    setStatus(imageVideoStatus, `未通過安全篩選，色情程度估計 ${result.explicitnessScore}/10；請查看修正建議。`, 'error');
    lastImageVideoResult = null;
    setImageVideoChoiceVisibility(false);
    renderVideoResult(result, result.reason);
    return;
  }

  lastImageVideoResult = result;
  renderImageVideoChoice(result);
  renderVideoResult(result, `圖轉影提示詞已產生，AI 估計色情程度 ${result.explicitnessScore}/10；可挑選相鄰程度，中文僅供對照，下方可複製英文。`);
  setStatus(imageVideoStatus, '圖轉影提示詞已通過安全篩選。', 'success');
});

imageVideoPromptChoice.addEventListener('change', () => {
  applyImageVideoChoice(imageVideoPromptChoice.value);
  setStatus(videoStatus, `已切換為 ${imageVideoPromptChoice.value}/10 圖轉影英文提示詞，可複製貼上。`, 'success');
});

copyAutoVideoButton.addEventListener('click', async () => {
  if (!autoVideoPrompt.value) {
    setStatus(textStatus, '尚未產生可複製的自動圖轉影提示詞。', 'error');
    return;
  }

  await navigator.clipboard.writeText(autoVideoPrompt.value);
  setStatus(textStatus, '已複製自動圖轉影英文提示詞到剪貼簿。', 'success');
});

copyTextButton.addEventListener('click', async () => {
  if (!textResultPrompt.value) {
    setStatus(textStatus, '沒有可複製的文生圖英文提示詞。', 'error');
    return;
  }

  await navigator.clipboard.writeText(textResultPrompt.value);
  setStatus(textStatus, '已複製文生圖英文提示詞到剪貼簿。', 'success');
});

copyVideoButton.addEventListener('click', async () => {
  if (!videoResultPrompt.value) {
    setStatus(videoStatus, '沒有可複製的圖轉影英文提示詞。', 'error');
    return;
  }

  await navigator.clipboard.writeText(videoResultPrompt.value);
  setStatus(videoStatus, '已複製圖轉影英文提示詞到剪貼簿。', 'success');
});

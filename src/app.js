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
const multiCharacterDetails = document.querySelector('#multiCharacterDetails');
const scene = document.querySelector('#scene');
const accessory = document.querySelector('#accessory');
const action = document.querySelector('#action');
const pose = document.querySelector('#pose');
const customConditions = document.querySelector('#customConditions');
const rewriteButton = document.querySelector('#rewriteButton');
const textModeButton = document.querySelector('#textModeButton');
const videoModeButton = document.querySelector('#videoModeButton');
const textPromptPanel = document.querySelector('#textPromptPanel');
const imageVideoPanel = document.querySelector('#imageVideoPanel');
const beginnerPreview = document.querySelector('#beginnerPreview');
const previewStage = document.querySelector('#previewStage');
const previewSummary = document.querySelector('#previewSummary');
const previewDetails = document.querySelector('#previewDetails');
const previewAdvice = document.querySelector('#previewAdvice');
const previewChips = document.querySelector('#previewChips');
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
const imagePreview = document.querySelector('#imagePreview');
const imageDescription = document.querySelector('#imageDescription');
const desiredMotion = document.querySelector('#desiredMotion');
const videoDuration = document.querySelector('#videoDuration');
const motionStrength = document.querySelector('#motionStrength');
const imageVideoButton = document.querySelector('#imageVideoButton');
const imageVideoChoiceField = document.querySelector('#imageVideoChoiceField');
const imageVideoPromptChoice = document.querySelector('#imageVideoPromptChoice');
const imageVideoStatus = document.querySelector('#imageVideoStatus');
const characterCards = Array.from(document.querySelectorAll('[data-character-card]'));

let uploadedImageAnalysis = null;
let lastImageVideoResult = null;

function setStatus(element, message, state = 'idle') {
  element.textContent = message;
  element.dataset.state = state;
}

function setMode(mode) {
  const isTextMode = mode === 'text';
  textModeButton.classList.toggle('active', isTextMode);
  videoModeButton.classList.toggle('active', !isTextMode);
  textPromptPanel.hidden = !isTextMode;
  imageVideoPanel.hidden = isTextMode;
  beginnerPreview.hidden = !isTextMode;
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

function updateCountAwareOptions() {
  const previousAction = action.value;
  const previousPose = pose.value;
  const actionOptions = getActionsForCount(count.value);
  const poseOptions = getPosesForCount(count.value);
  populateSelect(action, actionOptions);
  populateSelect(pose, poseOptions);

  if (actionOptions.some((option) => option.zh === previousAction)) {
    action.value = previousAction;
  }

  if (poseOptions.some((option) => option.zh === previousPose)) {
    pose.value = previousPose;
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

function getSelectedLabel(element) {
  return element?.value || 'AI判斷';
}

function getTextRewriteSource() {
  return sourcePrompt.value.trim() || 'consenting adult visual portrait based on the selected customization controls';
}

function getPreviewSeed() {
  return [
    sourcePrompt.value,
    intensity.value,
    count.value,
    scene.value,
    artStyle.value
  ].join('|');
}

function getSeededIndex(seed, length) {
  if (length <= 0) {
    return 0;
  }

  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash) % length;
}

function getResolvedLabel(element) {
  const selected = getSelectedLabel(element);
  if (selected !== 'AI判斷') {
    return selected;
  }

  const candidates = Array.from(element.options || []).map(({ value }) => value).filter((value) => value && value !== 'AI判斷');
  if (!candidates.length) {
    return 'AI建議：依整體提示自動補齊';
  }

  const index = element === count ? 0 : getSeededIndex(`${getPreviewSeed()}|${element.id}`, candidates.length);
  return `AI建議：${candidates[index]}`;
}

function getResolvedPlainLabel(element) {
  return getResolvedLabel(element).replace(/^AI建議：/, '');
}

function addPreviewChip(fragment, label, value) {
  const chip = document.createElement('span');
  chip.className = 'preview-chip';
  chip.textContent = `${label}: ${value || 'AI判斷'}`;
  fragment.append(chip);
}

function getPreviewCountGroup() {
  const selectedCount = getResolvedLabel(count);
  if (/三人/.test(selectedCount)) {
    return 'three';
  }
  if (/雙人|兩人/.test(selectedCount)) {
    return 'two';
  }
  return 'single';
}

function getPreviewPalette() {
  const text = [
    getResolvedLabel(timePoint),
    getResolvedLabel(lighting),
    getResolvedLabel(outfitColor),
    getResolvedLabel(artStyle)
  ].join(' ');

  if (/藍|冷|銀|冰|夜|賽博|霓虹|水|海/.test(text)) {
    return { tone: 'cool', primary: '#55d8ff', secondary: '#7b6cff', outfit: '#7dd8ff' };
  }
  if (/金|暖|琥珀|夕陽|火|紅|酒|黑金|節日/.test(text)) {
    return { tone: 'warm', primary: '#ffb25f', secondary: '#ff4f93', outfit: '#ff9b66' };
  }
  if (/粉|玫瑰|糖果|蜜桃|夢幻|柔/.test(text)) {
    return { tone: 'rose', primary: '#ff8ac7', secondary: '#ffc2dc', outfit: '#ff6fb3' };
  }
  if (/綠|森林|青|翡翠/.test(text)) {
    return { tone: 'forest', primary: '#74f0b2', secondary: '#2fa978', outfit: '#8de0a6' };
  }
  return { tone: 'default', primary: '#ff5f9f', secondary: '#f7d98f', outfit: '#ff8fba' };
}

function getPreviewSceneType() {
  const selectedScene = getResolvedLabel(scene);
  if (/浴|泳|海|雨|水/.test(selectedScene)) {
    return 'water';
  }
  if (/宮|城|古|神|魔|森林|花園/.test(selectedScene)) {
    return 'fantasy';
  }
  if (/棚|攝影|白色|黑色/.test(selectedScene)) {
    return 'studio';
  }
  if (/夜|酒吧|霓虹|城市|陽台/.test(selectedScene)) {
    return 'night';
  }
  return 'room';
}

function getPreviewCameraType() {
  const selectedCamera = getResolvedLabel(camera);
  if (/俯|鳥瞰|高角/.test(selectedCamera)) {
    return 'high';
  }
  if (/仰|低角/.test(selectedCamera)) {
    return 'low';
  }
  if (/近|特寫|臉部|半身/.test(selectedCamera)) {
    return 'close';
  }
  if (/遠|全身|廣角/.test(selectedCamera)) {
    return 'wide';
  }
  return 'mid';
}

function addPreviewLayer(className, text = '') {
  const layer = document.createElement('span');
  layer.className = className;
  layer.textContent = text;
  previewStage.append(layer);
  return layer;
}

function renderPreviewSilhouettes(group) {
  const total = group === 'three' ? 3 : group === 'two' ? 2 : 1;
  const palette = getPreviewPalette();
  const selectedPose = getResolvedLabel(pose);
  previewStage.dataset.count = group;
  previewStage.dataset.scene = getPreviewSceneType();
  previewStage.dataset.camera = getPreviewCameraType();
  previewStage.dataset.tone = palette.tone;
  previewStage.style.setProperty('--preview-primary', palette.primary);
  previewStage.style.setProperty('--preview-secondary', palette.secondary);
  previewStage.style.setProperty('--preview-outfit', palette.outfit);
  previewStage.replaceChildren();

  addPreviewLayer('preview-light-beam');
  addPreviewLayer('preview-scene-mark', getResolvedLabel(scene));
  addPreviewLayer('preview-camera-mark', getResolvedLabel(camera));

  for (let index = 0; index < total; index += 1) {
    const silhouette = document.createElement('span');
    silhouette.className = `preview-silhouette character-${index + 1}`;
    silhouette.dataset.role = total === 1 ? getResolvedPlainLabel(gender) : `角色 ${index + 1}`;
    const outfitLayer = document.createElement('span');
    outfitLayer.className = 'preview-outfit-layer';
    silhouette.append(outfitLayer);
    previewStage.append(silhouette);
  }

  if (group !== 'single') {
    addPreviewLayer('preview-interaction-line', getResolvedLabel(action));
  }

  if (group === 'single' && /手|POV|主觀|鏡頭/.test(selectedPose)) {
    addPreviewLayer('preview-hand');
  }

  const resolvedAccessory = getResolvedLabel(accessory);
  if (resolvedAccessory) {
    addPreviewLayer('preview-prop', resolvedAccessory);
  }
}

function addPreviewDetail(fragment, title, value) {
  const item = document.createElement('article');
  item.className = 'preview-detail-card';
  const heading = document.createElement('strong');
  heading.textContent = title;
  const content = document.createElement('span');
  content.textContent = value;
  item.append(heading, content);
  fragment.append(item);
}

function updateBeginnerPreview() {
  const group = getPreviewCountGroup();
  renderPreviewSilhouettes(group);

  const source = sourcePrompt.value.trim() || '未輸入原始描述，將依目前客製化選項自動建立成人視覺方向';
  const customText = customConditions.value.trim();
  const multiDetails = group === 'single' ? '' : multiCharacterDetails.value.trim();
  const characterDetails = group === 'single' ? [] : collectCharacterDetails();
  const interactionHint = group === 'single' ? '單人：重點放在鏡頭、POV 或入鏡手互動。' : '多人：重點放在角色間距離、視線與互動。';
  const resolved = {
    count: getResolvedLabel(count),
    artStyle: getResolvedLabel(artStyle),
    lighting: getResolvedLabel(lighting),
    timePoint: getResolvedLabel(timePoint),
    gender: getResolvedLabel(gender),
    race: getResolvedLabel(race),
    emotion: getResolvedLabel(emotion),
    ageBracket: getResolvedLabel(ageBracket),
    occupation: getResolvedLabel(occupation),
    bodyProportion: getResolvedLabel(bodyProportion),
    face: getResolvedLabel(face),
    outfit: getResolvedLabel(outfit),
    outfitColor: getResolvedLabel(outfitColor),
    outfitMaterial: getResolvedLabel(outfitMaterial),
    outfitIntegrity: getResolvedLabel(outfitIntegrity),
    bodyFeature: getResolvedLabel(bodyFeature),
    scene: getResolvedLabel(scene),
    camera: getResolvedLabel(camera),
    composition: getResolvedLabel(composition),
    action: getResolvedLabel(action),
    pose: getResolvedLabel(pose),
    accessory: getResolvedLabel(accessory)
  };

  previewSummary.textContent = [
    `大概畫面：${source}`,
    `畫風 ${resolved.artStyle}，${resolved.lighting}，${resolved.timePoint}。`,
    `角色：${resolved.gender}／${resolved.race}／${resolved.emotion}；服裝：${resolved.outfit}、${resolved.outfitColor}、${resolved.outfitMaterial}。`,
    `動作與體位：${resolved.action}；${resolved.pose}。`,
    interactionHint,
    customText ? `你的客製化條件：${customText}` : '',
    multiDetails ? `多人細節：${multiDetails}` : '',
    characterDetails.length ? `角色分別設定：${characterDetails.join('；')}` : ''
  ].filter(Boolean).join(' ');

  const detailFragment = document.createDocumentFragment();
  addPreviewDetail(detailFragment, '鏡頭構圖', `${resolved.camera}｜${resolved.composition}｜${resolved.count}`);
  addPreviewDetail(detailFragment, '光色質感', `${resolved.timePoint}｜${resolved.lighting}`);
  addPreviewDetail(detailFragment, '角色設定', `${resolved.gender}｜${resolved.race}｜${resolved.ageBracket}｜${resolved.bodyProportion}｜${resolved.face}`);
  addPreviewDetail(detailFragment, '職業情緒', `${resolved.occupation}｜${resolved.emotion}｜${resolved.bodyFeature}`);
  addPreviewDetail(detailFragment, '服裝道具', `${resolved.outfit}｜${resolved.outfitColor}｜${resolved.outfitMaterial}｜${resolved.outfitIntegrity}｜${resolved.accessory}`);
  addPreviewDetail(detailFragment, '動作場景', `${resolved.action}｜${resolved.pose}｜${resolved.scene}`);
  if (customText || multiDetails || characterDetails.length) {
    addPreviewDetail(detailFragment, '你的客製化', [customText, multiDetails, ...characterDetails].filter(Boolean).join('｜'));
  }
  previewDetails.replaceChildren(detailFragment);

  const advice = [];
  if (!sourcePrompt.value.trim()) {
    advice.push('未輸入原始描述也可轉譯；系統會用目前客製化選項建立基本主題');
  }
  if (count.value === 'AI判斷') {
    advice.push('人數未選時先以單人構圖示意；選雙人／三人會出現互動線');
  }
  if (!customText) {
    advice.push('可在客製化條件補鏡頭焦段、不要的元素或特殊偏好');
  }
  previewAdvice.textContent = advice.length ? `新手建議：${advice.join('；')}。` : '目前條件已足夠，可以按「轉譯提示詞」產生可複製英文提示詞。';

  const fragment = document.createDocumentFragment();
  addPreviewChip(fragment, '人數', resolved.count);
  addPreviewChip(fragment, '畫風', resolved.artStyle);
  addPreviewChip(fragment, '鏡位', resolved.camera);
  addPreviewChip(fragment, '構圖', resolved.composition);
  addPreviewChip(fragment, '場景', resolved.scene);
  addPreviewChip(fragment, '動作', resolved.action);
  addPreviewChip(fragment, '體位', resolved.pose);
  if (customText) {
    addPreviewChip(fragment, '客製化', customText);
  }
  previewChips.replaceChildren(fragment);
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
  setupCharacterControls();
  updateCountAwareOptions();
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
        imagePreview.src = objectUrl;
        imagePreview.hidden = false;
        const skinToneRatio = getSkinToneRatioFromImage(image);
        resolve({
          fileName: file.name,
          skinToneRatio,
          width: image.naturalWidth,
          height: image.naturalHeight,
          objectUrl
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

function renderTextResult(result, successMessage) {
  if (!result.ok || !result.screened) {
    textConfirmationPrompt.value = '';
    textResultPrompt.value = '';
    setOutputVisibility('text', false);
    setStatus(textStatus, result.reason || '提示詞未通過安全篩選。', 'error');
    return;
  }

  textConfirmationPrompt.value = result.chineseConfirmation;
  textResultPrompt.value = result.englishPrompt;
  setOutputVisibility('text', true);
  setStatus(textStatus, successMessage, 'success');
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
updateBeginnerPreview();
setMode('text');
setOutputVisibility('text', false);
setOutputVisibility('video', false);

textModeButton.addEventListener('click', () => setMode('text'));
videoModeButton.addEventListener('click', () => setMode('video'));

count.addEventListener('change', () => {
  updateCountAwareOptions();
  updateCharacterCards();
  updateBeginnerPreview();
});

const previewInputs = [
  sourcePrompt, intensity, lighting, camera, composition, artStyle, gender, race, emotion,
  timePoint, ageBracket, occupation, bodyProportion, face, outfit, outfitColor,
  outfitMaterial, bodyFeature, outfitIntegrity, multiCharacterDetails, scene, accessory,
  action, pose, customConditions
];

for (const element of previewInputs) {
  element.addEventListener('input', updateBeginnerPreview);
  element.addEventListener('change', updateBeginnerPreview);
}

for (let index = 1; index <= 3; index += 1) {
  for (const field of ['Gender', 'Occupation', 'Age', 'Body']) {
    document.querySelector(`#character${index}${field}`).addEventListener('change', updateBeginnerPreview);
  }
}

imageInput.addEventListener('change', async () => {
  const [file] = imageInput.files;

  uploadedImageAnalysis = null;
  lastImageVideoResult = null;
  setImageVideoChoiceVisibility(false);

  if (!file) {
    imagePreview.hidden = true;
    imagePreview.removeAttribute('src');
    setStatus(imageVideoStatus, '尚未上傳圖片；圖片分析只在本機瀏覽器進行。');
    return;
  }

  if (!file.type.startsWith('image/')) {
    imagePreview.hidden = true;
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
    multiCharacterDetails: multiCharacterDetails.value,
    characterDetails: collectCharacterDetails(),
    accessory: accessory.value,
    scene: scene.value,
    action: action.value,
    pose: pose.value,
    customConditions: customConditions.value
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

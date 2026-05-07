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
const sensualOutfit = document.querySelector('#sensualOutfit');
const sensualScene = document.querySelector('#sensualScene');
const sensualAccessory = document.querySelector('#sensualAccessory');
const sensualActionMode = document.querySelector('#sensualActionMode');
const sensualActionDetail = document.querySelector('#sensualActionDetail');
const autoVideoPanel = document.querySelector('#autoVideoPanel');
const autoVideoChoice = document.querySelector('#autoVideoChoice');
const autoVideoConfirmation = document.querySelector('#autoVideoConfirmation');
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
const dialogueToCamera = document.querySelector('#dialogueToCamera');
const dialogueBetweenCharacters = document.querySelector('#dialogueBetweenCharacters');
const videoDuration = document.querySelector('#videoDuration');
const motionStrength = document.querySelector('#motionStrength');
const imageVideoButton = document.querySelector('#imageVideoButton');
const imageVideoChoiceField = document.querySelector('#imageVideoChoiceField');
const imageVideoPromptChoice = document.querySelector('#imageVideoPromptChoice');
const imageVideoStatus = document.querySelector('#imageVideoStatus');
const characterCards = Array.from(document.querySelectorAll('[data-character-card]'));
const appPageButtons = Array.from(document.querySelectorAll('[data-app-page]'));
const appPagePanels = Array.from(document.querySelectorAll('[data-app-page-panel]'));
const gmailInput = document.querySelector('#gmailInput');
const designerLoginButton = document.querySelector('#designerLoginButton');
const sensualLoginButton = document.querySelector('#sensualLoginButton');
const sensualConfirm = document.querySelector('#sensualConfirm');
const authStatus = document.querySelector('#authStatus');
const savePromptButton = document.querySelector('#savePromptButton');
const saveTitleInput = document.querySelector('#saveTitleInput');
const resultImageInput = document.querySelector('#resultImageInput');
const savedPromptList = document.querySelector('#savedPromptList');
const sensualOnlyElements = Array.from(document.querySelectorAll('.sensual-only'));
const textStepButtons = Array.from(document.querySelectorAll('[data-text-step]'));
const textStepPanels = Array.from(document.querySelectorAll('[data-text-step-panel]'));
const characterSubstepButtons = Array.from(document.querySelectorAll('[data-character-substep]'));
const sceneSubstepButtons = Array.from(document.querySelectorAll('[data-scene-substep]'));
const adultOnlyControls = Array.from(document.querySelectorAll('.adult-only-control'));

let uploadedImageAnalysis = null;
let lastImageVideoResult = null;
let activeAudienceMode = localStorage.getItem('niaiAudienceMode') || 'designer';
let activeSavedPromptId = null;

function setStatus(element, message, state = 'idle') {
  element.textContent = message;
  element.dataset.state = state;
}

function setTextStep(stepName) {
  if (stepName === 'sensual' && activeAudienceMode !== 'sensual') {
    stepName = 'visual';
  }
  for (const button of textStepButtons) {
    const isActive = button.dataset.textStep === stepName;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  }

  for (const panel of textStepPanels) {
    panel.hidden = panel.dataset.textStepPanel !== stepName;
  }
}



function setSubstep(buttons, activeName, dataKey) {
  for (const button of buttons) {
    const isActive = button.dataset[dataKey] === activeName;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  }
}

function setFieldVisibilityByControlId(id, isVisible) {
  const element = document.querySelector(`#${id}`);
  const field = element?.closest('.field') || element;
  if (field) {
    field.hidden = !isVisible;
  }
}

function setCharacterSubstep(stepName) {
  setSubstep(characterSubstepButtons, stepName, 'characterSubstep');
  const groups = {
    basics: ['gender', 'race', 'emotion', 'timePoint', 'ageBracket', 'occupation', 'bodyProportion', 'face', 'count'],
    outfit: ['outfit', 'outfitColor', 'outfitMaterial', 'bodyFeature', 'outfitIntegrity'],
    multi: ['characterControls']
  };
  const allIds = Object.values(groups).flat();

  for (const id of allIds) {
    setFieldVisibilityByControlId(id, groups[stepName]?.includes(id));
  }

  updateAdultOnlyControls();
}

function setSceneSubstep(stepName) {
  setSubstep(sceneSubstepButtons, stepName, 'sceneSubstep');
  const groups = {
    place: ['scene', 'accessory'],
    motion: ['actionMode', 'actionDetail']
  };
  const allIds = Object.values(groups).flat();

  for (const id of allIds) {
    setFieldVisibilityByControlId(id, groups[stepName]?.includes(id));
  }
}

function updateAdultOnlyControls() {
  const showAdultOnly = activeAudienceMode === 'sensual';
  for (const element of adultOnlyControls) {
    element.hidden = !showAdultOnly;
  }

  if (!showAdultOnly) {
    if (outfitIntegrity) outfitIntegrity.value = 'AI判斷';
    for (let index = 1; index <= 3; index += 1) {
      const characterIntegrity = document.querySelector(`#character${index}OutfitIntegrity`);
      if (characterIntegrity) characterIntegrity.value = 'AI判斷';
    }
  }
}

function setAppPage(pageName) {
  for (const button of appPageButtons) {
    button.classList.toggle('active', button.dataset.appPage === pageName);
  }
  for (const panel of appPagePanels) {
    panel.hidden = panel.dataset.appPagePanel !== pageName;
  }
}

function updateAudienceMode(mode, gmail) {
  activeAudienceMode = mode;
  localStorage.setItem('niaiAudienceMode', mode);
  if (gmail) {
    localStorage.setItem('niaiGmail', gmail);
  }
  for (const element of sensualOnlyElements) {
    element.hidden = mode !== 'sensual';
  }
  if (mode !== 'sensual' && document.querySelector('[data-text-step-panel="sensual"]')?.hidden === false) {
    setTextStep('visual');
  }
  authStatus.textContent = mode === 'sensual'
    ? `已用 ${gmail || 'Gmail'} 登入色友；獨立成人向專區與合意規範已啟用。`
    : `已用 ${gmail || 'Gmail'} 登入設友；目前只顯示一般設計素材。`;
  setupCustomizationControls();
  setCharacterSubstep(document.querySelector('[data-character-substep].active')?.dataset.characterSubstep || 'basics');
  setSceneSubstep(document.querySelector('[data-scene-substep].active')?.dataset.sceneSubstep || 'place');
  updateAdultOnlyControls();
  authStatus.dataset.state = 'success';
}

function getSavedPrompts() {
  try {
    return JSON.parse(localStorage.getItem('niaiSavedPrompts') || '[]');
  } catch {
    return [];
  }
}

function setSavedPrompts(items) {
  localStorage.setItem('niaiSavedPrompts', JSON.stringify(items));
}

function makeReadonlyTextarea(value, rows = 4) {
  const textarea = document.createElement('textarea');
  textarea.rows = rows;
  textarea.readOnly = true;
  textarea.value = value || '';
  return textarea;
}

function makeSavedLabel(text) {
  const label = document.createElement('p');
  label.className = 'saved-label';
  label.textContent = text;
  return label;
}

function renderSavedPrompts() {
  const items = getSavedPrompts();
  savedPromptList.replaceChildren();
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'status';
    empty.textContent = '尚未儲存提示詞。';
    savedPromptList.append(empty);
    return;
  }
  for (const item of items) {
    const article = document.createElement('article');
    article.className = 'saved-item panel';
    article.dataset.active = String(item.id === activeSavedPromptId);
    const title = document.createElement('h3');
    title.textContent = item.title || item.cosplay || '未命名提示詞';
    const meta = document.createElement('p');
    meta.className = 'status saved-meta';
    meta.textContent = `${item.gmail || 'local'}｜${item.mode === 'sensual' ? '色友' : '設友'}｜${new Date(item.createdAt).toLocaleString()}`;

    const dialogueSummary = document.createElement('p');
    dialogueSummary.className = 'status';
    dialogueSummary.textContent = [
      item.dialogueToCamera ? `跟鏡頭說：${item.dialogueToCamera}` : '',
      item.dialogueBetweenCharacters ? `角色間互動：${item.dialogueBetweenCharacters}` : ''
    ].filter(Boolean).join('｜') || '未設定對話。';

    const chinesePrompt = makeReadonlyTextarea(item.chineseConfirmation, 5);
    const englishPrompt = makeReadonlyTextarea(item.englishPrompt, 6);
    const videoZh = makeReadonlyTextarea(item.autoVideoZh, 4);
    const videoEn = makeReadonlyTextarea(item.autoVideoPrompt, 5);

    const choose = document.createElement('button');
    choose.type = 'button';
    choose.className = 'secondary-button';
    choose.textContent = '選取此串';
    choose.addEventListener('click', () => {
      activeSavedPromptId = item.id;
      renderSavedPrompts();
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'secondary-button';
    remove.textContent = '刪除';
    remove.addEventListener('click', () => {
      setSavedPrompts(getSavedPrompts().filter((candidate) => candidate.id !== item.id));
      if (activeSavedPromptId === item.id) activeSavedPromptId = null;
      renderSavedPrompts();
    });
    const actions = document.createElement('div');
    actions.className = 'saved-actions-row';
    actions.append(choose, remove);

    const images = document.createElement('div');
    images.className = 'saved-images';
    for (const image of item.images || []) {
      const img = document.createElement('img');
      img.src = image.dataUrl;
      img.alt = '壓縮儲存的成果圖，僅供對照不可下載';
      images.append(img);
    }
    article.append(
      title,
      meta,
      dialogueSummary,
      makeSavedLabel('文生圖中文對照'), chinesePrompt,
      makeSavedLabel('Text-to-image English prompt'), englishPrompt,
      makeSavedLabel('圖轉影中文對照'), videoZh,
      makeSavedLabel('Image-to-video English prompt'), videoEn,
      actions,
      images
    );
    savedPromptList.append(article);
  }
}

function saveCurrentPrompt() {
  if (!textResultPrompt.value) {
    setStatus(textStatus, '目前沒有可儲存的英文提示詞。', 'error');
    return;
  }
  const item = {
    id: `prompt-${Date.now()}`,
    gmail: localStorage.getItem('niaiGmail') || gmailInput.value.trim(),
    mode: activeAudienceMode,
    title: saveTitleInput.value.trim() || cosplayPrompt.value.trim() || '未命名提示詞',
    cosplay: cosplayPrompt.value.trim(),
    dialogueToCamera: dialogueToCamera.value.trim(),
    dialogueBetweenCharacters: dialogueBetweenCharacters.value.trim(),
    chineseConfirmation: textConfirmationPrompt.value,
    englishPrompt: textResultPrompt.value,
    autoVideoZh: autoVideoConfirmation.value,
    autoVideoPrompt: autoVideoPrompt.value,
    createdAt: new Date().toISOString(),
    images: []
  };
  const items = [item, ...getSavedPrompts()];
  setSavedPrompts(items);
  activeSavedPromptId = item.id;
  renderSavedPrompts();
  saveTitleInput.value = '';
  setAppPage('library');
}

function compressResultImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(480 / image.naturalWidth, 480 / image.naturalHeight, 1);
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.48));
    }, { once: true });
    image.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('無法讀取成果圖。'));
    }, { once: true });
    image.src = objectUrl;
  });
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

const DESIGNER_BLOCKED_OPTION_PATTERN = /情慾|色情|性感|誘惑|貼身|私房|夜色|裸|近乎未著|滑落|半透明|透明|吊襪|束縛|手銬|蕾絲|薄紗|網紗|乳膠|PVC|漆皮|蛇紋|身體鏈|胸鏈|腰鏈|透明薄膜|harness|adult sensual|sensual|seduction|alluring|body-hugging|nude|unclothed|garter|restraint|cuff|lace|tulle|mesh|latex|PVC|patent|transparent|chest-chain|body chain/i;

function isDesignerSafeOption(optionText) {
  const optionObject = typeof optionText === 'string' ? { zh: optionText, en: optionText } : optionText;
  const rarity = optionObject?.rarity || '';

  if (/sensual|intimate|taboo/.test(rarity)) {
    return false;
  }

  return !DESIGNER_BLOCKED_OPTION_PATTERN.test(`${optionObject?.zh || ''} ${optionObject?.en || ''}`);
}

function getDesignerOptions(options) {
  return options.filter(isDesignerSafeOption);
}

function getSensualOnlyOptions(options) {
  return options.filter((optionText) => {
    const optionObject = typeof optionText === 'string' ? { zh: optionText, en: optionText } : optionText;
    return /sensual|intimate|taboo/.test(optionObject?.rarity || '') || DESIGNER_BLOCKED_OPTION_PATTERN.test(`${optionObject?.zh || ''} ${optionObject?.en || ''}`);
  });
}

function getOptionLabel(optionText) {
  const label = typeof optionText === 'string' ? optionText : optionText.zh;
  return String(label).split('｜').at(-1);
}

function populateSelect(select, options, { includeAi = true } = {}) {
  const previousValue = select.value;
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
  if (Array.from(select.options).some((option) => option.value === previousValue)) {
    select.value = previousValue;
  }
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
  const detailOptions = getDesignerOptions(getActionDetailsForMode(actionMode.value));
  populateSelect(actionDetail, detailOptions);

  if (detailOptions.some((option) => option.zh === previousDetail)) {
    actionDetail.value = previousDetail;
  }
}

function updateSensualActionDetailOptions() {
  const previousDetail = sensualActionDetail.value;
  const detailOptions = getSensualOnlyOptions(getActionDetailsForMode(sensualActionMode.value));
  populateSelect(sensualActionDetail, detailOptions);

  if (detailOptions.some((option) => option.zh === previousDetail)) {
    sensualActionDetail.value = previousDetail;
  }
}

function setupCharacterControls() {
  for (let index = 1; index <= 3; index += 1) {
    populateSelect(document.querySelector(`#character${index}Gender`), CUSTOMIZATION_OPTIONS.genders);
    populateSelect(document.querySelector(`#character${index}Race`), RACE_OPTIONS);
    populateSelect(document.querySelector(`#character${index}Emotion`), EMOTION_OPTIONS);
    populateSelect(document.querySelector(`#character${index}Occupation`), OCCUPATION_OPTIONS);
    populateSelect(document.querySelector(`#character${index}Age`), AGE_BRACKET_OPTIONS);
    populateSelect(document.querySelector(`#character${index}Body`), BODY_PROPORTION_OPTIONS);
    populateSelect(document.querySelector(`#character${index}Face`), CUSTOMIZATION_OPTIONS.faces);
    populateSelect(document.querySelector(`#character${index}Outfit`), getDesignerOptions(CUSTOMIZATION_OPTIONS.outfits));
    populateSelect(document.querySelector(`#character${index}OutfitColor`), CUSTOMIZATION_OPTIONS.outfitColors);
    populateSelect(document.querySelector(`#character${index}OutfitMaterial`), getDesignerOptions(CUSTOMIZATION_OPTIONS.outfitMaterials));
    populateSelect(document.querySelector(`#character${index}BodyFeature`), getDesignerOptions(CUSTOMIZATION_OPTIONS.bodyFeatures));
    populateSelect(document.querySelector(`#character${index}OutfitIntegrity`), getDesignerOptions(CUSTOMIZATION_OPTIONS.outfitIntegrity));
  }
}

function getPresetEnglish(options, value) {
  const match = options.find((option) => option.zh === value || option.en === value);
  return match?.en || value;
}

function collectCharacterDetails() {
  const visibleCount = getVisibleCharacterCount();
  const fields = [
    ['Gender', '性別', 'gender', CUSTOMIZATION_OPTIONS.genders],
    ['Race', '種族', 'race', RACE_OPTIONS],
    ['Emotion', '情緒', 'emotion', EMOTION_OPTIONS],
    ['Occupation', '職業', 'occupation', OCCUPATION_OPTIONS],
    ['Age', '年齡', 'age bracket', AGE_BRACKET_OPTIONS],
    ['Body', '身材比例', 'body proportion', BODY_PROPORTION_OPTIONS],
    ['Face', '臉蛋', 'face', CUSTOMIZATION_OPTIONS.faces],
    ['Outfit', '服裝', 'outfit', CUSTOMIZATION_OPTIONS.outfits],
    ['OutfitColor', '服裝顏色', 'outfit color', CUSTOMIZATION_OPTIONS.outfitColors],
    ['OutfitMaterial', '服裝材質', 'outfit material', CUSTOMIZATION_OPTIONS.outfitMaterials],
    ['BodyFeature', '身上特徵', 'body feature', CUSTOMIZATION_OPTIONS.bodyFeatures],
    ['OutfitIntegrity', '服裝完整度', 'outfit integrity', CUSTOMIZATION_OPTIONS.outfitIntegrity]
  ];
  const details = [];

  for (let index = 1; index <= visibleCount; index += 1) {
    const zhParts = [];
    const enParts = [];

    for (const [idSuffix, zhLabel, enLabel, options] of fields) {
      if (idSuffix === 'OutfitIntegrity' && activeAudienceMode !== 'sensual') {
        continue;
      }
      const value = document.querySelector(`#character${index}${idSuffix}`).value;
      if (!value || value === 'AI判斷') {
        continue;
      }
      zhParts.push(`${zhLabel} ${value}`);
      enParts.push(`${enLabel}: ${getPresetEnglish(options, value)}`);
    }

    if (zhParts.length) {
      details.push({
        zh: `角色${index}: ${zhParts.join('，')}`,
        en: enParts.join(', ')
      });
    }
  }

  return details;
}

function getTextRewriteSource() {
  return cosplayPrompt.value.trim() || 'consenting adult cosplay character portrait based on the selected customization controls';
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
  populateSelect(outfit, getDesignerOptions(CUSTOMIZATION_OPTIONS.outfits));
  populateSelect(outfitColor, CUSTOMIZATION_OPTIONS.outfitColors);
  populateSelect(outfitMaterial, getDesignerOptions(CUSTOMIZATION_OPTIONS.outfitMaterials));
  populateSelect(bodyFeature, getDesignerOptions(CUSTOMIZATION_OPTIONS.bodyFeatures));
  populateSelect(outfitIntegrity, getDesignerOptions(CUSTOMIZATION_OPTIONS.outfitIntegrity));
  populateSelect(count, CUSTOMIZATION_OPTIONS.counts);
  populateSelect(accessory, getDesignerOptions(CUSTOMIZATION_OPTIONS.accessories));
  populateSelect(scene, getDesignerOptions(CUSTOMIZATION_OPTIONS.scenes));
  populateSelect(actionMode, ACTION_MODE_OPTIONS);
  populateSelect(sensualOutfit, getSensualOnlyOptions(CUSTOMIZATION_OPTIONS.outfits));
  populateSelect(sensualScene, getSensualOnlyOptions(CUSTOMIZATION_OPTIONS.scenes));
  populateSelect(sensualAccessory, getSensualOnlyOptions(CUSTOMIZATION_OPTIONS.accessories));
  populateSelect(sensualActionMode, ACTION_MODE_OPTIONS);
  setupCharacterControls();
  updateActionDetailOptions();
  updateSensualActionDetailOptions();
  updateCharacterCards();
  updateAdultOnlyControls();
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


function getDialogueForVideo() {
  const cameraLine = dialogueToCamera.value.trim();
  const interactionLine = dialogueBetweenCharacters.value.trim();
  const zhParts = [];
  const enParts = [];

  if (cameraLine) {
    zhParts.push(`跟鏡頭說：${cameraLine}`);
    enParts.push(containsCjk(cameraLine)
      ? 'dialogue to camera: translate the user-provided camera-facing line into natural English, then animate subtle lip sync and eye contact'
      : `dialogue to camera: ${cameraLine}`);
  }

  if (interactionLine) {
    zhParts.push(`角色間互動對話：${interactionLine}`);
    enParts.push(containsCjk(interactionLine)
      ? 'character-to-character dialogue: translate the user-provided interaction line into natural English, then animate conversational timing and reactions'
      : `character-to-character dialogue: ${interactionLine}`);
  }

  return {
    zh: zhParts.join('；'),
    en: enParts.join(', ')
  };
}

function buildAutoVideoChoices(textPrompt) {
  const base = textPrompt.replace(/\s+/g, ' ').trim();
  const dialogue = getDialogueForVideo();
  const designerVariants = [
    ['AI 1｜自然微動', '依照圖片內容加入眨眼、呼吸、髮絲與衣料自然微動。', 'natural blinking, breathing, subtle hair and clothing motion based on the uploaded or generated image'],
    ['AI 2｜慢速推鏡', '鏡頭慢慢推近主體，保持原本構圖與角色造型。', 'slow push-in toward the subject, preserving original composition and styling'],
    ['AI 3｜環境氛圍', '背景光影與景深輕微漂移，主體保持穩定。', 'gentle background light and depth-of-field drift while keeping the subject stable'],
    ['AI 4｜表情反應', '加入自然表情變化、視線移動與小幅轉頭。', 'natural expression change, eye movement, and a slight head turn'],
    ['AI 5｜電影循環', '短距離電影感運鏡，適合做平順循環短片。', 'short cinematic camera move designed as a smooth loop']
  ];
  const sensualVariants = [
    ['AI 1｜柔和呼吸運鏡', '柔和呼吸與慢推鏡；髮絲、布料輕微晃動，保持原本構圖。', 'subtle breathing, gentle hair and fabric motion, slow cinematic push-in, preserve the source composition'],
    ['AI 2｜眼神與唇部微動', '眼神慢慢移動、唇部微表情與輕微轉頭，不加入露骨行為動畫。', 'slow eye movement, soft lip micro-expression, slight head turn, elegant camera easing, no explicit act animation'],
    ['AI 3｜手部與服裝細節', '手部整理造型、布料自然位移、配件閃光，維持精緻畫面張力。', 'hands adjust styling, fabric shifts naturally, accessory sparkle, controlled elegant visual tension'],
    ['AI 4｜姿態重心變化', '姿態重心慢慢轉移、身體線條有優雅動勢，維持藝術遮擋。', 'slow posture weight shift, graceful body-line motion, light parallax, keep tasteful artistic coverage'],
    ['AI 5｜電影感環繞鏡頭', '短距離電影感環繞鏡頭、景深層次與氛圍光漂移，適合循環。', 'short cinematic orbit, layered depth, atmospheric light drift, smooth loop-ready motion']
  ];
  const variants = activeAudienceMode === 'sensual' ? sensualVariants : designerVariants;
  const safety = activeAudienceMode === 'sensual'
    ? 'no minors, no coercion, no voyeur framing, no graphic violence, no new explicit nudity beyond the source frame'
    : 'safe general-audience motion, no identity change, no abrupt morphing, no graphic violence';

  return variants.map(([label, zh, motion], index) => ({
    label,
    zh: `中文說明：${zh}${dialogue.zh ? `；對話：${dialogue.zh}` : ''}`,
    prompt: `image-to-video prompt option ${index + 1}, use this text-to-image prompt as the source frame: ${base}, motion plan: ${motion}, ${dialogue.en || 'no spoken dialogue requested'}, duration: 5 seconds, motion strength: medium, preserve subject appearance, outfit, scene, camera angle, and art style, ${safety}`
  }));
}

function renderAutoVideoChoices(textPrompt) {
  const choices = buildAutoVideoChoices(textPrompt);
  autoVideoChoice.replaceChildren();

  for (const choice of choices) {
    const option = document.createElement('option');
    option.value = String(choices.indexOf(choice));
    option.textContent = choice.label;
    autoVideoChoice.append(option);
  }

  autoVideoChoice.value = '0';
  autoVideoConfirmation.value = choices[0].zh;
  autoVideoPrompt.value = choices[0].prompt;
  autoVideoPanel.hidden = false;
}

function renderTextResult(result, successMessage) {
  if (!result.ok || !result.screened) {
    textConfirmationPrompt.value = '';
    textResultPrompt.value = '';
    setOutputVisibility('text', false);
    autoVideoPanel.hidden = true;
    autoVideoConfirmation.value = '';
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
    option.textContent = result.audienceMode === 'designer' ? `建議 ${choice.score}：${choice.zh}` : `${choice.score}/10：${choice.zh}`;
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
  if (lastImageVideoResult.audienceMode === 'designer') {
    videoResultPrompt.value = lastImageVideoResult.englishPrompt.replace(/motion suggestion: [^,]+/, `motion suggestion: ${choice.en}`);
  } else {
    videoResultPrompt.value = lastImageVideoResult.englishPrompt.replace(/adult-only explicitness rating: \d+\/10, [^,]+/, `adult-only explicitness rating: ${choice.score}/10, ${choice.en}`);
  }
  setOutputVisibility('video', true);
}

setupCustomizationControls();
setCharacterSubstep('basics');
setSceneSubstep('place');
setTextStep('visual');
setMode('text');
setOutputVisibility('text', false);
setOutputVisibility('video', false);
updateAudienceMode(activeAudienceMode, localStorage.getItem('niaiGmail') || '');
renderSavedPrompts();

textModeButton.addEventListener('click', () => setMode('text'));
videoModeButton.addEventListener('click', () => setMode('video'));

for (const button of textStepButtons) {
  button.addEventListener('click', () => setTextStep(button.dataset.textStep));
}

for (const button of characterSubstepButtons) {
  button.addEventListener('click', () => setCharacterSubstep(button.dataset.characterSubstep));
}

for (const button of sceneSubstepButtons) {
  button.addEventListener('click', () => setSceneSubstep(button.dataset.sceneSubstep));
}

for (const button of appPageButtons) {
  button.addEventListener('click', () => setAppPage(button.dataset.appPage));
}

function getCurrentGmail() {
  return gmailInput.value.trim() || localStorage.getItem('niaiGmail') || '';
}

designerLoginButton.addEventListener('click', () => {
  const gmail = getCurrentGmail();
  if (!/@gmail\.com$/i.test(gmail)) {
    setStatus(authStatus, '請輸入 Gmail；之後可直接按按鈕切換設友／色友，不需要重開頁面。', 'error');
    return;
  }
  sensualConfirm.checked = false;
  updateAudienceMode('designer', gmail);
});

sensualLoginButton.addEventListener('click', () => {
  const gmail = getCurrentGmail();
  if (!/@gmail\.com$/i.test(gmail)) {
    setStatus(authStatus, '請輸入 Gmail；之後可直接按按鈕切換設友／色友，不需要重開頁面。', 'error');
    return;
  }
  if (!sensualConfirm.checked) {
    setStatus(authStatus, '登入色友前請再次確認成年人合意規範。', 'error');
    return;
  }
  updateAudienceMode('sensual', gmail);
});

savePromptButton.addEventListener('click', saveCurrentPrompt);

resultImageInput.addEventListener('change', async () => {
  const [file] = resultImageInput.files;
  if (!file || !activeSavedPromptId) return;
  const dataUrl = await compressResultImage(file);
  const items = getSavedPrompts();
  const item = items.find((candidate) => candidate.id === activeSavedPromptId);
  if (item) {
    item.images = [...(item.images || []), { dataUrl, createdAt: new Date().toISOString() }];
    setSavedPrompts(items);
    renderSavedPrompts();
  }
  resultImageInput.value = '';
});

count.addEventListener('change', () => {
  updateCharacterCards();
});

actionMode.addEventListener('change', updateActionDetailOptions);
sensualActionMode.addEventListener('change', updateSensualActionDetailOptions);

function refreshAutoVideoFromDialogue() {
  if (!textResultPrompt.value || autoVideoPanel.hidden) return;
  const choices = buildAutoVideoChoices(textResultPrompt.value);
  const selectedIndex = Number(autoVideoChoice.value) || 0;
  const choice = choices[selectedIndex] || choices[0];
  autoVideoConfirmation.value = choice.zh;
  autoVideoPrompt.value = choice.prompt;
}

autoVideoChoice.addEventListener('change', refreshAutoVideoFromDialogue);
dialogueToCamera.addEventListener('input', refreshAutoVideoFromDialogue);
dialogueBetweenCharacters.addEventListener('input', refreshAutoVideoFromDialogue);

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
    setStatus(imageVideoStatus, activeAudienceMode === 'sensual'
      ? `已讀取圖片，初步成人向強度約 ${roughScore}/10；可補充描述或希望動態後產生提示詞。`
      : '已讀取圖片；可補充描述、動態或對話後產生 3-5 個一般圖轉影建議。', 'success');
  } catch (error) {
    setStatus(imageVideoStatus, error.message, 'error');
  }
});

function getSensualOverride(generalValue, sensualValue) {
  if (activeAudienceMode !== 'sensual') {
    return generalValue;
  }

  return sensualValue && sensualValue !== 'AI判斷' ? sensualValue : generalValue;
}

rewriteButton.addEventListener('click', () => {
  const result = rewritePrompt(getTextRewriteSource(), {
    audienceMode: activeAudienceMode,
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
    outfit: getSensualOverride(outfit.value, sensualOutfit.value),
    outfitColor: outfitColor.value,
    outfitMaterial: outfitMaterial.value,
    bodyFeature: bodyFeature.value,
    outfitIntegrity: activeAudienceMode === 'sensual' ? outfitIntegrity.value : 'AI判斷',
    count: count.value,
    cosplayPrompt: cosplayPrompt.value,
    characterDetails: collectCharacterDetails(),
    accessory: getSensualOverride(accessory.value, sensualAccessory.value),
    scene: getSensualOverride(scene.value, sensualScene.value),
    actionMode: getSensualOverride(actionMode.value, sensualActionMode.value),
    actionDetail: getSensualOverride(actionDetail.value, sensualActionDetail.value)
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
    motionStrength: motionStrength.value,
    audienceMode: activeAudienceMode,
    dialogueToCamera: dialogueToCamera.value,
    dialogueBetweenCharacters: dialogueBetweenCharacters.value
  });

  if (!result.ok) {
    setStatus(imageVideoStatus, activeAudienceMode === 'sensual'
      ? `未通過安全篩選，成人向強度估計 ${result.explicitnessScore}/10；請查看修正建議。`
      : '未通過安全篩選；請查看修正建議。', 'error');
    lastImageVideoResult = null;
    setImageVideoChoiceVisibility(false);
    renderVideoResult(result, result.reason);
    return;
  }

  lastImageVideoResult = result;
  renderImageVideoChoice(result);
  renderVideoResult(result, activeAudienceMode === 'sensual'
    ? `圖轉影提示詞已產生，AI 估計成人向強度 ${result.explicitnessScore}/10；可挑選相鄰程度，中文僅供對照，下方可複製英文。`
    : '圖轉影提示詞已產生；可挑選 3-5 個依圖片內容生成的一般動態建議，中文僅供對照，下方可複製英文。');
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

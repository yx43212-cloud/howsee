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
const pet = document.querySelector('#pet');
const actionMode = document.querySelector('#actionMode');
const actionDetail = document.querySelector('#actionDetail');
const sensualOutfit = document.querySelector('#sensualOutfit');
const sensualScene = document.querySelector('#sensualScene');
const sensualAccessory = document.querySelector('#sensualAccessory');
const sensualActionMode = document.querySelector('#sensualActionMode');
const sensualActionDetail = document.querySelector('#sensualActionDetail');
const sponsorImageInput = document.querySelector('#sponsorImageInput');
const sponsorText = document.querySelector('#sponsorText');
const sponsorAudienceAge = document.querySelector('#sponsorAudienceAge');
const sponsorAudienceIdentity = document.querySelector('#sponsorAudienceIdentity');
const sponsorGoal = document.querySelector('#sponsorGoal');
const sponsorItemType = document.querySelector('#sponsorItemType');
const sponsorExposureTiming = document.querySelector('#sponsorExposureTiming');
const sponsorExposureForm = document.querySelector('#sponsorExposureForm');
const autoVideoPanel = document.querySelector('#autoVideoPanel');
const autoVideoChoice = document.querySelector('#autoVideoChoice');
const autoVideoConfirmation = document.querySelector('#autoVideoConfirmation');
const autoVideoPrompt = document.querySelector('#autoVideoPrompt');
const copyAutoVideoButton = document.querySelector('#copyAutoVideoButton');
const rewriteButton = document.querySelector('#rewriteButton');
const wizardPrevButton = document.querySelector('#wizardPrevButton');
const wizardNextButton = document.querySelector('#wizardNextButton');
const wizardProgress = document.querySelector('#wizardProgress');
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
const dialogueMode = document.querySelector('#dialogueMode');
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
const themeButtons = Array.from(document.querySelectorAll('[data-theme-choice]'));
const languageButtons = Array.from(document.querySelectorAll('[data-language-choice]'));
const inputComplexityButtons = Array.from(document.querySelectorAll('[data-input-complexity]'));
const complexOnlyElements = Array.from(document.querySelectorAll('.complex-only'));
const authPanel = document.querySelector('.auth-panel');
const landingPage = document.querySelector('#landingPage');
const appShell = document.querySelector('#appShell');
const deepfaceButton = document.querySelector('#deepfaceButton');

let uploadedImageAnalysis = null;
let lastImageVideoResult = null;
let activeAudienceMode = localStorage.getItem('niaiAudienceMode') || 'designer';
let activeInputComplexity = 'simple';
let deepfaceEnabled = false;
let activeSavedPromptId = null;
let sponsorImageName = '';

let currentWizardIndex = 0;

function simpleOption(zh, en = zh, group = '') {
  return { zh, en, group };
}


const UI_TRANSLATIONS = {
  zh: {
    enterDesigner: '進入設友', enterSensual: '進入色友', generator: '提示詞生成', library: '儲存紀錄',
    textMode: '文生圖提示詞', videoMode: '圖轉影提示詞', simpleLove: '簡單愛', complexLove: '複雜愛',
    rewrite: '轉譯提示詞', makeVideo: '產生圖轉影提示詞', langStatus: '介面語言已切換為中文。'
  },
  en: {
    enterDesigner: 'Designer', enterSensual: 'Sensual', generator: 'Generator', library: 'Library',
    textMode: 'Text prompt', videoMode: 'Image to video', simpleLove: 'Simple Love', complexLove: 'Complex Love',
    rewrite: 'Rewrite', makeVideo: 'Make video prompt', langStatus: 'Interface language switched to English.'
  },
  hk: {
    enterDesigner: '入設友', enterSensual: '入色友', generator: '提示詞工房', library: '收藏紀錄',
    textMode: '文生圖提示詞', videoMode: '圖轉片提示詞', simpleLove: '簡單愛', complexLove: '複雜愛',
    rewrite: '轉提示詞', makeVideo: '生成圖轉片提示詞', langStatus: '介面語言已切換成港語。'
  },
  ja: {
    enterDesigner: '設友へ', enterSensual: '色友へ', generator: 'プロンプト生成', library: '保存履歴',
    textMode: '画像プロンプト', videoMode: '画像から動画', simpleLove: 'シンプル愛', complexLove: '複雑愛',
    rewrite: '変換', makeVideo: '動画プロンプト生成', langStatus: 'UI言語を日本語に切り替えました。'
  }
};

function setInterfaceLanguage(language) {
  const dictionary = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.zh;
  document.documentElement.lang = language === 'ja' ? 'ja' : language === 'en' ? 'en' : 'zh-Hant';
  localStorage.setItem('niaiLanguage', language);

  for (const element of document.querySelectorAll('[data-i18n]')) {
    const key = element.dataset.i18n;
    if (dictionary[key]) element.textContent = dictionary[key];
  }

  for (const button of languageButtons) {
    const active = button.dataset.languageChoice === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }

  if (authStatus) setStatus(authStatus, dictionary.langStatus);
}

const SPONSOR_AGE_OPTIONS = ['18-20', '21-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'].map((value) => simpleOption(value, value));
const SPONSOR_IDENTITY_OPTIONS = [
  '學生族', '新鮮人', '上班族', '主管職', '自由工作者', '創作者', '設計師', '攝影師', '美妝族', '保養族',
  '香氛控', '穿搭控', '健身族', '瑜伽族', '跑步族', '戶外族', '露營族', '旅遊族', '咖啡族', '甜點族',
  '料理族', '居家族', '租屋族', '新婚族', '親子族', '寵物族', '玩家族', '動漫族', '收藏族', '科技族',
  '商務族', '理財族', '學習族', '語言族', '音樂族', '電影族', '書迷族', '藝術族', '手作族', '文具族',
  '永續族', '公益族', '活動策展', '品牌主理人', '小店店主', '銀髮族', '高端客', '節慶送禮', '約會族', '夜生活族'
].map((zh) => simpleOption(zh, zh));
const SPONSOR_GOAL_OPTIONS = [
  ['認識品牌', 'brand awareness', '認知'], ['記住品名', 'name recall', '認知'], ['理解賣點', 'benefit understanding', '認知'], ['建立好感', 'positive brand affinity', '認知'], ['提升信任', 'trust building', '認知'],
  ['促成點擊', 'click-through intent', '互動'], ['引導收藏', 'save or bookmark intent', '互動'], ['鼓勵分享', 'share intent', '互動'], ['帶動留言', 'comment engagement', '互動'], ['增加追蹤', 'follow intent', '互動'],
  ['預約諮詢', 'consultation booking', '名單'], ['加入名單', 'lead capture', '名單'], ['下載試用', 'trial download', '名單'], ['領取優惠', 'coupon claim', '名單'], ['到店體驗', 'store visit', '名單'],
  ['活動報名', 'event signup', '轉換'], ['新品預購', 'preorder intent', '轉換'], ['完成購買', 'purchase conversion', '轉換'], ['會員註冊', 'membership signup', '轉換'], ['口碑擴散', 'word-of-mouth lift', '轉換']
].map(([zh, en, group]) => simpleOption(zh, en, group));
const SPONSOR_ITEM_TYPE_OPTIONS = [simpleOption('小物品', 'small item'), simpleOption('大物品', 'large item'), simpleOption('活動', 'event or campaign'), simpleOption('服務', 'service'), simpleOption('品牌概念', 'brand concept')];
const SPONSOR_TIMING_OPTIONS = [
  ['開場 0-1 秒', 'opening 0-1s'], ['前段 1-3 秒', 'early 1-3s'], ['中段 3-5 秒', 'middle 3-5s'], ['轉場瞬間', 'transition moment'], ['結尾 1 秒', 'final 1s'], ['全程自然露出', 'continuous subtle presence']
].map(([zh, en]) => simpleOption(zh, en));
const SPONSOR_FORM_OPTIONS = [
  ['展示', 'showcase'], ['操作', 'hands-on operation'], ['互動', 'interaction with the item'], ['介紹', 'spoken or visual introduction'], ['背景植入', 'background placement'], ['特寫', 'close-up reveal'], ['字幕口播', 'caption or voiceover mention'], ['前後對比', 'before-and-after comparison']
].map(([zh, en]) => simpleOption(zh, en));

const SIMPLE_DAILY_SCENE_OPTIONS = [
  simpleOption('高樓公寓客廳', 'high-rise apartment living room'),
  simpleOption('城市夜景陽台', 'city-view balcony'),
  simpleOption('古典圖書館角落', 'classic library corner'),
  simpleOption('夜晚雨窗咖啡館', 'night cafe beside a rainy window'),
  simpleOption('柔粉色甜點店包廂', 'soft-pink dessert shop booth'),
  simpleOption('歐式陽光溫室', 'European sunroom'),
  simpleOption('海景露台躺椅區', 'ocean-view terrace lounge'),
  simpleOption('私人泳池旁', 'private poolside'),
  simpleOption('熱帶度假別墅', 'tropical resort villa'),
  simpleOption('山景度假木屋', 'mountain-view vacation cabin'),
  simpleOption('空中花園休息室', 'sky-garden lounge'),
  simpleOption('海邊玻璃屋', 'seaside glass house'),
  simpleOption('私人花園玻璃亭', 'private garden glass pavilion'),
  simpleOption('星夜花園涼亭', 'starlit garden pavilion'),
  simpleOption('午夜城市天橋', 'midnight city skybridge')
];

const WIZARD_PAGES = [
  { step: 'visual', title: '基本畫面 1：光與鏡位', complexity: 'complex', controls: ['lighting', 'camera'] },
  { step: 'visual', title: '基本畫面 2：構圖與畫風', complexity: 'complex', controls: ['composition', 'artStyle'] },
  { step: 'character', title: '角色 1：人物基本', complexity: 'simple', controls: ['gender', 'race', 'emotion'] },
  { step: 'character', title: '角色 2：時間年齡職業', complexity: 'simple', controls: ['timePoint', 'ageBracket', 'occupation'] },
  { step: 'character', title: '角色 3：身形臉蛋人數', complexity: 'simple', controls: ['bodyProportion', 'face', 'count'] },
  { step: 'character', title: '角色 4：服裝外觀', complexity: 'simple', controls: ['outfit', 'outfitColor', 'outfitMaterial'] },
  { step: 'character', title: '角色 5：細節補充', complexity: 'simple', controls: ['bodyFeature', 'outfitIntegrity'] },
  { step: 'character', title: '角色 6：多人細節', complexity: 'simple', controls: ['characterControls'] },
  { step: 'scene', title: '日常場景', complexity: 'simple', controls: ['scene', 'pet'] },
  { step: 'scene', title: '場景 1：地點道具寵物', complexity: 'complex', controls: ['scene', 'accessory', 'pet'] },
  { step: 'scene', title: '場景 2：動作姿態', complexity: 'complex', controls: ['actionMode', 'actionDetail'] },
  { step: 'dialogue', title: '對話：客製化對話感', complexity: 'complex', controls: ['dialogueMode', 'dialogueToCamera', 'dialogueBetweenCharacters'] },
  { step: 'sponsor', title: '業配 1：內容置入', complexity: 'complex', controls: ['sponsorImageInput', 'sponsorText'] },
  { step: 'sponsor', title: '業配 2：受眾目標', complexity: 'complex', controls: ['sponsorAudienceAge', 'sponsorAudienceIdentity', 'sponsorGoal'] },
  { step: 'sponsor', title: '業配 3：露出規劃', complexity: 'complex', controls: ['sponsorItemType', 'sponsorExposureTiming', 'sponsorExposureForm'] },
  { step: 'sensual', title: '色友 1：氛圍服裝地點', complexity: 'complex', controls: ['intensity', 'sensualOutfit', 'sensualScene'] },
  { step: 'sensual', title: '色友 2：道具與動作', complexity: 'complex', controls: ['sensualAccessory', 'sensualActionMode', 'sensualActionDetail'] }
];

const WIZARD_CONTROL_IDS = Array.from(new Set(WIZARD_PAGES.flatMap((page) => page.controls)));

function setStatus(element, message, state = 'idle') {
  element.textContent = message;
  element.dataset.state = state;
}

function getAvailableWizardPages() {
  return WIZARD_PAGES.map((page) => {
    const controls = page.controls.filter((id) => {
      if (activeInputComplexity === 'simple' && page.complexity === 'complex') return false;
      if (page.step === 'sensual' && activeAudienceMode !== 'sensual') return false;
      if (id === 'outfitIntegrity' && activeAudienceMode !== 'sensual') return false;
      if (id === 'characterControls' && getVisibleCharacterCount() === 1) return false;
      if (id === 'dialogueBetweenCharacters' && getVisibleCharacterCount() === 1) return false;
      return true;
    });
    return { ...page, controls };
  }).filter((page) => page.controls.length > 0);
}

function renderWizardPage() {
  const pages = getAvailableWizardPages();
  currentWizardIndex = Math.min(Math.max(currentWizardIndex, 0), pages.length - 1);
  const page = pages[currentWizardIndex] || pages[0];
  if (!page) return;

  for (const button of textStepButtons) {
    const isActive = button.dataset.textStep === page.step;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  }

  for (const panel of textStepPanels) {
    panel.hidden = panel.dataset.textStepPanel !== page.step;
  }

  for (const id of WIZARD_CONTROL_IDS) {
    setFieldVisibilityByControlId(id, page.controls.includes(id));
  }

  updateAdultOnlyControls();
  updateDialogueVisibility();
  wizardProgress.textContent = `${page.title}｜${currentWizardIndex + 1}/${pages.length}｜本步 ${page.controls.length} 項`;
  wizardPrevButton.disabled = currentWizardIndex === 0;
  wizardNextButton.disabled = currentWizardIndex === pages.length - 1;
}

function setWizardIndex(index) {
  currentWizardIndex = index;
  renderWizardPage();
}

function setTextStep(stepName) {
  if (activeInputComplexity === 'simple' && ['visual', 'dialogue', 'sponsor', 'sensual'].includes(stepName)) {
    stepName = 'character';
  }
  if (stepName === 'sensual' && activeAudienceMode !== 'sensual') {
    stepName = 'visual';
  }
  const pages = getAvailableWizardPages();
  const targetIndex = pages.findIndex((page) => page.step === stepName);
  setWizardIndex(targetIndex >= 0 ? targetIndex : 0);
}

function updateDialogueVisibility() {
  const mode = dialogueMode.value;
  const showCamera = ['to-camera', 'both'].includes(mode);
  const showBetween = getVisibleCharacterCount() > 1 && ['between-characters', 'both'].includes(mode);
  setFieldVisibilityByControlId('dialogueToCamera', showCamera);
  setFieldVisibilityByControlId('dialogueBetweenCharacters', showBetween);
}

function setInputComplexity(mode) {
  activeInputComplexity = mode === 'complex' ? 'complex' : 'simple';
  for (const button of inputComplexityButtons) {
    const active = button.dataset.inputComplexity === activeInputComplexity;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  for (const element of complexOnlyElements) {
    element.hidden = activeInputComplexity === 'simple';
  }
  populateSceneOptions();
  renderWizardPage();
}

function populateSceneOptions() {
  const previousScene = scene.value;
  const sceneOptions = activeInputComplexity === 'simple' ? SIMPLE_DAILY_SCENE_OPTIONS : getDesignerOptions(CUSTOMIZATION_OPTIONS.scenes);
  populateSelect(scene, sceneOptions);
  if (sceneOptions.some((option) => option.zh === previousScene)) {
    scene.value = previousScene;
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
  const targetMap = { basics: 2, outfit: 5, multi: 7 };
  setSubstep(characterSubstepButtons, stepName, 'characterSubstep');
  setTextStep('character');
  const pages = getAvailableWizardPages();
  const titleNeedle = targetMap[stepName] === 5 ? '服裝外觀' : targetMap[stepName] === 7 ? '多人細節' : '人物基本';
  const index = pages.findIndex((page) => page.step === 'character' && page.title.includes(titleNeedle));
  if (index >= 0) setWizardIndex(index);
}


function setSceneSubstep(stepName) {
  setSubstep(sceneSubstepButtons, stepName, 'sceneSubstep');
  const pages = getAvailableWizardPages();
  const titleNeedle = stepName === 'motion' ? '動作姿態' : '地點道具';
  const index = pages.findIndex((page) => page.step === 'scene' && page.title.includes(titleNeedle));
  if (index >= 0) setWizardIndex(index);
}


function updateAdultOnlyControls() {
  const showAdultOnly = activeAudienceMode === 'sensual';

  if (!showAdultOnly) {
    for (const element of adultOnlyControls) {
      element.hidden = true;
    }
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
  if (gmail) {
    if (landingPage) landingPage.hidden = true;
    if (appShell) appShell.hidden = false;
    authStatus.textContent = mode === 'sensual'
      ? `已用 ${gmail} 進入色友；本次操作維持成人向模式。`
      : `已用 ${gmail} 進入設友；本次操作維持一般設計模式。`;
    if (authPanel) {
      authPanel.classList.add('is-locked');
    }
    designerLoginButton.disabled = true;
    sensualLoginButton.disabled = true;
    gmailInput.disabled = true;
    sensualConfirm.disabled = true;
  } else {
    if (landingPage) landingPage.hidden = false;
    if (appShell) appShell.hidden = true;
    authStatus.textContent = '尚未進入；請先選擇本次使用身份。';
  }
  setupCustomizationControls();
  renderWizardPage();
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
    const sponsorSummary = document.createElement('p');
    sponsorSummary.className = 'status';
    sponsorSummary.textContent = item.sponsorSettings?.text || item.sponsorSettings?.imageName
      ? `業配：${item.sponsorSettings.text || item.sponsorSettings.imageName}｜${item.sponsorSettings.audienceAgeZh}｜${item.sponsorSettings.audienceIdentityZh}｜${item.sponsorSettings.goalZh}`
      : '未設定業配。';

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
      sponsorSummary,
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
    sponsorSettings: getSponsorSettings(),
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

  const optionParents = new Map();

  for (const optionText of options) {
    const group = typeof optionText === 'string' ? '' : optionText.group || '';
    let parent = fragment;

    if (group) {
      if (!optionParents.has(group)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group;
        optionParents.set(group, optgroup);
        fragment.append(optgroup);
      }
      parent = optionParents.get(group);
    }

    const option = document.createElement('option');
    const value = typeof optionText === 'string' ? optionText : optionText.zh;
    option.value = value;
    option.textContent = getOptionLabel(optionText);
    parent.append(option);
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
  populateSelect(pet, CUSTOMIZATION_OPTIONS.pets);
  populateSelect(accessory, getDesignerOptions(CUSTOMIZATION_OPTIONS.accessories));
  populateSceneOptions();
  populateSelect(actionMode, ACTION_MODE_OPTIONS);
  populateSelect(sensualOutfit, getSensualOnlyOptions(CUSTOMIZATION_OPTIONS.outfits));
  populateSelect(sensualScene, getSensualOnlyOptions(CUSTOMIZATION_OPTIONS.scenes));
  populateSelect(sensualAccessory, getSensualOnlyOptions(CUSTOMIZATION_OPTIONS.accessories));
  populateSelect(sensualActionMode, ACTION_MODE_OPTIONS);
  populateSelect(sponsorAudienceAge, SPONSOR_AGE_OPTIONS);
  populateSelect(sponsorAudienceIdentity, SPONSOR_IDENTITY_OPTIONS);
  populateSelect(sponsorGoal, SPONSOR_GOAL_OPTIONS);
  populateSelect(sponsorItemType, SPONSOR_ITEM_TYPE_OPTIONS);
  populateSelect(sponsorExposureTiming, SPONSOR_TIMING_OPTIONS);
  populateSelect(sponsorExposureForm, SPONSOR_FORM_OPTIONS);
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

function extractPromptValue(prompt, label) {
  const escaped = label.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&');
  const match = prompt.match(new RegExp(`${escaped}:\\s*([^,]+)`, 'i'));
  return match?.[1]?.trim() || '';
}

function buildPromptThreadInsights(textPrompt) {
  const base = textPrompt.replace(/\s+/g, ' ').trim();
  return {
    base,
    subject: extractPromptValue(base, 'subject/action') || 'the established subject',
    scene: extractPromptValue(base, 'scene') || 'the established scene',
    pet: extractPromptValue(base, 'pet/companion'),
    count: extractPromptValue(base, 'character count'),
    style: extractPromptValue(base, 'art style'),
    action: extractPromptValue(base, 'action/posture detail'),
    sponsor: extractPromptValue(base, 'sponsored content'),
    dialogue: /dialogue settings:/i.test(base)
  };
}

function buildAutoVideoChoices(textPrompt) {
  const thread = buildPromptThreadInsights(textPrompt);
  const dialogue = getDialogueForVideo();
  const petZh = thread.pet ? `；寵物陪伴：${thread.pet}` : '';
  const sponsorZh = thread.sponsor ? `；業配露出：${thread.sponsor}` : '';
  const styleZh = thread.style ? `；保留畫風：${thread.style}` : '';
  const dialogueZh = dialogue.zh ? `；對話：${dialogue.zh}` : thread.dialogue ? '；沿用提示詞串內的對話設定' : '';
  const threadSummaryZh = `提示詞串解析：主體 ${thread.subject}；場景 ${thread.scene}${petZh}${sponsorZh}${styleZh}${dialogueZh}`;
  const threadSummaryEn = `prompt-thread analysis: subject ${thread.subject}; scene ${thread.scene}${thread.pet ? `; pet/companion ${thread.pet}` : ''}${thread.sponsor ? `; sponsored content ${thread.sponsor}` : ''}${thread.style ? `; art style ${thread.style}` : ''}${thread.dialogue ? '; use existing dialogue settings' : ''}`;
  const designerVariants = [
    ['AI 1｜主體故事微動', `依主體與場景安排自然反應，不新增情慾化肢體；${thread.scene} 的空間感要被看見。`, `story-aware general-audience motion for ${thread.subject} inside ${thread.scene}, natural reactions only, no romanticized body emphasis`],
    ['AI 2｜場景互動', `讓角色與 ${thread.scene} 產生合理互動，例如視線、手部整理、走位或道具使用。`, `scene interaction based on ${thread.scene}: gaze shift, practical hand movement, small blocking adjustment, or prop use`],
    ['AI 3｜造型材質', `讀取服裝、配件、畫風與寵物設定，讓髮絲、布料、物件或寵物做安全微動。`, `animate styling details from the prompt thread: hair, fabric, props${thread.pet ? `, and ${thread.pet}` : ''}, with safe subtle motion`],
    ['AI 4｜業配／對話節奏', `若有業配或對話，依提示詞串安排露出與口型節奏，不搶走主題。`, `if the thread includes sponsored content or dialogue, time the reveal and lip-sync naturally without overpowering the main subject`],
    ['AI 5｜循環短片腳本', `依提示詞串建立開場、中段、結尾三段式循環，不只做單純推近。`, `create a three-beat loop from the prompt thread: opening context, middle interaction, closing hold; do not rely on a generic push-in`]
  ];
  const sensualVariants = [
    ['AI 1｜成人氛圍呼吸', `依角色、服裝與場景維持合意成人氛圍，動態以呼吸、眼神與布料微動為主。`, `adult-consenting mood based on the established subject, outfit, and scene; use breathing, gaze, and fabric micro-motion without explicit acts`],
    ['AI 2｜曖昧互動節奏', `讀取角色數與對話設定，安排靠近、停頓、眼神交換與反應節奏，避免露骨行為。`, `use character count and dialogue settings for approach, pause, gaze exchange, and reactions, avoiding explicit sexual action`],
    ['AI 3｜身形與造型張力', `保留提示詞串的服裝完整度、身形與畫風，只加入安全的姿態重心變化。`, `preserve outfit integrity, body styling, and art style from the prompt thread; add safe weight-shift posture motion only`],
    ['AI 4｜業配自然露出', `若有業配，讓露出時刻融入曖昧場景，不破壞合意成人安全邊界。`, `if sponsored content exists, integrate its reveal into the adult mood while preserving consent and safety boundaries`],
    ['AI 5｜成人向循環腳本', `依提示詞串分成開場凝視、中段互動、結尾停格三段，保留藝術遮擋。`, `build a three-beat adult-only loop from the prompt thread: opening gaze, middle interaction, closing hold, preserving tasteful coverage`]
  ];
  const variants = activeAudienceMode === 'sensual' ? sensualVariants : designerVariants;
  const safety = activeAudienceMode === 'sensual'
    ? 'sensual-mode safety: all characters are clearly 18+ consenting adults, no coercion, no minors, no voyeur framing, no explicit sex-act animation, no new explicit nudity beyond the source frame'
    : 'designer-mode safety: general-audience motion only, no sensual framing, no lingerie emphasis, no erotic gaze direction, no identity change, no abrupt morphing, no graphic violence';

  return variants.map(([label, zh, motion], index) => ({
    label,
    zh: `中文說明：${threadSummaryZh}；建議：${zh}${dialogue.zh ? `；對話：${dialogue.zh}` : ''}`,
    prompt: `image-to-video prompt option ${index + 1}, ${threadSummaryEn}, use this generated prompt thread as the source plan: ${thread.base}, motion plan: ${motion}, ${dialogue.en || 'use dialogue only if already present in the prompt thread'}, duration: 5 seconds, motion strength: medium, preserve subject identity, outfit, pet or prop continuity, scene logic, composition, and art style, ${safety}`
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
setInterfaceLanguage(localStorage.getItem('niaiLanguage') || 'zh');
setInputComplexity('simple');
setWizardIndex(0);
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

wizardPrevButton.addEventListener('click', () => setWizardIndex(currentWizardIndex - 1));
wizardNextButton.addEventListener('click', () => setWizardIndex(currentWizardIndex + 1));

for (const button of themeButtons) {
  button.addEventListener('click', () => {
    document.body.dataset.theme = button.dataset.themeChoice;
    for (const candidate of themeButtons) candidate.classList.toggle('active', candidate === button);
  });
}

for (const button of languageButtons) {
  button.addEventListener('click', () => setInterfaceLanguage(button.dataset.languageChoice));
}

for (const button of inputComplexityButtons) {
  button.addEventListener('click', () => setInputComplexity(button.dataset.inputComplexity));
}

deepfaceButton.addEventListener('click', () => {
  deepfaceEnabled = !deepfaceEnabled;
  deepfaceButton.classList.toggle('active', deepfaceEnabled);
  deepfaceButton.setAttribute('aria-pressed', String(deepfaceEnabled));
});

dialogueMode.addEventListener('change', updateDialogueVisibility);

function getCurrentGmail() {
  return gmailInput.value.trim() || localStorage.getItem('niaiGmail') || '';
}

designerLoginButton.addEventListener('click', () => {
  const gmail = getCurrentGmail();
  if (!/@gmail\.com$/i.test(gmail)) {
    setStatus(authStatus, '請輸入 Gmail；入口選定後本次操作不再切換身份。', 'error');
    return;
  }
  sensualConfirm.checked = false;
  updateAudienceMode('designer', gmail);
});

sensualLoginButton.addEventListener('click', () => {
  const gmail = getCurrentGmail();
  if (!/@gmail\.com$/i.test(gmail)) {
    setStatus(authStatus, '請輸入 Gmail；入口選定後本次操作不再切換身份。', 'error');
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
  updateDialogueVisibility();
  renderWizardPage();
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

sponsorImageInput.addEventListener('change', () => {
  const [file] = sponsorImageInput.files;
  sponsorImageName = file?.name || '';
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
    setStatus(imageVideoStatus, activeAudienceMode === 'sensual'
      ? `已讀取圖片，初步成人向強度約 ${roughScore}/10；可補充描述或希望動態後產生提示詞。`
      : '已讀取圖片；可補充描述、動態或對話後產生 3-5 個一般圖轉影建議。', 'success');
  } catch (error) {
    setStatus(imageVideoStatus, error.message, 'error');
  }
});

function getOptionObject(options, value) {
  return options.find((item) => item.zh === value || item.en === value) || { zh: value || 'AI判斷', en: value || 'AI decides' };
}

function getSponsorSettings() {
  const age = getOptionObject(SPONSOR_AGE_OPTIONS, sponsorAudienceAge.value);
  const identity = getOptionObject(SPONSOR_IDENTITY_OPTIONS, sponsorAudienceIdentity.value);
  const goal = getOptionObject(SPONSOR_GOAL_OPTIONS, sponsorGoal.value);
  const itemType = getOptionObject(SPONSOR_ITEM_TYPE_OPTIONS, sponsorItemType.value);
  const timing = getOptionObject(SPONSOR_TIMING_OPTIONS, sponsorExposureTiming.value);
  const form = getOptionObject(SPONSOR_FORM_OPTIONS, sponsorExposureForm.value);
  return {
    text: sponsorText.value.trim(),
    imageName: sponsorImageName,
    audienceAgeZh: age.zh,
    audienceAgeEn: age.en,
    audienceIdentityZh: identity.zh,
    audienceIdentityEn: identity.en,
    goalZh: goal.group && goal.zh !== 'AI判斷' ? `${goal.group}／${goal.zh}` : goal.zh,
    goalEn: goal.group && goal.en !== 'AI decides' ? `${goal.group} ${goal.en}` : goal.en,
    itemTypeZh: itemType.zh,
    itemTypeEn: itemType.en,
    timingZh: timing.zh,
    timingEn: timing.en,
    formZh: form.zh,
    formEn: form.en
  };
}

function getSensualOverride(generalValue, sensualValue) {
  if (activeAudienceMode !== 'sensual') {
    return generalValue;
  }

  return sensualValue && sensualValue !== 'AI判斷' ? sensualValue : generalValue;
}

rewriteButton.addEventListener('click', () => {
  const result = rewritePrompt(getTextRewriteSource(), {
    audienceMode: activeAudienceMode,
    inputMode: activeInputComplexity,
    deepfaceEnabled,
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
    pet: pet.value,
    scene: getSensualOverride(scene.value, sensualScene.value),
    actionMode: activeInputComplexity === 'complex' ? getSensualOverride(actionMode.value, sensualActionMode.value) : 'AI判斷',
    actionDetail: activeInputComplexity === 'complex' ? getSensualOverride(actionDetail.value, sensualActionDetail.value) : 'AI判斷',
    dialogueMode: dialogueMode.value,
    dialogueToCamera: dialogueToCamera.value,
    dialogueBetweenCharacters: dialogueBetweenCharacters.value,
    sponsorSettings: activeInputComplexity === 'complex' ? getSponsorSettings() : {}
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
    dialogueBetweenCharacters: dialogueBetweenCharacters.value,
    promptThread: textResultPrompt.value || autoVideoPrompt.value,
    sponsorSettings: getSponsorSettings()
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

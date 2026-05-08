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
const hairFurColor = document.querySelector('#hairFurColor');
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
const gazeDirection = document.querySelector('#gazeDirection');
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
const aiSuggestionToggle = document.querySelector('#aiSuggestionToggle');
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
const outputSavePromptButton = document.querySelector('#outputSavePromptButton');
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
const backToLoginButton = document.querySelector('#backToLoginButton');
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
const publishMomentButton = document.querySelector('#publishMomentButton');
const matchmakingTitleText = document.querySelector('#matchmakingTitleText');
const matchmakingStatus = document.querySelector('#matchmakingStatus');
const heartGender = document.querySelector('#heartGender');
const heartAge = document.querySelector('#heartAge');
const heartNature = document.querySelector('#heartNature');
const showHeartCardsButton = document.querySelector('#showHeartCardsButton');
const heartCardList = document.querySelector('#heartCardList');
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
const withMeButton = document.querySelector('#withMeButton');

let uploadedImageAnalysis = null;
let lastImageVideoResult = null;
let activeAudienceMode = localStorage.getItem('niaiAudienceMode') || 'designer';
let activeInputComplexity = 'simple';
let deepfaceEnabled = false;
let withMeEnabled = false;
let activeSavedPromptId = null;
let sponsorImageName = '';
let activeInterfaceLanguage = localStorage.getItem('niaiLanguage') || 'zh';

let currentWizardIndex = 0;

function simpleOption(zh, en = zh, group = '') {
  return { zh, en, group };
}


const UI_TRANSLATIONS = {
  zh: {
    enterDesigner: '進入設友', enterSensual: '進入色友', generator: '提示詞生成', library: '悸動瞬間', matchmaking: '配對所',
    textMode: '文生圖提示詞', videoMode: '圖轉影提示詞', simpleLove: '簡單愛', complexLove: '複雜愛',
    rewrite: '轉譯提示詞', makeVideo: '產生圖轉影提示詞', langStatus: '介面語言已切換為中文。'
  },
  en: {
    enterDesigner: 'Designer', enterSensual: 'Sensual', generator: 'Generator', library: 'Heartbeat Moments', matchmaking: 'Matchmaking',
    textMode: 'Text prompt', videoMode: 'Image to video', simpleLove: 'Simple Love', complexLove: 'Complex Love',
    rewrite: 'Rewrite', makeVideo: 'Make video prompt', langStatus: 'Interface language switched to English.'
  },
  hk: {
    enterDesigner: '入設友', enterSensual: '入色友', generator: '提示詞工房', library: '悸動瞬間', matchmaking: '配對所',
    textMode: '文生圖提示詞', videoMode: '圖轉片提示詞', simpleLove: '簡單愛', complexLove: '複雜愛',
    rewrite: '轉提示詞', makeVideo: '生成圖轉片提示詞', langStatus: '介面語言已切換成粵語。'
  },
  ja: {
    enterDesigner: '設友へ', enterSensual: '色友へ', generator: 'プロンプト生成', library: 'ときめき瞬間', matchmaking: 'マッチング所',
    textMode: '画像プロンプト', videoMode: '画像から動画', simpleLove: 'シンプル愛', complexLove: '複雑愛',
    rewrite: '変換', makeVideo: '動画プロンプト生成', langStatus: 'UI言語を日本語に切り替えました。'
  }
};


const STATIC_UI_TEXT = {
  en: {
    '擬愛 NIAI': 'NIAI Prompt Atelier',
    '4種設計配色/字體/排版呈現有粉白混搭的 清純戀愛或是霧藍漸層的 神秘曖昧或是暖黃溫潤的 陽光熱戀又或者是黑紅混搭的 禁忌戀情': 'Four unified visual themes: pure pink-and-white romance, misty blue ambiguity, warm sunny passion, or black-and-red forbidden love.',
    '清純戀愛': 'Pure Romance', '神秘曖昧': 'Misty Flirt', '陽光熱戀': 'Sunny Passion', '禁忌戀情': 'Forbidden Love',
    '選擇功能身份': 'Choose a role', '入口先選設友或色友；進入後 APP 只保留該模式，避免操作過程混淆。': 'Choose Designer or Sensual first; the app keeps that mode for this session to avoid confusion.',
    '我確認以成年人合意創作使用色友模式': 'I confirm Sensual mode is for consenting adult creation.', '尚未進入；請先選擇本次使用身份。': 'Not entered yet; choose a role first.', '回登入頁': 'Back to login',
    '只要輸入角色、人設或作品風格即可，中文也可以；英文可複製提示詞會自動轉成安全的英文描述。': 'Optionally enter a character, persona, or style in Chinese or English; the copyable prompt will be rewritten safely in English.',
    'Cosplay（主要輸入：角色／人設／作品風格）': 'Cosplay (optional character / persona / style)',
    'Cosplay 也是非必填；如果沒有輸入，系統會用 AI 判定建立成人角色方向。其他配置分頁全部可跳過，沒填就維持 AI 判定。不要填未成年、偷拍、強迫或血腥內容。': 'Cosplay is optional too. If blank, AI will establish an adult character direction. Later setup pages can also be skipped and left to AI. Do not enter minor, voyeuristic, coercive, or graphic content.',
    'AI建議': 'AI suggestion', '可自選是否讓 AI 判定適合的服裝、地點、光感、動作、構圖與視角；新手建議先開啟。': 'Choose whether AI should decide outfit, place, lighting, action, composition, and viewpoint; beginners should keep this on.',
    '1 人物指標': '1 Character', '2 服裝配件': '2 Outfit', '3 動作眼神': '3 Action', '4 場景光感': '4 Scene', '5 構圖視角': '5 Framing', '6 商用': '6 Commercial', '7 色友': '7 Sensual',
    '構圖與視角': 'Composition and viewpoint', '最後確認構圖、視角與畫風；若開啟 AI建議，這些欄位可交給 AI 判定。': 'Finalize composition, viewpoint, and art style; with AI suggestion on, these can be AI-decided.',
    '光感描述（50 種）': 'Lighting description (50)', '鏡位視角（50 種）': 'Camera viewpoint (50)', '構圖結構（20 種）': 'Composition structure (20)', '畫風（100 種）': 'Art style (100)',
    '人物指標': 'Character indicators', '先輸入人物種族、年齡、性別，再補特徵與毛色；後續服裝、地點、光感、動作、構圖與視角可交給 AI建議。': 'Start with race, adult age, and gender, then add features and hair/fur color; later styling can stay AI-suggested.',
    '人物基本': 'Basics', '服裝外觀': 'Outfit', '多人細節': 'Multi-character', '性別': 'Gender', '種族（100 種，後 50 非自然）': 'Race (100; last 50 non-natural)', '情緒（50 種）': 'Emotion (50)', '時間點／光色質感（20 種）': 'Time / light / texture (20)', '年齡級距（5 歲級距至 60）': 'Adult age bracket (5-year steps to 60)', '只提供成年級距，避免未成年內容。': 'Only adult brackets are available to avoid underage content.',
    '職業（50 種）': 'Occupation (50)', '身材比例（50 種）': 'Body proportion (50)', '臉蛋': 'Face', '服裝穿搭（男200／女200）': 'Outfit (male 200 / female 200)', '服裝顏色（50 種）': 'Outfit color (50)', '服裝材質（50 種）': 'Outfit material (50)', '配件與道具（150 種）': 'Accessories and props (150)', '特徵': 'Feature', '毛色／髮色': 'Fur / hair color', '服裝完整度': 'Outfit integrity', '人數': 'Character count',
    '種族': 'Race', '情緒': 'Emotion', '職業': 'Occupation', '年齡': 'Age', '身材比例': 'Body proportion', '服裝': 'Outfit', '服裝顏色': 'Outfit color', '服裝材質': 'Outfit material', '身上特徵': 'Body feature',
    '動作、眼神與場景': 'Action, gaze, and scene', '依序整理動作配置、眼神位置、場景與光感；新手可開啟 AI建議讓系統判定。': 'Set action, gaze, scene, and lighting in order; beginners can let AI decide.', '地點道具': 'Place / props', '動作姿態': 'Action / pose',
    '場景配置（100 日常／100 祕境）': 'Scene setup (100 daily / 100 mysterious)', '動作／姿態類型（4 類）': 'Action / pose type (4)', '肩膀以上、手部動作、下半身屬於動作；不同姿態屬於姿態。': 'Above-shoulder, hand, and lower-body movement are actions; alternate stance is pose.', '動作或姿態細項': 'Action or pose detail', '動作和姿態共用這一欄：選「不同姿態」就是姿態，選其他三類就是動作，不會再同時輸出兩組互相打架的 action + pose。': 'Action and pose share this field, preventing conflicting action + pose output.', '眼神位置': 'Gaze direction',
    '商用加選': 'Commercial extras', '寵物、置入、對話、DeepFace 等非必要或商用語言集中在這裡；需要時再打開設定。': 'Optional pets, placements, dialogue, and DeepFace controls live here; open only when needed.', '寵物': 'Pet', '非必要項目，可選「無」。': 'Optional; choose None if unused.', '對話方式': 'Dialogue mode', '對鏡頭說': 'Dialogue to camera', '角色間對話': 'Dialogue between characters', '兩人以上才啟用；提示詞會標明角色1、角色2與位置。': 'Enabled for two or more characters; prompts label each character and position.', '套用參考照的人物辨識特徵。': 'Apply identity cues from a reference photo.', '提示詞會預留你上傳自己的照片，與角色依服裝、動作、畫風合成。': 'Reserve a place for your own photo to be composited with the character by outfit, action, and style.', '業配圖片': 'Sponsor image', '業配文字': 'Sponsor text', '受眾年齡': 'Audience age', '受眾身分': 'Audience identity', '目標成果': 'Goal', '依屬性分組，選項保持短字句。': 'Grouped by attribute; options stay short.', '置入類型': 'Placement type', '露出時刻': 'Exposure timing', '只寫入圖轉影，用來排時間點。': 'Used only in image-to-video timing.', '露出形式': 'Exposure form',
    '色友專區': 'Sensual area', '僅色友模式顯示；成人向服裝、地點、道具與動作全部集中在此區，設友介面不顯示這些內容。': 'Only shown in Sensual mode; adult-oriented outfit, location, prop, and action controls are centralized here.', '成人向氛圍強度': 'Adult mood intensity', '柔和、強烈會套用不同鏡頭距離、肢體語言與張力，並維持成年人合意與非露骨界線。': 'Soft and strong apply different camera distance, body language, and tension while preserving consenting-adult, non-explicit boundaries.', '成人向服裝': 'Adult outfit', '成人向地點': 'Adult location', '成人向道具': 'Adult prop', '成人向動作類型': 'Adult action type', '成人向動作細項': 'Adult action detail',
    '上一步': 'Previous', '跳過／下一步': 'Skip / next', '步驟 1': 'Step 1',
    '圖轉影提示詞建議': 'Image-to-video prompt suggestions', '上傳圖片後，瀏覽器會在本機估算成人向強度 1-10 分，並提供相鄰強度的圖轉影提示詞供挑選複製。中文提示詞只供對照詞意，英文提示詞才是可複製貼上的成果。': 'After upload, the browser estimates an adult intensity score locally and offers nearby image-to-video prompts. Localized text is for comparison; English is the copyable result.', '上傳參考圖片': 'Upload reference image', '影片秒數': 'Video duration', '動態強度': 'Motion strength', '圖片輔助描述（選填，協助判定）': 'Image helper description (optional)', '希望圖轉影怎麼動（選填）': 'Desired motion (optional)', '圖轉影建議（可挑選）': 'Image-to-video suggestion (selectable)', '尚未上傳圖片；圖片分析只在本機瀏覽器進行。': 'No image uploaded yet; image analysis stays in this browser.',
    '文生圖：中文對照＋英文可複製': 'Text-to-image: localized comparison + copyable English', '填寫 Cosplay 後可直接轉譯；其他分頁都可保持 AI 判斷。': 'Generate directly with optional Cosplay; all other pages can stay AI-decided.', '中文提示詞（對照用）': 'Localized prompt (for comparison)', '複製文生圖英文提示詞': 'Copy text-to-image English prompt', '儲存這次提示詞紀錄': 'Save this prompt record',
    'AI 判定圖轉影提示詞（5 種）': 'AI image-to-video prompts (5)', '文生圖提示詞產生後自動建立 5 種 AI 判定版本；下拉自選一種後，可直接複製英文圖轉影提示詞。': 'After text prompt generation, five AI-decided video versions are created; choose one from the dropdown and copy the English prompt.', '選擇圖轉影版本': 'Choose image-to-video version', '中文圖轉影說明（對照用）': 'Localized image-to-video note (comparison)', '複製自動圖轉影英文提示詞': 'Copy automatic image-to-video English prompt',
    '圖轉影：中文對照＋英文可複製': 'Image-to-video: localized comparison + copyable English', '等待上傳圖片並產生圖轉影提示詞。': 'Waiting for image upload and prompt generation.', '中文圖轉影提示詞（對照用）': 'Localized image-to-video prompt (comparison)', '複製圖轉影英文提示詞': 'Copy image-to-video English prompt',
    '悸動瞬間': 'Heartbeat moments', '記錄自己當次或先前正式輸出的完整提示詞，可上傳一張文轉圖縮圖；選取後可匿名上傳成配對所的心動卡，也可刪除。': 'Record the current or previous complete output. Upload a text-to-image thumbnail, then publish the selected moment as an anonymous heart card or delete it.', '悸動標題／儲存標題': 'Moment / saved title', '記錄這次悸動瞬間': 'Record this heartbeat moment', '上傳文轉圖縮圖': 'Upload text-to-image thumbnail', '匿名上傳成心動卡': 'Publish anonymously as heart card', '縮圖只會以壓縮資料保留在本機；上傳成心動卡時會保留該縮圖供配對所翻卡預覽。': 'The thumbnail is compressed locally; when published, it is retained for card preview.',
    '配對所': 'Matchmaking studio', '先輸入你想找的性質、性別與成年年齡範圍；系統會出現 3 張符合範圍的心動卡。選擇一張翻開後，可看到匿名用戶留下的完整英文設定提示詞、你的介面語言對照版，以及對方保留的文轉圖縮圖。': 'Choose desired nature, gender, and adult age range to reveal three matching heart cards. Flip one to see the anonymous complete English setting prompt, localized comparison, and thumbnail.', '今天想遇見誰？': 'Who do you want to meet today?', '所有心動卡都不具名；請先設定範圍，再翻開其中一張。': 'All heart cards are anonymous; set a range, then flip one.', '設定想遇見的對象': 'Set who you want to meet', '請先選擇性質屬於設友或色友、想遇見的性別與成年年齡級距，才會出現 3 張心動卡。': 'Choose Designer/Sensual nature, desired gender, and adult age bracket before three cards appear.', '想找的性質': 'Desired nature', '想遇見的性別': 'Desired gender', '想遇見的年齡': 'Desired age', '顯示 3 張心動卡': 'Show 3 heart cards',
    '安全邊界': 'Safety boundaries', '只允許明確成年且合意的角色與情境。': 'Only clearly adult, consenting characters and situations are allowed.', '拒絕未成年、非合意、偷拍、血腥暴力等內容。': 'Minor, non-consensual, voyeuristic, and graphic violence content is rejected.', '輸出以氛圍、構圖、姿態、光影與情緒描述為主。': 'Outputs focus on mood, composition, pose, lighting, and emotion.'
  }
};

STATIC_UI_TEXT.hk = Object.fromEntries(Object.entries(STATIC_UI_TEXT.en).map(([key, value]) => [key, value
  .replace(/Designer/g, '設友').replace(/Sensual/g, '色友').replace(/Image-to-video/g, '圖轉片').replace(/image-to-video/g, '圖轉片').replace(/prompt/g, '提示詞').replace(/Prompt/g, '提示詞').replace(/Upload/g, '上載').replace(/upload/g, '上載').replace(/Choose/g, '揀').replace(/choose/g, '揀').replace(/Copy/g, '複製').replace(/copy/g, '複製')
]));
STATIC_UI_TEXT.hk['粵語'] = '粵語';
STATIC_UI_TEXT.ja = Object.fromEntries(Object.entries(STATIC_UI_TEXT.en).map(([key, value]) => [key, value
  .replace(/Designer/g, '設友').replace(/Sensual/g, '色友').replace(/Image-to-video/g, '画像から動画').replace(/image-to-video/g, '画像から動画').replace(/Text-to-image/g, '画像生成').replace(/text-to-image/g, '画像生成').replace(/prompt/g, 'プロンプト').replace(/Prompt/g, 'プロンプト').replace(/Copy/g, 'コピー').replace(/copy/g, 'コピー').replace(/Choose/g, '選択').replace(/choose/g, '選択')
]));

function localizeUiText(text) {
  if (!text || activeInterfaceLanguage === 'zh') return text || '';
  const dictionary = STATIC_UI_TEXT[activeInterfaceLanguage] || STATIC_UI_TEXT.en;
  if (dictionary[text]) return dictionary[text];
  if (/^角色\s*\d+$/.test(text)) {
    const number = text.match(/\d+/)?.[0] || '';
    if (activeInterfaceLanguage === 'en') return `Character ${number}`;
    if (activeInterfaceLanguage === 'ja') return `キャラクター ${number}`;
    return `角色 ${number}`;
  }
  return typeof MatchmakingStudio !== 'undefined'
    ? MatchmakingStudio.localizePromptText(text, activeInterfaceLanguage).replace(/^(Localized comparison: |ローカル対照：|粵語對照：)/, '')
    : text;
}

function refreshStaticUiLanguage() {
  const selector = 'h1, h2, h3, p, label, button:not([data-i18n]), li';
  for (const element of document.querySelectorAll(selector)) {
    if (element.closest('select')) continue;
    if (!element.dataset.sourceText) element.dataset.sourceText = element.textContent.trim();
    if (element.dataset.sourceText) element.textContent = localizeUiText(element.dataset.sourceText);
  }
  for (const element of document.querySelectorAll('input[placeholder], textarea[placeholder]')) {
    if (!element.dataset.sourcePlaceholder) element.dataset.sourcePlaceholder = element.getAttribute('placeholder') || '';
    element.setAttribute('placeholder', localizeUiText(element.dataset.sourcePlaceholder));
  }
}

function setInterfaceLanguage(language) {
  activeInterfaceLanguage = typeof MatchmakingStudio !== 'undefined' ? MatchmakingStudio.normalizeLanguage(language) : language;
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

  refreshStaticUiLanguage();
  refreshSelectableLanguage();
  if (authStatus) setStatus(authStatus, dictionary.langStatus);
  refreshLocalizedPromptDisplays();
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
  { step: 'character', title: '1 人物：種族年齡性別', complexity: 'simple', controls: ['race', 'ageBracket', 'gender'] },
  { step: 'character', title: '2 特徵：特徵毛色人數', complexity: 'simple', controls: ['bodyFeature', 'hairFurColor', 'count'] },
  { step: 'outfit', title: '3 服裝：款式配色配件', complexity: 'simple', aiSuggested: true, controls: ['outfit', 'outfitColor', 'outfitMaterial', 'accessory'] },
  { step: 'motion', title: '4 動作：配置與眼神', complexity: 'complex', aiSuggested: true, controls: ['actionMode', 'actionDetail', 'gazeDirection'] },
  { step: 'scene', title: '5 場景：地點與光感', complexity: 'simple', aiSuggested: true, controls: ['scene', 'lighting'] },
  { step: 'visual', title: '6 構圖：構圖與視角', complexity: 'complex', aiSuggested: true, controls: ['composition', 'camera', 'artStyle'] },
  { step: 'character', title: '7 多人細節', complexity: 'simple', controls: ['characterControls'] },
  { step: 'commercial', title: '8 商用：寵物置入對話 DeepFace', complexity: 'complex', controls: ['pet', 'dialogueMode', 'dialogueToCamera', 'dialogueBetweenCharacters', 'sponsorImageInput', 'sponsorText', 'sponsorAudienceAge', 'sponsorAudienceIdentity', 'sponsorGoal', 'sponsorItemType', 'sponsorExposureTiming', 'sponsorExposureForm'] },
  { step: 'sensual', title: '9 色友：氛圍服裝地點', complexity: 'complex', controls: ['intensity', 'sensualOutfit', 'sensualScene'] },
  { step: 'sensual', title: '10 色友：道具與動作', complexity: 'complex', controls: ['sensualAccessory', 'sensualActionMode', 'sensualActionDetail'] }
];

const WIZARD_CONTROL_IDS = Array.from(new Set(WIZARD_PAGES.flatMap((page) => page.controls)));

function setStatus(element, message, state = 'idle') {
  element.textContent = message;
  element.dataset.state = state;
}

function getAvailableWizardPages() {
  return WIZARD_PAGES.map((page) => {
    const controls = page.controls.filter((id) => {
      if (aiSuggestionToggle?.checked && page.aiSuggested) return false;
      if (activeInputComplexity === 'simple' && ['visual', 'motion', 'commercial', 'sensual'].includes(page.step)) return false;
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
    const activePanelStep = ['outfit'].includes(page.step) ? 'character' : page.step === 'motion' ? 'scene' : page.step;
    panel.hidden = panel.dataset.textStepPanel !== activePanelStep;
  }

  for (const id of WIZARD_CONTROL_IDS) {
    setFieldVisibilityByControlId(id, page.controls.includes(id));
  }

  updateAdultOnlyControls();
  updateDialogueVisibility();
  wizardProgress.textContent = `${page.title}｜${currentWizardIndex + 1}/${pages.length}｜本步 ${page.controls.length} 項｜除 Cosplay 外可跳過＝AI 判定`;
  wizardPrevButton.disabled = currentWizardIndex === 0;
  wizardNextButton.disabled = currentWizardIndex === pages.length - 1;
}

function setWizardIndex(index) {
  currentWizardIndex = index;
  renderWizardPage();
}

function setTextStep(stepName) {
  if (activeInputComplexity === 'simple' && ['visual', 'motion', 'commercial', 'sensual'].includes(stepName)) {
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




function applyAiSuggestionState() {
  const aiSuggestedControlIds = ['outfit', 'outfitColor', 'outfitMaterial', 'accessory', 'actionMode', 'actionDetail', 'gazeDirection', 'scene', 'lighting', 'composition', 'camera', 'artStyle'];
  if (aiSuggestionToggle?.checked) {
    for (const id of aiSuggestedControlIds) {
      const element = document.querySelector(`#${id}`);
      if (element && Array.from(element.options || []).some((option) => option.value === 'AI判斷')) {
        element.value = 'AI判斷';
      }
    }
  }
  renderWizardPage();
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
  const targetMap = { basics: 0, outfit: 2, multi: 6 };
  setSubstep(characterSubstepButtons, stepName, 'characterSubstep');
  setTextStep('character');
  const pages = getAvailableWizardPages();
  const titleNeedle = stepName === 'outfit' ? '服裝' : stepName === 'multi' ? '多人' : '人物';
  const index = pages.findIndex((page) => page.title.includes(titleNeedle));
  if (index >= 0) setWizardIndex(index);
}


function setSceneSubstep(stepName) {
  setSubstep(sceneSubstepButtons, stepName, 'sceneSubstep');
  const pages = getAvailableWizardPages();
  const titleNeedle = stepName === 'motion' ? '動作' : '場景';
  const index = pages.findIndex((page) => page.title.includes(titleNeedle));
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

function showLoginPage(message = '已回到登入頁；請選擇本次使用身份。') {
  if (landingPage) landingPage.hidden = false;
  if (appShell) appShell.hidden = true;
  if (authPanel) authPanel.classList.remove('is-locked');
  designerLoginButton.disabled = false;
  sensualLoginButton.disabled = false;
  gmailInput.disabled = false;
  sensualConfirm.disabled = false;
  sensualConfirm.checked = false;
  setStatus(authStatus, message, 'success');
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

function getMomentStorageKey(suffix = '') {
  const gmail = localStorage.getItem('niaiGmail') || gmailInput?.value.trim() || 'guest';
  return `niaiMatchmaking:${gmail}${suffix ? `:${suffix}` : ''}`;
}

function getLocalHeartCardEntries() {
  try {
    const currentEntries = JSON.parse(localStorage.getItem('niaiHeartCardEntries') || '[]');
    return currentEntries;
  } catch {
    return [];
  }
}

function setLocalHeartCardEntries(entries) {
  localStorage.setItem('niaiHeartCardEntries', JSON.stringify(entries));
}

function getAllHeartCardEntries() {
  const seedEntries = typeof MatchmakingStudio !== 'undefined' ? MatchmakingStudio.SEED_ENTRIES : [];
  return [...getLocalHeartCardEntries(), ...seedEntries];
}

function renderMatchmakingProfile(message = '') {
  if (!matchmakingTitleText || !matchmakingStatus) return;
  matchmakingTitleText.textContent = activeInterfaceLanguage === 'en'
    ? 'Who do you want to meet today?'
    : activeInterfaceLanguage === 'ja'
      ? '今日は誰に出会いたい？'
      : '今天想遇見誰？';
  if (message) {
    setStatus(matchmakingStatus, message, 'success');
  }
}

function localizeComparisonText(sourceText) {
  if (typeof MatchmakingStudio === 'undefined') return sourceText || '';
  return MatchmakingStudio.localizePromptText(sourceText || '', activeInterfaceLanguage);
}

function refreshLocalizedPromptDisplays() {
  for (const textarea of [textConfirmationPrompt, autoVideoConfirmation, videoConfirmationPrompt]) {
    if (textarea?.dataset.sourceZh) {
      textarea.value = localizeComparisonText(textarea.dataset.sourceZh);
    }
  }
  renderSavedPrompts();
  renderMatchmakingProfile();
  rerenderHeartCardsForLanguage();
}

function getCurrentPromptCommunityProfile() {
  return {
    gender: gender.value && gender.value !== 'AI判斷' ? inferHeartCardGender(gender.value) : 'any',
    age: normalizeHeartCardAge(ageBracket.value),
    nature: activeAudienceMode === 'sensual' ? 'sensual' : 'designer'
  };
}

function inferHeartCardGender(value) {
  if (/女|female|woman/i.test(value)) return 'female';
  if (/男|male|man/i.test(value)) return 'male';
  if (/非二元|nonbinary|non-binary/i.test(value)) return 'nonbinary';
  return 'any';
}

function normalizeHeartCardAge(value) {
  const match = String(value || '').match(/(\d{2})/);
  const ageValue = match ? Number(match[1]) : 25;
  if (ageValue < 25) return '18-24';
  if (ageValue < 30) return '25-29';
  if (ageValue < 35) return '30-34';
  if (ageValue < 40) return '35-39';
  if (ageValue < 45) return '40-44';
  if (ageValue < 50) return '45-49';
  return '50+';
}

function getSelectedMoment() {
  return getSavedPrompts().find((candidate) => candidate.id === activeSavedPromptId) || null;
}

function buildHeartCardEntryFromMoment(moment) {
  if (typeof MatchmakingStudio === 'undefined' || !moment?.englishPrompt || !moment?.chineseConfirmation) return null;
  return MatchmakingStudio.createCommunityEntry({
    id: `heart-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    gender: moment.communityGender || getCurrentPromptCommunityProfile().gender,
    age: moment.communityAge || getCurrentPromptCommunityProfile().age,
    nature: moment.mode === 'sensual' ? 'sensual' : 'designer',
    sourceText: moment.chineseConfirmation,
    englishPrompt: moment.englishPrompt,
    thumbnailDataUrl: moment.images?.[0]?.dataUrl || '',
    language: 'zh'
  });
}

function publishMomentToHeartCards() {
  const selectedMoment = getSelectedMoment();
  const currentMoment = textResultPrompt.value ? {
    id: `current-${Date.now()}`,
    mode: activeAudienceMode,
    chineseConfirmation: textConfirmationPrompt.dataset.sourceZh || textConfirmationPrompt.value,
    englishPrompt: textResultPrompt.value,
    images: []
  } : null;
  const entry = buildHeartCardEntryFromMoment(selectedMoment || currentMoment);
  if (!entry) {
    setStatus(textStatus, '請先在「悸動瞬間」選取一筆正式輸出的提示詞，或先產生目前提示詞。', 'error');
    return;
  }
  setLocalHeartCardEntries([entry, ...getLocalHeartCardEntries()]);
  setAppPage('matchmaking');
  setStatus(matchmakingStatus, '已匿名上傳成心動卡；配對所只會顯示不具名內容。', 'success');
}

function getHeartCardFilters() {
  return {
    nature: heartNature.value,
    gender: heartGender.value,
    age: heartAge.value
  };
}

function validateHeartCardFilters() {
  const filters = getHeartCardFilters();
  if (!filters.nature || !filters.gender || !filters.age) {
    setStatus(matchmakingStatus, '請先選擇想找的性質、性別與成年年齡範圍。', 'error');
    return null;
  }
  return filters;
}

function makeHeartCardBack(entry, index) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'heart-card-back icon-button';
  button.dataset.icon = '💓';
  button.dataset.heartCardId = entry.id;
  button.innerHTML = `<span>心動卡 ${index + 1}</span><strong>點我翻開</strong>`;
  button.addEventListener('click', () => revealHeartCard(entry.id));
  return button;
}

function makeHeartCardReveal(entry, index) {
  const article = document.createElement('article');
  article.className = 'heart-card revealed-card';
  article.dataset.heartCardId = entry.id;
  const title = document.createElement('h3');
  title.textContent = activeInterfaceLanguage === 'ja' ? `心動カード ${index + 1}` : activeInterfaceLanguage === 'en' ? `Heart card ${index + 1}` : `心動卡 ${index + 1}`;

  const meta = document.createElement('div');
  meta.className = 'heart-card-meta';
  for (const label of ['匿名', entry.nature === 'sensual' ? '色友' : '設友', entry.gender || 'any', entry.age]) {
    const pill = document.createElement('span');
    pill.className = 'heart-card-pill';
    pill.textContent = label;
    meta.append(pill);
  }

  if (entry.thumbnailDataUrl) {
    const thumb = document.createElement('img');
    thumb.className = 'heart-card-thumb';
    thumb.src = entry.thumbnailDataUrl;
    thumb.alt = '匿名用戶保留的文轉圖縮圖';
    article.append(thumb);
  }

  const localizedLabel = makeSavedLabel(activeInterfaceLanguage === 'en' ? 'Localized comparison' : activeInterfaceLanguage === 'ja' ? 'ローカル対照' : '本地語言對照');
  const localizedPrompt = makeReadonlyTextarea(typeof MatchmakingStudio !== 'undefined' ? MatchmakingStudio.getEntryLocalizedText(entry, activeInterfaceLanguage) : entry.sourceText, 5);
  const englishLabel = makeSavedLabel('Complete English text-to-image setting prompt');
  const englishPrompt = makeReadonlyTextarea(entry.englishPrompt, 8);
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'secondary-button icon-button';
  copy.dataset.icon = '📋';
  copy.textContent = '複製完整英文設定提示詞';
  copy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(entry.englishPrompt || '');
    setStatus(matchmakingStatus, '已複製這張心動卡的完整英文設定提示詞。', 'success');
  });
  const actions = document.createElement('div');
  actions.className = 'heart-card-actions';
  actions.append(copy);
  article.append(title, meta, localizedLabel, localizedPrompt, englishLabel, englishPrompt, actions);
  return article;
}

function renderHeartCardBacks(entries) {
  if (!heartCardList) return;
  heartCardList.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('p');
    empty.className = 'status';
    empty.textContent = '目前沒有符合條件的匿名心動卡，請換一組條件再試。';
    heartCardList.append(empty);
    return;
  }
  heartCardList.dataset.lastDrawIds = JSON.stringify(entries.map((entry) => entry.id));
  heartCardList.dataset.revealedId = '';
  entries.forEach((entry, index) => heartCardList.append(makeHeartCardBack(entry, index)));
}

function revealHeartCard(entryId) {
  if (!heartCardList?.dataset.lastDrawIds) return;
  const ids = JSON.parse(heartCardList.dataset.lastDrawIds);
  const entries = ids.map((id) => getAllHeartCardEntries().find((entry) => entry.id === id)).filter(Boolean);
  const selected = entries.find((entry) => entry.id === entryId);
  if (!selected) return;
  heartCardList.dataset.revealedId = entryId;
  heartCardList.replaceChildren(makeHeartCardReveal(selected, entries.indexOf(selected)));
  setStatus(matchmakingStatus, '心動卡已翻開；可複製完整英文設定提示詞，也可對照目前介面語言版本。', 'success');
}

function rerenderHeartCardsForLanguage() {
  if (!heartCardList?.dataset.lastDrawIds) return;
  try {
    const ids = JSON.parse(heartCardList.dataset.lastDrawIds);
    const entries = ids.map((id) => getAllHeartCardEntries().find((entry) => entry.id === id)).filter(Boolean);
    const revealedId = heartCardList.dataset.revealedId;
    if (revealedId) {
      revealHeartCard(revealedId);
    } else {
      renderHeartCardBacks(entries);
    }
  } catch {
    heartCardList.dataset.lastDrawIds = '';
  }
}

function showHeartCards() {
  if (typeof MatchmakingStudio === 'undefined') return;
  const filters = validateHeartCardFilters();
  if (!filters) return;
  const results = MatchmakingStudio.drawHeartCards(getAllHeartCardEntries(), filters, 3);
  renderHeartCardBacks(results);
  if (results.length) {
    setStatus(matchmakingStatus, '已出現 3 張心動卡；請選一張翻開。', 'success');
  } else {
    setStatus(matchmakingStatus, '沒有符合條件的匿名心動卡。', 'error');
  }
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

    const chinesePrompt = makeReadonlyTextarea(localizeComparisonText(item.chineseConfirmation), 5);
    const englishPrompt = makeReadonlyTextarea(item.englishPrompt, 6);
    const videoZh = makeReadonlyTextarea(localizeComparisonText(item.autoVideoZh), 4);
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
    communityGender: getCurrentPromptCommunityProfile().gender,
    communityAge: getCurrentPromptCommunityProfile().age,
    chineseConfirmation: textConfirmationPrompt.dataset.sourceZh || textConfirmationPrompt.value,
    englishPrompt: textResultPrompt.value,
    autoVideoZh: autoVideoConfirmation.dataset.sourceZh || autoVideoConfirmation.value,
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
  if (prefix === 'text' && outputSavePromptButton) outputSavePromptButton.hidden = !isVisible;

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


function localizeShortText(text) {
  if (!text) return '';
  if (activeInterfaceLanguage === 'zh') return text;
  if (activeInterfaceLanguage === 'en') {
    if (text === 'AI判斷') return 'AI decides';
    if (text === '設友') return 'Designer';
    if (text === '色友') return 'Sensual';
    if (text === '女性') return 'Female';
    if (text === '男性') return 'Male';
    if (text === '非二元／其他') return 'Nonbinary / other';
    if (text === '都可以') return 'Any';
    if (text === '請選擇') return 'Please choose';
    return text;
  }
  if (activeInterfaceLanguage === 'ja') {
    if (text === 'AI判斷') return 'AI判断';
    if (text === '請選擇') return '選択してください';
    if (text === '都可以') return 'どれでも';
    if (text === '女性') return '女性';
    if (text === '男性') return '男性';
    if (text === '非二元／其他') return 'ノンバイナリー／その他';
    if (text === '設友') return '設友';
    if (text === '色友') return '色友';
    return typeof MatchmakingStudio !== 'undefined' ? MatchmakingStudio.localizePromptText(text, 'ja') : text;
  }
  if (text === '港語') return '粵語';
  if (text === '請選擇') return '請揀';
  if (text === '都可以') return '都得';
  return typeof MatchmakingStudio !== 'undefined' ? MatchmakingStudio.localizePromptText(text, 'hk').replace(/^粵語對照：/, '') : text;
}

function getLocalizedOptionLabel(optionText) {
  if (typeof optionText === 'string') {
    return localizeShortText(optionText);
  }
  if (activeInterfaceLanguage === 'en') {
    return String(optionText.en || optionText.zh).split('｜').at(-1);
  }
  if (activeInterfaceLanguage === 'ja' || activeInterfaceLanguage === 'hk') {
    return localizeShortText(String(optionText.zh).split('｜').at(-1));
  }
  return String(optionText.zh).split('｜').at(-1);
}

function setSelectOptions(select, options) {
  if (!select) return;
  const previousValue = select.value;
  select.replaceChildren(...options.map(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    return option;
  }));
  if (options.some((option) => option.value === previousValue)) {
    select.value = previousValue;
  }
}

function refreshStaticSelectLanguage() {
  setSelectOptions(intensity, [
    { value: 'soft', label: activeInterfaceLanguage === 'en' ? 'Soft' : activeInterfaceLanguage === 'ja' ? '柔らかめ' : activeInterfaceLanguage === 'hk' ? '柔和' : '柔和' },
    { value: 'medium', label: activeInterfaceLanguage === 'en' ? 'Medium' : activeInterfaceLanguage === 'ja' ? '中くらい' : '中等' },
    { value: 'strong', label: activeInterfaceLanguage === 'en' ? 'Strong' : activeInterfaceLanguage === 'ja' ? '強め' : activeInterfaceLanguage === 'hk' ? '強烈' : '強烈' }
  ]);
  setSelectOptions(dialogueMode, [
    { value: 'none', label: activeInterfaceLanguage === 'en' ? 'None' : activeInterfaceLanguage === 'ja' ? '使わない' : activeInterfaceLanguage === 'hk' ? '唔使用' : '不使用' },
    { value: 'to-camera', label: activeInterfaceLanguage === 'en' ? 'To camera' : activeInterfaceLanguage === 'ja' ? 'カメラへ話す' : activeInterfaceLanguage === 'hk' ? '對住鏡頭講' : '對鏡頭說' },
    { value: 'between-characters', label: activeInterfaceLanguage === 'en' ? 'Between characters' : activeInterfaceLanguage === 'ja' ? 'キャラクター同士' : activeInterfaceLanguage === 'hk' ? '角色之間對話' : '角色間對話' },
    { value: 'both', label: activeInterfaceLanguage === 'en' ? 'Both' : activeInterfaceLanguage === 'ja' ? '両方' : activeInterfaceLanguage === 'hk' ? '兩樣都要' : '兩者' }
  ]);
  setSelectOptions(videoDuration, ['3', '5', '8', '10'].map((value) => ({ value, label: activeInterfaceLanguage === 'en' ? `${value} seconds` : activeInterfaceLanguage === 'ja' ? `${value}秒` : `${value} 秒` })));
  setSelectOptions(motionStrength, [
    { value: 'subtle', label: activeInterfaceLanguage === 'en' ? 'Subtle' : activeInterfaceLanguage === 'ja' ? '控えめ' : activeInterfaceLanguage === 'hk' ? '輕微' : '細微' },
    { value: 'medium', label: activeInterfaceLanguage === 'en' ? 'Medium' : activeInterfaceLanguage === 'ja' ? '中くらい' : activeInterfaceLanguage === 'hk' ? '中等' : '中等' },
    { value: 'strong', label: activeInterfaceLanguage === 'en' ? 'Strong' : activeInterfaceLanguage === 'ja' ? '強め' : activeInterfaceLanguage === 'hk' ? '較強' : '較強' }
  ]);
  setSelectOptions(heartNature, [
    { value: '', label: localizeShortText('請選擇') },
    { value: 'designer', label: localizeShortText('設友') },
    { value: 'sensual', label: localizeShortText('色友') }
  ]);
  setSelectOptions(heartGender, [
    { value: '', label: localizeShortText('請選擇') },
    { value: 'female', label: localizeShortText('女性') },
    { value: 'male', label: localizeShortText('男性') },
    { value: 'nonbinary', label: localizeShortText('非二元／其他') },
    { value: 'any', label: localizeShortText('都可以') }
  ]);
  setSelectOptions(heartAge, [
    { value: '', label: localizeShortText('請選擇') },
    ...['18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50+'].map((value) => ({ value, label: value }))
  ]);
}


function refreshSelectableLanguage() {
  setupCustomizationControls();
  refreshStaticSelectLanguage();
  refreshAutoVideoFromDialogue();
}

function getOptionLabel(optionText) {
  return getLocalizedOptionLabel(optionText);
}

function populateSelect(select, options, { includeAi = true } = {}) {
  const previousValue = select.value;
  const fragment = document.createDocumentFragment();

  if (includeAi) {
    const aiOption = document.createElement('option');
    aiOption.value = 'AI判斷';
    aiOption.textContent = localizeShortText('AI判斷');
    fragment.append(aiOption);
  }

  const optionParents = new Map();

  for (const optionText of options) {
    const group = typeof optionText === 'string' ? '' : optionText.group || '';
    let parent = fragment;

    if (group) {
      if (!optionParents.has(group)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = localizeShortText(group);
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


function getBodyFeatureOptions() {
  return activeAudienceMode === 'sensual'
    ? CUSTOMIZATION_OPTIONS.bodyFeatures
    : getDesignerOptions(CUSTOMIZATION_OPTIONS.bodyFeatures);
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
    populateSelect(document.querySelector(`#character${index}BodyFeature`), getBodyFeatureOptions());
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
  populateSelect(hairFurColor, CUSTOMIZATION_OPTIONS.hairFurColors);
  populateSelect(outfitMaterial, getDesignerOptions(CUSTOMIZATION_OPTIONS.outfitMaterials));
  populateSelect(bodyFeature, getBodyFeatureOptions());
  populateSelect(outfitIntegrity, getDesignerOptions(CUSTOMIZATION_OPTIONS.outfitIntegrity));
  populateSelect(count, CUSTOMIZATION_OPTIONS.counts);
  populateSelect(pet, CUSTOMIZATION_OPTIONS.pets, { includeAi: false });
  pet.value = pet.value || '無';
  populateSelect(accessory, getDesignerOptions(CUSTOMIZATION_OPTIONS.accessories));
  populateSceneOptions();
  populateSelect(actionMode, ACTION_MODE_OPTIONS);
  populateSelect(gazeDirection, CUSTOMIZATION_OPTIONS.gazeDirections);
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
  autoVideoConfirmation.dataset.sourceZh = choices[0].zh;
  autoVideoConfirmation.value = localizeComparisonText(choices[0].zh);
  autoVideoPrompt.value = choices[0].prompt;
  autoVideoPanel.hidden = false;
}

function renderTextResult(result, successMessage) {
  if (!result.ok || !result.screened) {
    textConfirmationPrompt.dataset.sourceZh = '';
    textConfirmationPrompt.value = '';
    textResultPrompt.value = '';
    setOutputVisibility('text', false);
    autoVideoPanel.hidden = true;
    autoVideoConfirmation.dataset.sourceZh = '';
    autoVideoConfirmation.value = '';
    autoVideoPrompt.value = '';
    setStatus(textStatus, result.reason || '提示詞未通過安全篩選。', 'error');
    return;
  }

  textConfirmationPrompt.dataset.sourceZh = result.chineseConfirmation;
  textConfirmationPrompt.value = localizeComparisonText(result.chineseConfirmation);
  textResultPrompt.value = result.englishPrompt;
  setOutputVisibility('text', true);
  renderAutoVideoChoices(result.englishPrompt);
  setStatus(textStatus, `${successMessage} 已同步產生 5 種 AI 判定圖轉影提示詞。`, 'success');
}

function renderVideoResult(result, successMessage) {
  if (!result.ok || !result.screened) {
    const fixText = result.suggestedFix
      ? `修正建議：${result.suggestedFix.zh}\nSuggested fix: ${result.suggestedFix.en}`
      : '';
    videoConfirmationPrompt.dataset.sourceZh = fixText;
    videoConfirmationPrompt.value = localizeComparisonText(fixText);
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

  videoConfirmationPrompt.dataset.sourceZh = result.chineseConfirmation;
  videoConfirmationPrompt.value = localizeComparisonText(result.chineseConfirmation);
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

  const selectedVideoZh = lastImageVideoResult.chineseConfirmation.replace(/中文對照詞意：[^，]+/, `中文對照詞意：${choice.zh}`);
  videoConfirmationPrompt.dataset.sourceZh = selectedVideoZh;
  videoConfirmationPrompt.value = localizeComparisonText(selectedVideoZh);
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
applyAiSuggestionState();
setWizardIndex(0);
setMode('text');
setOutputVisibility('text', false);
setOutputVisibility('video', false);
gmailInput.value = localStorage.getItem('niaiGmail') || '';
showLoginPage('登入頁已準備好；請選擇設友或色友後進入。');
renderSavedPrompts();
renderMatchmakingProfile();

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

backToLoginButton.addEventListener('click', () => showLoginPage());

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

withMeButton.addEventListener('click', () => {
  withMeEnabled = !withMeEnabled;
  withMeButton.classList.toggle('active', withMeEnabled);
  withMeButton.setAttribute('aria-pressed', String(withMeEnabled));
});

dialogueMode.addEventListener('change', updateDialogueVisibility);
aiSuggestionToggle.addEventListener('change', applyAiSuggestionState);

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
publishMomentButton.addEventListener('click', publishMomentToHeartCards);
showHeartCardsButton.addEventListener('click', showHeartCards);

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
  autoVideoConfirmation.dataset.sourceZh = choice.zh;
  autoVideoConfirmation.value = localizeComparisonText(choice.zh);
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
    withMeEnabled,
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
    hairFurColor: hairFurColor.value,
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
    gazeDirection: gazeDirection.value,
    dialogueMode: dialogueMode.value,
    dialogueToCamera: dialogueToCamera.value,
    dialogueBetweenCharacters: dialogueBetweenCharacters.value,
    sponsorSettings: activeInputComplexity === 'complex' && document.querySelector('[data-text-step-panel="commercial"]') ? getSponsorSettings() : {}
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

outputSavePromptButton.addEventListener('click', saveCurrentPrompt);

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

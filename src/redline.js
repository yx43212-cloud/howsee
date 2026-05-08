(function initRedlineApartment(globalScope) {
  const DAILY_LOGIN_POINTS = 1;
  const SHARE_POINTS = 1;
  const SINGLE_DRAW_COST = 3;
  const DOUBLE_DRAW_COST = 5;

  const SEED_ENTRIES = [
    {
      id: 'seed-designer-f-25',
      gender: 'female',
      age: '25-29',
      nature: 'designer',
      localized: {
        zh: '匿名設友分享：25-29 歲女性，月光玻璃屋、銀白長裙、安靜凝視、柔焦藍色逆光。',
        hk: '匿名設友分享：25-29 歲女性，月光玻璃屋、銀白長裙、靜靜凝望、柔焦藍色逆光。',
        en: 'Anonymous designer share: female age 25-29, moonlit glass house, silver-white gown, quiet gaze, soft-focus blue backlight.',
        ja: '匿名の設友シェア：25〜29歳女性、月明かりのガラスハウス、銀白のドレス、静かな視線、柔らかな青い逆光。'
      },
      englishPrompt: 'female adult age 25-29, moonlit glass house, silver-white gown, quiet gaze, soft-focus blue backlight, elegant cinematic composition, tasteful general-audience styling'
    },
    {
      id: 'seed-designer-m-30',
      gender: 'male',
      age: '30-34',
      nature: 'designer',
      localized: {
        zh: '匿名設友分享：30-34 歲男性，雨夜書店、深色風衣、暖黃檯燈、電影感側臉。',
        hk: '匿名設友分享：30-34 歲男性，雨夜書店、深色風褸、暖黃枱燈、電影感側面。',
        en: 'Anonymous designer share: male age 30-34, rainy-night bookstore, dark trench coat, warm desk lamp, cinematic profile.',
        ja: '匿名の設友シェア：30〜34歳男性、雨の夜の書店、濃色トレンチ、暖かなデスクライト、映画的な横顔。'
      },
      englishPrompt: 'male adult age 30-34, rainy-night bookstore, dark trench coat, warm desk lamp, cinematic profile view, refined atmospheric design prompt'
    },
    {
      id: 'seed-sensual-f-35',
      gender: 'female',
      age: '35-39',
      nature: 'sensual',
      localized: {
        zh: '匿名色友分享：35-39 歲女性，玫瑰溫室、黑緞禮服、合意成人曖昧眼神、藝術遮擋。',
        hk: '匿名色友分享：35-39 歲女性，玫瑰溫室、黑緞禮服、合意成人曖昧眼神、藝術遮擋。',
        en: 'Anonymous sensual share: female age 35-39, rose greenhouse, black satin dress, consenting adult intimate gaze, artistic coverage.',
        ja: '匿名の色友シェア：35〜39歳女性、バラの温室、黒いサテンドレス、合意ある成人の艶やかな視線、芸術的なカバー。'
      },
      englishPrompt: 'female adult age 35-39, rose greenhouse, black satin dress, consenting adult intimate gaze, artistic coverage, sensual but non-explicit mood, no minors, no coercion'
    },
    {
      id: 'seed-sensual-any-40',
      gender: 'any',
      age: '40-44',
      nature: 'sensual',
      localized: {
        zh: '匿名色友分享：40-44 歲成人，夜景套房、絲質睡袍、曖昧停頓、柔和城市霓虹。',
        hk: '匿名色友分享：40-44 歲成人，夜景套房、絲質睡袍、曖昧停頓、柔和城市霓虹。',
        en: 'Anonymous sensual share: adult age 40-44, night-view suite, silk robe, intimate pause, soft city neon.',
        ja: '匿名の色友シェア：40〜44歳成人、夜景のスイート、シルクのローブ、艶やかな間、柔らかな都会のネオン。'
      },
      englishPrompt: 'adult age 40-44, night-view suite, silk robe, intimate pause, soft city neon, adult-only consensual sensual mood, tasteful composition'
    }
  ];

  const LOCALIZED_PREFIX = {
    zh: '匿名分享',
    hk: '匿名分享',
    en: 'Anonymous share',
    ja: '匿名シェア'
  };

  const TERM_REPLACEMENTS = {
    hk: [
      ['中文確認', '港語對照'], ['中文說明', '港語說明'], ['提示詞', '提示詞'], ['設友', '設友'], ['色友', '色友'], ['女性', '女性'], ['男性', '男性'], ['場景', '場景'], ['角色', '角色'], ['服裝', '服裝'], ['光感', '光感'], ['鏡位', '鏡位'], ['合意成人', '合意成人']
    ],
    en: [
      ['中文確認', 'localized confirmation'], ['中文說明', 'localized note'], ['主體', 'subject'], ['場景', 'scene'], ['角色', 'character'], ['服裝', 'outfit'], ['光感', 'lighting'], ['鏡位', 'camera'], ['構圖', 'composition'], ['畫風', 'art style'], ['設友', 'designer'], ['色友', 'sensual'], ['女性', 'female'], ['男性', 'male'], ['成人', 'adult'], ['合意', 'consenting'], ['提示詞', 'prompt'], ['安全', 'safety']
    ],
    ja: [
      ['中文確認', 'ローカル確認'], ['中文說明', 'ローカル説明'], ['主體', '主体'], ['場景', 'シーン'], ['角色', 'キャラクター'], ['服裝', '衣装'], ['光感', 'ライティング'], ['鏡位', 'カメラ'], ['構圖', '構図'], ['畫風', '画風'], ['設友', '設友'], ['色友', '色友'], ['女性', '女性'], ['男性', '男性'], ['成人', '成人'], ['合意', '同意'], ['提示詞', 'プロンプト'], ['安全', '安全']
    ]
  };

  function todayKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  function normalizeLanguage(language) {
    return ['zh', 'hk', 'en', 'ja'].includes(language) ? language : 'zh';
  }

  function localizePromptText(text, language = 'zh') {
    const normalized = normalizeLanguage(language);
    if (!text) return '';
    if (normalized === 'zh') return text;
    let localized = text;
    for (const [from, to] of TERM_REPLACEMENTS[normalized] || []) {
      localized = localized.split(from).join(to);
    }
    if (normalized === 'en') return `Localized comparison: ${localized}`;
    if (normalized === 'ja') return `ローカル対照：${localized}`;
    return `港語對照：${localized}`;
  }

  function getEntryLocalizedText(entry, language = 'zh') {
    const normalized = normalizeLanguage(language);
    return entry.localized?.[normalized] || localizePromptText(entry.localized?.zh || entry.sourceText || '', normalized);
  }

  function createCommunityEntry({ id, gender, age, nature, sourceText, englishPrompt, language = 'zh' }) {
    const normalized = normalizeLanguage(language);
    const baseText = sourceText || '';
    return {
      id: id || `redline-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      gender: gender || 'any',
      age: age || '18-24',
      nature: nature === 'sensual' ? 'sensual' : 'designer',
      localized: {
        zh: normalized === 'zh' ? baseText : localizePromptText(baseText, 'zh'),
        [normalized]: baseText
      },
      sourceText: baseText,
      englishPrompt: englishPrompt || '',
      createdAt: new Date().toISOString(),
      anonymous: true
    };
  }

  function filterEntries(entries, filters = {}) {
    return entries.filter((entry) => {
      const genderMatch = !filters.gender || filters.gender === 'any' || entry.gender === 'any' || entry.gender === filters.gender;
      const ageMatch = !filters.age || entry.age === filters.age;
      const natureMatch = !filters.nature || entry.nature === filters.nature;
      return genderMatch && ageMatch && natureMatch;
    });
  }

  function drawRedlineCards(entries, filters, count, random = Math.random) {
    const pool = filterEntries(entries, filters);
    const available = [...pool];
    const results = [];
    while (available.length && results.length < count) {
      const index = Math.floor(random() * available.length);
      results.push(available.splice(index, 1)[0]);
    }
    return results;
  }

  function getDrawCountForPoints(points) {
    if (points >= DOUBLE_DRAW_COST) return 2;
    if (points >= SINGLE_DRAW_COST) return 1;
    return 0;
  }

  function getDrawCost(drawCount) {
    return drawCount >= 2 ? DOUBLE_DRAW_COST : SINGLE_DRAW_COST;
  }

  function awardDailyLogin(profile, date = new Date()) {
    const key = todayKey(date);
    if (profile.lastLoginAwardDate === key) {
      return { ...profile, awarded: false };
    }
    return {
      ...profile,
      points: Number(profile.points || 0) + DAILY_LOGIN_POINTS,
      lastLoginAwardDate: key,
      awarded: true
    };
  }

  const api = {
    DAILY_LOGIN_POINTS,
    SHARE_POINTS,
    SINGLE_DRAW_COST,
    DOUBLE_DRAW_COST,
    SEED_ENTRIES,
    createCommunityEntry,
    filterEntries,
    drawRedlineCards,
    getDrawCountForPoints,
    getDrawCost,
    awardDailyLogin,
    localizePromptText,
    getEntryLocalizedText,
    normalizeLanguage,
    LOCALIZED_PREFIX
  };

  if (typeof module !== 'undefined') {
    module.exports = api;
  }
  globalScope.RedlineApartment = api;
})(typeof window !== 'undefined' ? window : globalThis);

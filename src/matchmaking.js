(function initMatchmakingStudio(globalScope) {
  const DAILY_LOGIN_POINTS = 1;
  const SHARE_POINTS = 1;
  const SINGLE_DRAW_COST = 3;
  const DOUBLE_DRAW_COST = 5;

  const HEART_CARD_GENDERS = ['female', 'male', 'nonbinary', 'any'];
  const HEART_CARD_AGES = ['18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50+'];
  const HEART_CARD_ARCHETYPES = [
    ['月光玻璃屋伴侶', 'moonlit glasshouse companion', 'silver-white outfit, quiet gaze, soft blue backlight'],
    ['雨夜書店朋友', 'rainy-night bookstore friend', 'dark coat, warm desk lamp, cinematic profile'],
    ['玫瑰溫室模特', 'rose greenhouse model', 'black satin styling, intimate but non-explicit gaze, artistic coverage'],
    ['夜景套房旅伴', 'night-view suite travel companion', 'silk robe styling, soft city neon, tasteful composition'],
    ['海風露台戀人', 'sea-breeze terrace lover', 'linen outfit, wind-swept hair, golden-hour glow'],
    ['復古唱片店同伴', 'vintage record-store companion', 'retro jacket, vinyl shelves, nostalgic warm color'],
    ['星光天台守護者', 'starlit rooftop guardian', 'long coat, skyline bokeh, protective mood'],
    ['森林木屋室友', 'forest cabin roommate', 'cozy knitwear, window light, relaxed everyday intimacy'],
    ['美術館午後約會', 'museum afternoon date', 'minimal suit styling, marble hall, quiet emotional tension'],
    ['午夜咖啡館知己', 'midnight cafe confidant', 'soft sweater, rain window, private conversation mood'],
    ['霧藍湖畔旅人', 'misty blue lakeside traveler', 'travel cloak, reflective water, poetic solitude'],
    ['暖黃工作室繆思', 'warm studio muse', 'casual shirt, painterly props, creative partner energy'],
    ['霓虹巷口搭檔', 'neon alley partner', 'cyber jacket, colored rim light, confident stance'],
    ['古堡走廊主人', 'castle corridor host', 'velvet formalwear, candlelit depth, aristocratic mystery'],
    ['花瓣白房間戀人', 'petal-white room lover', 'soft robe, floral light, gentle romantic framing'],
    ['晨光廚房伴侶', 'morning kitchen companion', 'apron styling, natural smile, domestic warmth'],
    ['爵士酒廊邀請者', 'jazz lounge inviter', 'tailored eveningwear, brass reflections, slow-burn charm'],
    ['雪夜壁爐朋友', 'snow-night fireplace friend', 'blanket layers, amber firelight, close winter mood'],
    ['水族館藍光模特', 'aquarium blue-light model', 'flowing outfit, aquatic reflections, dreamy gaze'],
    ['祕密花園引路人', 'secret-garden guide', 'botanical accessories, dusk glow, romantic mystery']
  ];

  const SEED_ENTRIES = Array.from({ length: 100 }, (_, index) => {
    const [zhTitle, enTitle, enDetails] = HEART_CARD_ARCHETYPES[index % HEART_CARD_ARCHETYPES.length];
    const gender = HEART_CARD_GENDERS[index % HEART_CARD_GENDERS.length];
    const age = HEART_CARD_AGES[index % HEART_CARD_AGES.length];
    const nature = index % 2 === 0 ? 'designer' : 'sensual';
    const genderZh = { female: '女性', male: '男性', nonbinary: '非二元成人', any: '成人' }[gender];
    const natureZh = nature === 'sensual' ? '色友' : '設友';
    const safetyEn = nature === 'sensual'
      ? 'adult-only consenting mood, tasteful non-explicit sensual styling, no minors, no coercion'
      : 'general-audience designer styling, no erotic framing, no minors, no coercion';
    const zh = `AI自定義匿名${natureZh}心動卡：${age} ${genderZh}，${zhTitle}，保留完整文轉圖設定與安全成人邊界。`;
    const en = `AI-defined anonymous ${nature} heart card: ${gender} adult age ${age}, ${enTitle}, ${enDetails}, coherent text-to-image setting prompt, ${safetyEn}`;
    return {
      id: `seed-heart-${String(index + 1).padStart(3, '0')}`,
      gender,
      age,
      nature,
      localized: {
        zh,
        hk: zh.replace('自定義', '自訂').replace('完整文轉圖設定', '完整文轉圖設定'),
        en,
        ja: `AI定義の匿名${nature === 'sensual' ? '色友' : '設友'}心動カード：${age} ${gender} adult、${enTitle}、安全な成人向け境界を保持。`
      },
      sourceText: zh,
      englishPrompt: en,
      thumbnailDataUrl: '',
      anonymous: true
    };
  });

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

  function createCommunityEntry({ id, gender, age, nature, sourceText, englishPrompt, thumbnailDataUrl = '', language = 'zh' }) {
    const normalized = normalizeLanguage(language);
    const baseText = sourceText || '';
    return {
      id: id || `heart-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      gender: gender || 'any',
      age: age || '18-24',
      nature: nature === 'sensual' ? 'sensual' : 'designer',
      localized: {
        zh: normalized === 'zh' ? baseText : localizePromptText(baseText, 'zh'),
        [normalized]: baseText
      },
      sourceText: baseText,
      englishPrompt: englishPrompt || '',
      thumbnailDataUrl,
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

  function drawMatchingCards(entries, filters, count, random = Math.random) {
    const pool = filterEntries(entries, filters);
    const available = [...pool];
    const results = [];
    while (available.length && results.length < count) {
      const index = Math.floor(random() * available.length);
      results.push(available.splice(index, 1)[0]);
    }
    return results;
  }

  function drawHeartCards(entries, filters, count = 3, random = Math.random) {
    return drawMatchingCards(entries, filters, count, random);
  }

  function revealHeartCard(entries, entryId) {
    return entries.find((entry) => entry.id === entryId) || null;
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
    drawMatchingCards,
    drawHeartCards,
    revealHeartCard,
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
  globalScope.MatchmakingStudio = api;
})(typeof window !== 'undefined' ? window : globalThis);

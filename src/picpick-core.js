(function (global) {
  const styleCategories = [
    '寫實攝影類', '日韓質感類', '商業形象類', '動畫插畫類', '潮流酷炫類',
    '復古懷舊類', '奇幻變身類', '社群爆款類', '東方風格類', '情緒氛圍類'
  ];

  const categoryItems = {
    '寫實攝影類': ['自然寫真', '電影劇照', '棚拍肖像', '底片攝影', '紀實街拍'],
    '日韓質感類': ['韓系清透', '日系文青', '首爾雜誌', '東京街拍', '清新空氣感'],
    '商業形象類': ['精品形象', '企業頭像', '產品主視覺', '品牌海報', '高級商攝'],
    '動畫插畫類': ['日系動畫', '半寫實插畫', '童書插畫', '漫畫封面', '3D 角色'],
    '潮流酷炫類': ['賽博霓虹', '街頭潮流', 'Y2K 辣感', '未來科技', '暗黑潮牌'],
    '復古懷舊類': ['復古底片', '港風電影', '拍立得', '昭和海報', '老派雜誌'],
    '奇幻變身類': ['精靈奇幻', '魔法學院', '星際旅人', '童話變身', '神話史詩'],
    '社群爆款類': ['IG 乾淨感', '小紅書封面', '短影音縮圖', '貼文模板', '流量感人像'],
    '東方風格類': ['新中式', '水墨意境', '唐風華服', '禪意空間', '東方精品'],
    '情緒氛圍類': ['療癒微光', '浪漫雨夜', '孤獨電影', '溫柔午後', '神秘暗調']
  };

  const makeOptions = (categories, perCategory, prefix) => categories.flatMap((category) => {
    const base = categoryItems[category] || [];
    return Array.from({ length: perCategory }, (_, index) => {
      const label = base[index % base.length] || `${category}${index + 1}`;
      return {
        id: `${prefix}-${category}-${String(index + 1).padStart(2, '0')}`,
        label: index < base.length ? label : `${label} ${Math.floor(index / base.length) + 1}`,
        category,
        prompt: `${category}的${index < base.length ? label : `${label}延伸變化`}，保持照片主體辨識度並提升整體完成度`
      };
    });
  });

  const photoTypes = [
    ['單人', '強調個人主體、五官、氣場'], ['雙人', '強調互動、比例、構圖平衡'],
    ['多人', '強調人物辨識度、避免撞臉、群體層次'], ['團體', '強調群像排列、整齊度、層次感'],
    ['商品', '強調主體展示、材質、商業感'], ['寵物', '強調動物特徵、可愛度、風格一致'],
    ['風景 / 空間', '強調空間氛圍、場景調性、構圖感']
  ].map(([label, prompt], index) => ({ id: `photo-${index + 1}`, label, prompt }));

  const ageModes = ['保留原年紀', '幼兒', '兒童', '國小生', '國中生', '高中生', '大學生', '20代', '30代', '40代', '50代', '60代', '銀髮族', '年輕化', '成熟化', '兒童化', '銀髮化', '不改年紀，只調整氣質'].map((label, index) => ({ id: `age-${index + 1}`, label, prompt: label === '保留原年紀' ? '保留照片中人物原本年紀' : `年紀方向：${label}` }));

  const lightCategories = {
    '基礎光': ['自然光', '柔和窗光', '棚拍白光', '室內暖光', '陰天散射光'],
    '情緒光': ['黃昏逆光', '電影感側光', '戲劇追光', '夜景霓虹光', '柔霧夢幻光', '燭光感', '月光感', '暗調電影光'],
    '商業光': ['精品硬光', '保養品柔膚光', '產品主視覺光', '展示櫥窗光', '高級商攝光']
  };
  const makeGrouped = (groups, prefix, promptSuffix = '') => Object.entries(groups).flatMap(([category, labels]) => labels.map((label, index) => ({ id: `${prefix}-${category}-${index + 1}`, label, category, prompt: `${label}${promptSuffix}` })));

  const data = {
    photo_types: photoTypes,
    person_modes: photoTypes,
    age_modes: ageModes,
    style_categories: styleCategories.map((label, index) => ({ id: `style-cat-${index + 1}`, label })),
    styles: makeOptions(styleCategories, 20, 'style'),
    lights: makeGrouped(lightCategories, 'light', '，光線合理、層次清楚'),
    locations: makeGrouped({ '攝影棚': ['白背景棚', '灰牆棚', '彩色紙棚', '自然光棚', '商攝棚'], '咖啡廳': ['木質咖啡廳', '韓系咖啡廳', '窗邊座位', '復古咖啡館', '夜間咖啡吧'], '街頭': ['城市街頭', '霓虹巷弄', '斑馬線', '老街', '雨後街景'], '商辦空間': ['高樓辦公室', '會議室', '共享空間', '玻璃大廳', '主管辦公室'], '百貨商場': ['精品櫥窗', '百貨中庭', '電扶梯旁', '香氛專櫃', '時尚走廊'], '家居空間': ['客廳', '臥室', '廚房', '陽台', '閱讀角'], '校園': ['圖書館', '教室', '校園步道', '操場', '社團教室'], '大自然': ['森林', '海邊', '草地', '山景', '花園'], '旅遊場景': ['機場', '飯店大廳', '歐洲小鎮', '海島度假', '夜市'], '特殊主題場景': ['未來城市', '魔法森林', '美術館', '音樂祭', '節慶市集'] }, 'location', '作為場景'),
    outfits: makeGrouped({ '保留 / 自動': ['保留原服裝', '自動換裝'], '男裝': ['俐落襯衫', '西裝套裝', '針織外套', '街頭帽T', '機能外套'], '女裝': ['韓系洋裝', '法式襯衫', '高腰套裝', '柔軟針織', '小禮服'], '男女搭配': ['簡約同色系', '黑白對比', '休閒牛仔', '高級商務', '度假亞麻'], '雙人搭配': ['協調情侶色', '主從層次', '一正式一休閒', '雙人雜誌感', '同材質呼應'], '多人群體搭配': ['群體同色系', '層次制服感', '品牌團隊感', '派對亮色', '自然休閒'], '商務搭配': ['正式西裝', '商務休閒', '履歷襯衫', '高階主管', '創業者形象'], '主題造型搭配': ['奇幻斗篷', '復古禮服', '未來科技裝', '節慶造型', '舞台造型'] }, 'outfit', '，服裝自然合身'),
    accessories: makeGrouped({ '配件模式': ['不加配件', '保留原配件', '替換配件', '新增 1 個配件', '新增 2–3 個配件', '主題配件組合'], '個人形象配件': ['眼鏡', '帽子', '耳環', '手錶', '絲巾'], '商務專業配件': ['筆電', '文件夾', '名片', '鋼筆', '皮革公事包'], '攝影創作配件': ['相機', '反光板', '底片機', '花束', '咖啡杯'], '時尚潮流配件': ['墨鏡', '鏈條包', '潮流球鞋', '棒球帽', '金屬飾品'], '生活日常配件': ['書本', '手機', '帆布袋', '水杯', '耳機'], '奇幻變身配件': ['魔法杖', '羽毛冠', '星光飾品', '披風扣', '水晶球'], '復古懷舊配件': ['拍立得', '黑膠唱片', '老式電話', '復古行李箱', '膠框眼鏡'], '社群拍攝配件': ['手拿牌', '小道具', '貼紙元素', '品牌立牌', '打卡小物'], '節慶主題配件': ['聖誕花圈', '燈串', '紅包', '派對帽', '節慶花束'] }, 'accessory', '，避免過多雜物'),
    color_palettes: makeGrouped({ '常用': ['奶油色', '黑金', '粉色', '藍灰', '莫蘭迪', '復古棕', '霓虹色'], '高級': ['象牙白與香檳金', '深海藍與銀灰', '可可棕與米白', '墨綠與古銅', '酒紅與黑'], '清新': ['霧粉與杏色', '湖水藍與白', '鼠尾草綠', '淡紫灰', '淺檸檬黃'], '品牌': ['主色強化', '輔色平衡', '點綴色醒目', '背景色乾淨', '文字建議高對比'] }, 'palette', '配色'),
    moods: makeOptions(['療癒溫柔系', '高級質感系', '電影敘事系', '浪漫情感系', '潮流個性系', '奇幻夢境系', '復古懷舊系', '活力歡樂系', '情緒深層系', '氣勢場域系'], 10, 'mood'),
    frames: makeOptions(['極簡框線', '高級精品框線', '韓系日系框線', '社群框線', '可愛活潑框線', '復古框線', '奇幻主題框線', '商業用途框線', '專業人物框線', '文字版型框線'], 10, 'frame'),
    layouts: makeGrouped({ '無文字型': ['純圖片', '滿版主視覺', '留白海報式', '雜誌感純圖', '拼貼構圖'], '輕文字型': ['上標題下圖片', '下標題上圖片', '左文右圖', '右文左圖', '簡約封面式'], '重文字型': ['商品 DM', '活動宣傳', '課程招生', '品牌海報', '雜誌封面', '內頁版型', '名言卡', '資訊卡'] }, 'layout', '版面'),
    outputs: makeGrouped({ '社群貼文': ['IG貼文', 'FB貼文', '小紅書貼文', 'Threads 圖卡', 'LinkedIn 貼文'], '限時動態': ['IG限動', 'FB限動', '直式互動卡', '新品預告', '日常紀錄'], '短影音封面': ['Reels 封面', 'Shorts 封面', 'TikTok 封面', 'Vlog 封面', '訪談封面'], '商品廣告': ['商品廣告', '新品上市', '電商主圖', '促銷圖', '品牌形象廣告'], '個人品牌': ['個人品牌照', '講師形象', '創作者頭像', '社群首頁', '媒體照'], '商務履歷': ['履歷照', '企業官網照', '團隊介紹', '名片頭像', '簡報講者照'], '官網 / Banner': ['官網 Banner', '活動頁首圖', '品牌首頁', '橫幅廣告', 'EDM 主視覺'], '印刷輸出': ['海報', '明信片', '邀請卡', '菜單封面', '展場輸出'], '課程 / 簡報': ['課程封面', '簡報封面', '講義封面', '招生圖', '工作坊海報'], '內容創作封面': ['Podcast 封面', '文章封面', '電子書封面', '專欄封面', '直播封面'] }, 'output', '用途'),
    text_styles: ['極簡現代', '高級精品', '韓系清新', '日系文青', '商務正式', '潮流個性', '可愛活潑', '復古海報', '科技未來', '新中式'].map((label, index) => ({ id: `text-style-${index + 1}`, label, prompt: `${label}字體風格` })),
    prompt_rules: ['保留照片原始主體辨識度', '以使用者選擇的模組組裝自然可讀提示詞', '文字內容需準確排版並避免錯字'],
    negative_prompt_rules: ['五官變形', '手指錯誤', '低畫質', '構圖擁擠', '文字錯字', '比例怪異', '人物撞臉', '背景雜亂', '光線不合理']
  };


  ['高級', '溫柔', '浪漫', '酷炫', '活力', '神秘', '療癒', '專業'].forEach((label, index) => {
    data.moods[index] = { ...data.moods[index], label, prompt: `${label}氛圍，情緒清楚但不過度誇張` };
  });
  ['無框線', '細白框', '細黑框', '雜誌框', '拍立得框', '可愛框'].forEach((label, index) => {
    data.frames[index] = { ...data.frames[index], label, prompt: `${label}，這是畫面中的框線設計而不是外框裁切` };
  });

  function expandCollection(collection, target, prefix) {
    const originals = [...collection];
    let index = 0;
    while (collection.length < target) {
      const source = originals[index % originals.length];
      const variant = Math.floor(index / originals.length) + 2;
      collection.push({
        ...source,
        id: `${prefix}-extended-${String(collection.length + 1).padStart(3, '0')}`,
        label: `${source.label} 延伸${variant}`,
        prompt: `${source.prompt}，第 ${variant} 組延伸模板，可依品牌與照片內容再細修`
      });
      index += 1;
    }
  }

  expandCollection(data.locations, 100, 'location');
  expandCollection(data.outfits, 100, 'outfit');
  expandCollection(data.accessories, 100, 'accessory');
  expandCollection(data.color_palettes, 100, 'palette');
  expandCollection(data.layouts, 50, 'layout');
  expandCollection(data.outputs, 100, 'output');

  const basicIds = {
    styles: styleCategories.map((label) => data.styles.find((item) => item.category === label).id),
    lights: ['自然光', '柔和窗光', '室內暖光', '黃昏逆光', '夜景霓虹光', '高級商攝光'],
    locations: ['白背景棚', '韓系咖啡廳', '城市街頭', '客廳', '森林', '飯店大廳'],
    outfits: ['保留原服裝', '韓系洋裝', '正式西裝', '街頭帽T', '小禮服', '休閒牛仔', '柔軟針織', '高級商務'],
    accessories: ['不加配件', '保留原配件', '眼鏡', '帽子', '相機', '鏈條包', '花束', '咖啡杯'],
    palettes: ['奶油色', '黑金', '粉色', '藍灰', '莫蘭迪', '復古棕', '霓虹色'],
    moods: ['高級', '溫柔', '浪漫', '酷炫', '活力', '神秘', '療癒', '專業'],
    frames: ['無框線', '細白框', '細黑框', '雜誌框', '拍立得框', '可愛框'],
    layouts: ['純圖片', '上標題下圖片', '左文右圖', '雜誌封面', '商品 DM'],
    outputs: ['IG貼文', 'IG限動', 'FB貼文', '個人品牌照', '商品廣告', '海報', '履歷照']
  };

  const defaultTuning = {
    identity: 85, retouch: 45, background: 35, realism: 70, color: 55, refinement: 70,
    cinematic: 45, moodIntensity: 55, detail: 70, creativity: 30, compositionFreedom: 40,
    textPresence: 55, textFusion: 60, framePresence: 35, frameWidth: 20, frameOpacity: 65,
    frameRadius: 16, frameDecoration: 30, framePadding: 28, frameShadow: 20,
    textSize: 48, textWeight: 60, letterSpacing: 10, lineHeight: 120
  };

  const findById = (collection, id) => data[collection].find((item) => item.id === id) || data[collection][0];
  const findByLabel = (collection, label) => data[collection].find((item) => item.label === label);
  const value = (state, key, collection) => findById(collection, state[key]);

  function getStyleCode(state = {}) {
    const seed = JSON.stringify({ style: state.styleId, palette: state.paletteId, mood: state.moodId, layout: state.layoutId, output: state.outputId, text: state.text?.title || '' });
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = ((hash << 5) - hash) + seed.charCodeAt(i) | 0;
    const prefix = state.outputId && value(state, 'outputId', 'outputs').category?.includes('品牌') ? 'PP-BRAND' : 'PP-STYLE';
    return `${prefix}-${String(Math.abs(hash) % 1000).padStart(3, '0')}`;
  }

  function describeTuning(tuning = {}) {
    const merged = { ...defaultTuning, ...tuning };
    return [
      `人物保留度 ${merged.identity}/100`, `修飾強度 ${merged.retouch}/100`, `背景變化程度 ${merged.background}/100`,
      `寫實 / 插畫程度 ${merged.realism}/100`, `色彩濃度 ${merged.color}/100`, `精緻程度 ${merged.refinement}/100`,
      `電影感 ${merged.cinematic}/100`, `氛圍強度 ${merged.moodIntensity}/100`, `細節清晰度 ${merged.detail}/100`,
      `創意變形程度 ${merged.creativity}/100`, `構圖自由度 ${merged.compositionFreedom}/100`, `文字存在感 ${merged.textPresence}/100`,
      `圖文融合度 ${merged.textFusion}/100`, `框線存在感 ${merged.framePresence}/100`
    ];
  }

  function buildTextPart(state) {
    if (!state.includeText) return '不加入文字，保持純圖片或低文字干擾。';
    const text = state.text || {};
    const pairs = [['主標題', text.title], ['副標題', text.subtitle], ['內文說明', text.body], ['重點標語', text.highlight], ['CTA 行動句', text.cta], ['名字 / 品牌名 / 活動名', text.name], ['日期 / 地點 / 價格 / 聯絡資訊', text.info], ['備註文字', text.note]].filter(([, v]) => v);
    const style = value(state, 'textStyleId', 'text_styles');
    const align = state.textAlign || '置中';
    return `加入文字：${pairs.map(([k, v]) => `${k}「${v}」`).join('、') || '由 AI 依用途生成簡短文案'}。字體採${style.label}，${align}對齊，文字大小 ${state.tuning?.textSize || defaultTuning.textSize}/100、文字粗細 ${state.tuning?.textWeight || defaultTuning.textWeight}/100、字距 ${state.tuning?.letterSpacing || defaultTuning.letterSpacing}/100、行距 ${state.tuning?.lineHeight || defaultTuning.lineHeight}/100。`;
  }

  function assemblePrompt(state = {}) {
    const normalized = normalizeState(state);
    const photo = value(normalized, 'photoTypeId', 'photo_types');
    const age = value(normalized, 'ageModeId', 'age_modes');
    const style = value(normalized, 'styleId', 'styles');
    const light = value(normalized, 'lightId', 'lights');
    const location = value(normalized, 'locationId', 'locations');
    const outfit = value(normalized, 'outfitId', 'outfits');
    const accessory = value(normalized, 'accessoryId', 'accessories');
    const palette = value(normalized, 'paletteId', 'color_palettes');
    const mood = value(normalized, 'moodId', 'moods');
    const frame = value(normalized, 'frameId', 'frames');
    const layout = value(normalized, 'layoutId', 'layouts');
    const output = value(normalized, 'outputId', 'outputs');
    const tuning = describeTuning(normalized.tuning);
    const frameDetail = `框線設定：${frame.label}，框線粗細 ${normalized.tuning.frameWidth}/100、透明度 ${normalized.tuning.frameOpacity}/100、圓角 ${normalized.tuning.frameRadius}/100、裝飾感 ${normalized.tuning.frameDecoration}/100、留白寬度 ${normalized.tuning.framePadding}/100、陰影強度 ${normalized.tuning.frameShadow}/100。`;
    const textPart = buildTextPart(normalized);
    const fullPrompt = `請根據我上傳的照片進行 AI 照片編輯。照片類型 / 人物模式為「${photo.label}」，${photo.prompt}；${age.prompt}。整體畫風使用「${style.label}」：${style.prompt}。光線使用「${light.label}」：${light.prompt}。地點 / 場景為「${location.label}」，${location.prompt}。服裝設定為「${outfit.label}」，${outfit.prompt}；配件設定為「${accessory.label}」，${accessory.prompt}。配色採「${palette.label}」，請安排主色、輔色、點綴色、背景色與文字建議色的協調。氛圍為「${mood.label}」，保持自然、乾淨、有設計感。排版使用「${layout.label}」，輸出用途為「${output.label}」。${frameDetail}${textPart}細節要求：${tuning.join('、')}。請保留主體辨識度、避免過度修圖，讓結果可直接用於 ${output.label}。`;
    const shortPrompt = `${photo.label}照片編輯，${style.label}、${light.label}、${location.label}、${outfit.label}、${palette.label}、${mood.label}，${layout.label}，用途：${output.label}，人物保留度 ${normalized.tuning.identity}/100，${normalized.includeText ? '含指定文字' : '不加文字'}。`;
    const negativePrompt = data.negative_prompt_rules.join('、') + '、過度磨皮、主體失真、文字位置錯亂、品牌資訊遺漏。';
    return { fullPrompt, shortPrompt, negativePrompt, styleCode: getStyleCode(normalized), state: normalized };
  }

  function normalizeState(state = {}) {
    return {
      mode: state.mode || 'basic',
      photoTypeId: state.photoTypeId || data.photo_types[0].id,
      ageModeId: state.ageModeId || data.age_modes[0].id,
      styleId: state.styleId || data.styles[0].id,
      lightId: state.lightId || data.lights[0].id,
      locationId: state.locationId || data.locations[0].id,
      outfitId: state.outfitId || data.outfits[0].id,
      accessoryId: state.accessoryId || data.accessories[0].id,
      paletteId: state.paletteId || data.color_palettes[0].id,
      moodId: state.moodId || data.moods[0].id,
      frameId: state.frameId || data.frames[0].id,
      layoutId: state.layoutId || data.layouts[0].id,
      outputId: state.outputId || data.outputs[0].id,
      includeText: Boolean(state.includeText),
      textStyleId: state.textStyleId || data.text_styles[0].id,
      textAlign: state.textAlign || '置中',
      text: { ...(state.text || {}) },
      tuning: { ...defaultTuning, ...(state.tuning || {}) },
      imageName: state.imageName || '',
      createdAt: state.createdAt || new Date().toISOString()
    };
  }

  const api = { picpickData: data, basicIds, defaultTuning, assemblePrompt, normalizeState, findById, findByLabel };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.PicPickCore = api;
})(typeof window !== 'undefined' ? window : globalThis);

const DEFAULT_STYLE = {
  tone: 'cinematic, sensual, adult-only',
  quality: 'high-detail, tasteful composition, dramatic lighting',
  safety: 'all characters are clearly 18+, consenting adults; no coercion, no minors'
};

const BLOCKED_PATTERNS = [
  { pattern: /未成年|幼|蘿莉|正太|學生|校服|child|minor|teen|underage/i, reason: '內容疑似涉及未成年人。' },
  { pattern: /強迫|迷姦|下藥|昏迷|睡著|無意識|rape|forced|drugged|unconscious/i, reason: '內容疑似涉及非合意或無法同意情境。' },
  { pattern: /偷拍|偷窺|未同意|voyeur|hidden camera/i, reason: '內容疑似涉及未同意拍攝或偷窺。' },
  { pattern: /血|虐殺|肢解|重傷|blood|gore|dismember/i, reason: '內容疑似涉及血腥暴力。' }
];

const PHRASE_RULES = [
  { pattern: /脫衣服|脫掉衣服|把衣服脫掉|脫光/g, replacement: '布料滑落與被拉開的動態、逐步展露肌膚輪廓' },
  { pattern: /撕衣服|撕開衣服|扯破衣服/g, replacement: '布料被拉扯裂開、邊緣飛散、肌膚在光影中顯現' },
  { pattern: /親吻|接吻|喇舌/g, replacement: '炙熱親吻、唇齒交纏、近距離呼吸與曖昧眼神' },
  { pattern: /撫摸|摸|揉/g, replacement: '指尖沿著身體曲線游移、溫柔按壓與挑逗性的肢體接觸' },
  { pattern: /自慰|自我安慰/g, replacement: '私密獨處的愉悅氛圍、低聲喘息、手部貼近身體的暗示性動作' },
  { pattern: /做愛|性交|性行為|%%/g, replacement: '合意成人之間的親密交纏、緊貼的身體姿態、強烈情慾張力' },
  { pattern: /高潮|射精/g, replacement: '情緒與感官達到高峰、顫抖的姿態、迷離表情與急促呼吸' },
  { pattern: /裸|裸體|全裸/g, replacement: '未著衣的成人人體輪廓、以構圖與光影呈現肌膚質感' }
];

const INTENSITY_WORDS = {
  soft: '柔和曖昧、留白較多、偏藝術寫真',
  medium: '情慾張力明顯、肢體互動更近、細節較豐富',
  strong: '成人向氛圍強烈、動態肢體與表情更直接，但維持合意與安全邊界'
};

const LIGHTING_DESCRIPTIONS = [
  '薄紗晨光從窗邊斜切進來，勾勒柔亮肌膚邊緣',
  '低色溫燭光在陰影中跳動，形成親密的金色輪廓',
  '霓虹粉紫反射在皮膚與布料上，帶有夜城迷幻感',
  '月光穿過百葉窗形成細長光帶，營造禁忌般的靜謐',
  '逆光剪影讓身體曲線變成精準的黑金輪廓',
  '柔焦棚燈包覆人物，呈現高級雜誌封面質感',
  '濕潤反光地面折射光源，讓畫面更有張力',
  '暖白床頭燈集中在臉部與肩線，背景自然暗下',
  '藍色冷光與琥珀暖光交錯，形成電影感雙色對比',
  '日落橘光灑在窗簾與肌膚上，氣氛慵懶而濃烈',
  '高反差聚光燈只照亮表情與手部動作',
  '柔和漫射光消除硬陰影，讓畫面乾淨細膩',
  '水面反射的波紋光投在牆面，帶出流動的曖昧感',
  '暗房紅光包住人物輪廓，呈現復古攝影氛圍',
  '銀白邊緣光切出髮絲與肩頸線條',
  '窗外城市燈火散成散景，前景人物保持細緻清晰',
  '柔粉色補光讓臉蛋更甜美，陰影保持輕薄',
  '舞台煙霧中穿透的光束，製造神秘而隆重的空間感',
  '黑背景中的單點頂光，強調雕塑般身形與姿態',
  '晨霧擴散光讓場景像夢境，邊界柔化而迷人'
];

const AWE_DESCRIPTIONS = [
  '帶著神殿般的莊嚴感，人物像被凝視的藝術雕像',
  '神聖光暈環繞主體，氣氛既敬畏又親密',
  '姿態如古典油畫中的女神或神祇，視線充滿壓迫美感',
  '背景尺度宏大，讓人物帶有不可侵犯的存在感',
  '以低角度仰視構圖呈現權威、優雅與震懾',
  '布料與光影像祭典儀式般層層展開',
  '表情冷靜自持，散發讓人屏息的尊貴氣場',
  '空間留白巨大，凸顯主體的精神重量',
  '金色粒子漂浮在周圍，像被神話場域包圍',
  '構圖對稱而莊重，帶有宗教壁畫般的秩序感',
  '人物眼神直視鏡頭，形成不容逃避的凝視',
  '冠冕、珠飾或光環元素暗示崇高身份',
  '長階、帷幕與柱廊襯托出史詩級登場感',
  '風捲起髮絲與衣料，形成神諭降臨般的瞬間',
  '冷暖光在人物周圍形成聖像式輪廓',
  '畫面節奏克制，讓情緒像儀式般緩慢累積',
  '細節精緻到近乎供奉品，帶有高級收藏感',
  '主體置於畫面中心，周遭元素像臣服般向內收束',
  '霧氣與逆光讓角色像從傳說中走出',
  '華麗卻不混亂，讓慾望被包裝成敬畏與崇拜'
];

const CUSTOMIZATION_OPTIONS = {
  faces: [
    '冷豔瓜子臉與銳利眼尾', '甜美圓臉與柔亮臥蠶', '成熟鵝蛋臉與高挺鼻樑', '精緻混血感五官', '貓系眼神與小巧下巴',
    '狐狸眼與自信微笑', '溫柔杏眼與自然唇色', '濃顏系立體輪廓', '清冷淡顏與霧面妝感', '復古紅唇與波浪瀏海',
    '高顴骨時裝臉', '無辜下垂眼與柔軟表情', '俐落短髮襯托英氣臉蛋', '慵懶睡眼與微張唇形', '深邃眼窩與光澤眼妝',
    '雀斑鼻樑與自然笑意', '娃娃感大眼但明確成年', '御姐感長眉與冷靜神情', '陽光健康膚色與明朗五官', '古典美人臉與細長眉眼',
    '賽博感銀色眼妝', '暗黑哥德妝容與蒼白膚色', '日系柔霧妝與低飽和唇色', '韓系水光妝與精修臉部輪廓', '中性帥氣臉與俐落眉峰',
    '女王感上挑眼線', '藝術模特般骨相清晰', '微醺紅暈與迷離眼神', '乾淨裸妝與高級膚質', '電影特寫級細膩表情'
  ],
  outfits: [
    '絲質吊帶睡裙', '高級訂製黑色禮服', '半透明薄紗外罩', '白襯衫與鬆開的領口', '緞面長袍與腰帶',
    '皮革束腰與長手套', '蕾絲內搭與西裝外套', '復古旗袍剪裁', '舞台感亮片連身裝', '極簡針織貼身洋裝',
    '浴袍與濕髮造型', '絲巾與珠寶點綴', '哥德黑紗與銀飾', '未來感金屬光澤服裝', '希臘女神風垂墜布料',
    '高腰長裙與開衩設計', '絲絨披肩與裸肩輪廓', '優雅套裝搭配高跟鞋', '輕盈薄紗裙擺', '暗紅緞面禮服',
    '珍珠肩帶與細緻刺繡', '透明雨衣疊穿造型', '海邊度假罩衫', '黑白撞色時裝', '寬鬆男友襯衫',
    '芭蕾緞帶與柔軟針織', '金色鏈飾與簡潔布料', '復古睡袍與羽毛拖鞋', '深色制服感套裝但非校園', '藝術攝影用身體布幔'
  ],
  counts: [
    '單人主體，鏡頭聚焦表情與姿態', '雙人合意互動，距離親密但構圖優雅', '三人成人群像，彼此視線形成三角張力', '四人時裝大片式站位', '一位主角與一位背影陪襯',
    '主角坐姿，另一位成人在前景形成景深', '雙人鏡面反射構圖', '單人與巨大陰影對比', '雙人對稱構圖，動作互相呼應', '三人舞台式層次排列',
    '單人近景特寫', '單人全身構圖', '雙人剪影重疊', '兩位成人隔著薄紗互望', '一主二輔的雜誌封面站位',
    '雙人一坐一站的高低差', '三人以沙發為中心形成環形構圖', '單人背影與回眸', '雙人手部細節特寫', '多位成人派對氛圍但主體清楚'
  ],
  scenes: [
    '高樓落地窗夜景套房', '復古歐式臥室', '極簡白色攝影棚', '霓虹酒吧角落', '雨夜車窗旁',
    '私人美術館展廳', '天鵝絨窗簾舞台', '海邊玻璃屋', '溫泉旅館房間', '奢華飯店浴室',
    '燭光餐桌後的昏暗房間', '大型圓床與薄紗帳幔', '城市頂樓露台', '古典柱廊與長階', '暗紅色地下爵士酒吧',
    '黑色背景時尚攝影棚', '晨光灑入的公寓臥室', '大理石浴池與霧氣', '金色宮殿風內室', '未來感賽博套房',
    '法式老宅書房', '私人更衣間與落地鏡', '深色木質酒窖', '玫瑰花瓣散落的房間', '雪夜壁爐旁',
    '熱帶度假別墅', '藝術家工作室', '豪華郵輪艙房', '月光花園涼亭', '紅毯後台休息室'
  ]
};

function normalizeInput(input) {
  return String(input ?? '').trim().replace(/\s+/g, ' ');
}

function validatePrompt(input) {
  const prompt = normalizeInput(input);

  if (!prompt) {
    return { ok: false, reason: '請先輸入想轉譯的提示詞。' };
  }

  const blocked = BLOCKED_PATTERNS.find(({ pattern }) => pattern.test(prompt));
  if (blocked) {
    return { ok: false, reason: blocked.reason };
  }

  return { ok: true, prompt };
}

function getOptionValue(groupName, value) {
  const group = CUSTOMIZATION_OPTIONS[groupName] || [];
  const normalized = normalizeInput(value);
  return group.includes(normalized) ? normalized : '';
}

function rewritePrompt(input, options = {}) {
  const validation = validatePrompt(input);
  if (!validation.ok) {
    return {
      ok: false,
      prompt: '',
      reason: validation.reason
    };
  }

  const intensity = INTENSITY_WORDS[options.intensity] ? options.intensity : 'medium';
  const lighting = LIGHTING_DESCRIPTIONS.includes(options.lighting) ? options.lighting : LIGHTING_DESCRIPTIONS[0];
  const awe = AWE_DESCRIPTIONS.includes(options.awe) ? options.awe : AWE_DESCRIPTIONS[0];
  const customParts = [
    getOptionValue('faces', options.face),
    getOptionValue('outfits', options.outfit),
    getOptionValue('counts', options.count),
    getOptionValue('scenes', options.scene)
  ].filter(Boolean);

  let rewritten = validation.prompt;

  for (const { pattern, replacement } of PHRASE_RULES) {
    rewritten = rewritten.replace(pattern, replacement);
  }

  return {
    ok: true,
    prompt: [
      rewritten,
      ...customParts,
      lighting,
      awe,
      DEFAULT_STYLE.tone,
      INTENSITY_WORDS[intensity],
      DEFAULT_STYLE.quality,
      DEFAULT_STYLE.safety
    ].join(', '),
    reason: ''
  };
}

if (typeof module !== 'undefined') {
  module.exports = {
    rewritePrompt,
    validatePrompt,
    PHRASE_RULES,
    BLOCKED_PATTERNS,
    LIGHTING_DESCRIPTIONS,
    AWE_DESCRIPTIONS,
    CUSTOMIZATION_OPTIONS
  };
}

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

const CAMERA_ANGLES = [
  'eye-level shot, natural perspective, balanced portrait framing',
  'low-angle shot, stronger presence, elongated body lines',
  'high-angle shot, intimate overview, soft vulnerability',
  'over-the-shoulder shot, foreground shoulder blur, focused gaze',
  'close-up shot, face and expression priority, shallow depth of field',
  'extreme close-up shot, lips, eyes, and fingertips emphasized',
  'medium shot, upper body gesture and costume details clearly visible',
  'full-body shot, complete silhouette and pose readable from head to toe',
  'three-quarter view, face and body turned diagonally for depth',
  'profile shot, side silhouette and neck line emphasized',
  'back view with head turned, elegant shoulder and spine line composition',
  'top-down shot, bed or floor layout visible, graphic composition',
  'floor-level shot, foreground texture and dramatic perspective',
  'mirror reflection shot, subject and reflected pose both visible',
  'doorway framing shot, voyeur-free staged composition through architecture',
  'wide establishing shot, character integrated with the full scene',
  'Dutch angle shot, subtle tilt for tension and cinematic unease',
  'silhouette shot against bright background, readable body outline',
  'hands-focused insert shot, tactile gesture and fabric detail emphasized',
  'cinematic two-shot, both adult characters framed clearly with balanced spacing'
];

const ART_STYLES = [
  'photorealistic editorial photography, natural skin texture, high-end retouching',
  'cinematic film still, 35mm lens feel, dramatic color grading',
  'luxury fashion magazine cover, polished styling, premium composition',
  'fine-art boudoir photography, elegant shadows, restrained sensuality',
  'classic oil painting realism, soft brush texture, museum portrait lighting',
  'baroque-inspired portrait, rich contrast, ornate visual atmosphere',
  'neo-noir photography, deep shadows, neon rim light, moody tension',
  'soft pastel illustration, dreamy colors, delicate linework',
  'anime key visual style, clean rendering, expressive eyes, cinematic background',
  'manga cover illustration, sharp line art, dramatic screentone depth',
  'semi-realistic digital painting, painterly edges, detailed anatomy',
  'high-fashion runway editorial, bold silhouette, glossy styling',
  'vintage film photography, subtle grain, warm faded tones',
  'polaroid-inspired intimate snapshot, soft flash, nostalgic mood',
  'surreal dreamscape art, symbolic props, floating atmosphere',
  'cyberpunk neon illustration, reflective surfaces, futuristic palette',
  'dark gothic romance, velvet shadows, silver highlights, dramatic styling',
  'minimalist studio portrait, clean backdrop, precise body lines',
  'romantic watercolor wash, translucent layers, gentle color bleeding',
  'Art Nouveau poster style, flowing ornamental lines, elegant framing',
  'Art Deco glamour, geometric framing, gold accents, sleek luxury',
  'Renaissance portrait mood, balanced composition, soft sfumato lighting',
  'impressionist light study, visible strokes, luminous color vibration',
  'hyper-detailed 3D render, cinematic materials, realistic fabric simulation',
  'soft glam beauty campaign, luminous makeup, creamy highlights',
  'editorial black-and-white photography, sculptural contrast, timeless mood',
  'high-key angelic studio style, bright airy tones, soft exposure',
  'low-key dramatic portrait, black background, focused rim lighting',
  'Korean webtoon illustration, smooth shading, stylish character design',
  'Japanese visual novel CG style, polished lighting, emotional framing',
  'fantasy character art, ornate costume details, magical ambience',
  'mythic goddess illustration, radiant aura, heroic scale',
  'luxury perfume advertisement, sensual elegance, glossy product-like finish',
  'music video frame, dynamic colored lights, performance energy',
  'fashion lookbook photography, clean poses, precise garment detail',
  'architectural interior editorial, strong lines, refined spatial composition',
  'romantic candlelit realism, warm glow, textured shadows',
  'rainy-night cinematic photography, reflections, blue-orange contrast',
  'soft-focus glamour photography, gentle bloom, polished skin highlights',
  'documentary-style intimate portrait, natural framing, believable emotion',
  'ethereal fantasy realism, mist, glow particles, delicate atmosphere',
  'retro 1980s neon poster, saturated colors, graphic lighting',
  'Y2K glossy digital art, chrome accents, playful luxury',
  'high-detail concept art, cinematic composition, clear focal hierarchy',
  'premium AI portrait style, crisp details, balanced realism and fantasy',
  'storybook romantic illustration, warm palette, graceful shapes',
  'monochrome ink wash, expressive brushwork, elegant negative space',
  'sculptural marble statue aesthetic, smooth forms, gallery lighting',
  'red-carpet celebrity editorial, confident pose, flash-lit glamour',
  'ultra-clean commercial render, sharp focus, production-ready prompt style'
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
  poses: [
    '站姿回眸，肩線放鬆，髖部自然轉向鏡頭', '坐在床沿，雙腿交錯，手指整理衣料', '跪坐在柔軟床面，背部挺直，視線看向鏡頭', '側躺支撐上身，腰線與腿部形成流暢曲線', '仰躺伸展，手臂自然上舉，表情放鬆',
    '俯身靠近鏡頭，髮絲垂落，眼神集中', '倚靠牆面，一膝微彎，身體形成 S 型線條', '坐在椅上反跨椅背，肩頸線條清楚', '雙人面對面站立，額頭相近，手掌輕扶腰側', '雙人坐姿相擁，肢體重疊但輪廓清楚',
    '雙人一坐一站，形成高低差與視線牽引', '背後擁抱姿勢，雙方明確成年且合意', '膝上依偎姿勢，表情親密，構圖穩定', '沙發斜躺姿勢，手肘支撐，腿部延伸', '浴缸邊緣坐姿，肩線與鎖骨被光線勾勒',
    '落地窗前站姿，手扶窗框，背光描出輪廓', '鏡前整理服裝姿勢，反射增加畫面層次', '床上盤腿坐姿，身體微微前傾', '跪姿前傾，手掌撐在床面或沙發上', '側坐回頭，裙擺或布料沿腿部垂落',
    '雙人並肩躺臥，手部互相靠近，視線交會', '雙人剪影貼近，動作含蓄而張力明顯', '舞台中央站姿，雙臂自然展開，衣料被風吹動', '柱廊旁倚靠姿勢，身體與建築線條平行', '長袍滑落肩頭的整理姿勢，保留藝術留白',
    '坐在地毯上後仰支撐，腿部自然彎曲', '趴臥在枕邊，臉部靠近前景，眼神柔軟', '半跪拾起布料姿勢，手部與布料成為焦點', '雙人指尖相扣，身體距離接近但構圖優雅', '雙人互相整理衣領或肩帶，動作自然可信',
    '站在門邊回身，手扶門框，視線邀請式但合意', '樓梯坐姿，一腿高一腿低，形成層次', '吧台前側坐，手肘靠桌，肩膀微轉', '浴袍半披站姿，腰帶與布料動態清楚', '床邊低頭微笑，手指撫過髮絲',
    '雙人額頭相抵，閉眼呼吸同步，情緒親密', '雙人一前一後站位，前景人物回眸', '躺椅上伸展姿勢，身體線條完整可讀', '窗簾後半遮姿勢，透光布料創造層次', '坐姿交疊手臂，表情冷靜自信',
    '跪坐整理長髮，背部曲線與髮絲成為主視覺', '站姿拉起手套或袖口，動作帶有儀式感', '半身前傾靠在桌邊，肩頸與手部清楚', '雙人背靠背坐姿，視線分別看向兩側', '雙人手臂環抱肩背，重心穩定且自然',
    '地面側躺構圖，布料鋪展成視覺引導線', '沙發扶手上倚坐，腿部斜向畫面角落', '床幔間探身姿勢，前景薄紗柔化輪廓', '站姿抬手觸碰耳環或髮飾，臉部精緻清楚', '雙人慢舞般貼近，手扶肩背與腰側，姿態優雅'
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

function validateOptionalConditions(input) {
  const conditions = normalizeInput(input);

  if (!conditions) {
    return { ok: true, conditions: '' };
  }

  const blocked = BLOCKED_PATTERNS.find(({ pattern }) => pattern.test(conditions));
  if (blocked) {
    return { ok: false, reason: blocked.reason };
  }

  return { ok: true, conditions };
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

  const customConditionValidation = validateOptionalConditions(options.customConditions);
  if (!customConditionValidation.ok) {
    return {
      ok: false,
      prompt: '',
      reason: customConditionValidation.reason
    };
  }

  const intensity = INTENSITY_WORDS[options.intensity] ? options.intensity : 'medium';
  const lighting = LIGHTING_DESCRIPTIONS.includes(options.lighting) ? options.lighting : LIGHTING_DESCRIPTIONS[0];
  const camera = CAMERA_ANGLES.includes(options.camera) ? options.camera : CAMERA_ANGLES[0];
  const artStyle = ART_STYLES.includes(options.artStyle) ? options.artStyle : ART_STYLES[0];
  const face = getOptionValue('faces', options.face) || CUSTOMIZATION_OPTIONS.faces[0];
  const outfit = getOptionValue('outfits', options.outfit) || CUSTOMIZATION_OPTIONS.outfits[0];
  const count = getOptionValue('counts', options.count) || CUSTOMIZATION_OPTIONS.counts[0];
  const scene = getOptionValue('scenes', options.scene) || CUSTOMIZATION_OPTIONS.scenes[0];
  const pose = getOptionValue('poses', options.pose) || CUSTOMIZATION_OPTIONS.poses[0];

  const intensity = INTENSITY_WORDS[options.intensity] ? options.intensity : 'medium';
  let rewritten = validation.prompt;

  for (const { pattern, replacement } of PHRASE_RULES) {
    rewritten = rewritten.replace(pattern, replacement);
  }

  return {
    ok: true,
    prompt: [
      `subject/action: ${rewritten}`,
      `face: ${face}`,
      `outfit: ${outfit}`,
      `character count/composition: ${count}`,
      `scene: ${scene}`,
      `lighting: ${lighting}`,
      `camera angle: ${camera}`,
      `art style: ${artStyle}`,
      `body pose/posture: ${pose}`,
      `tone: ${DEFAULT_STYLE.tone}`,
      `intensity: ${INTENSITY_WORDS[intensity]}`,
      `quality: ${DEFAULT_STYLE.quality}`,
      `safety: ${DEFAULT_STYLE.safety}`,
      customConditionValidation.conditions ? `custom conditions: ${customConditionValidation.conditions}` : ''
    ].filter(Boolean).join(', '),
      rewritten,
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
    CAMERA_ANGLES,
    ART_STYLES,
    CUSTOMIZATION_OPTIONS
    BLOCKED_PATTERNS
  };
}

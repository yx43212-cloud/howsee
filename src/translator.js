const DEFAULT_STYLE = {
  tone: 'cinematic, sensual, adult-only',
  quality: 'high-detail, tasteful composition, coherent non-conflicting prompt elements',
  safety: 'all characters are clearly 18+, consenting adults; no coercion, no minors'
};

const BLOCKED_PATTERNS = [
  { pattern: /未成年|幼|蘿莉|正太|學生|校服|child|minor|teen|underage/i, reason: '內容疑似涉及未成年人。' },
  { pattern: /強迫|迷姦|下藥|昏迷|睡著|無意識|rape|forced|drugged|unconscious/i, reason: '內容疑似涉及非合意或無法同意情境。' },
  { pattern: /偷拍|偷窺|未同意|voyeur|hidden camera/i, reason: '內容疑似涉及未同意拍攝或偷窺。' },
  { pattern: /血|虐殺|肢解|重傷|blood|gore|dismember/i, reason: '內容疑似涉及血腥暴力。' }
];

const PHRASE_RULES = [
  { pattern: /脫衣服|脫掉衣服|把衣服脫掉|脫光/g, replacement: 'fabric sliding and being gently opened, gradually revealing adult body contours' },
  { pattern: /撕衣服|撕開衣服|扯破衣服/g, replacement: 'torn fabric edges in motion, adult skin contours revealed through tasteful composition' },
  { pattern: /親吻|接吻|喇舌/g, replacement: 'passionate kissing, close breathing, intimate consenting adult eye contact' },
  { pattern: /撫摸|摸|揉/g, replacement: 'fingertips tracing adult body curves, gentle pressure, suggestive consensual touch' },
  { pattern: /自慰|自我安慰/g, replacement: 'private adult sensual mood, soft breathing, hands placed suggestively near the body' },
  { pattern: /做愛|性交|性行為|%%/g, replacement: 'consenting adult intimate entanglement, close body posture, strong erotic tension without coercion' },
  { pattern: /高潮|射精/g, replacement: 'sensory climax mood, trembling posture, dazed expression, rapid breathing' },
  { pattern: /裸|裸體|全裸/g, replacement: 'unclothed adult figure contours presented through tasteful composition and skin texture' }
];


const CHINESE_PHRASE_RULES = [
  { pattern: /脫衣服|脫掉衣服|把衣服脫掉|脫光/g, replacement: '布料滑落與被拉開的動態、逐步展露成年身體輪廓' },
  { pattern: /撕衣服|撕開衣服|扯破衣服/g, replacement: '布料邊緣拉開飛散，以構圖呈現成年肌膚輪廓' },
  { pattern: /親吻|接吻|喇舌/g, replacement: '熱烈親吻、近距離呼吸與合意成人眼神' },
  { pattern: /撫摸|摸|揉/g, replacement: '指尖沿成年身體曲線游移、溫柔按壓與曖昧碰觸' },
  { pattern: /自慰|自我安慰/g, replacement: '私密獨處的成人感官氛圍、輕柔呼吸與暗示性手部位置' },
  { pattern: /做愛|性交|性行為|%%/g, replacement: '合意成人之間的親密交纏、緊貼姿態與強烈情慾張力' },
  { pattern: /高潮|射精/g, replacement: '感官達到高峰的氛圍、顫抖姿態、迷離表情與急促呼吸' },
  { pattern: /裸|裸體|全裸/g, replacement: '未著衣的成年人體輪廓，以構圖與質感呈現' }
];

const INTENSITY_WORDS = {
  soft: 'soft sensuality, artistic restraint, suggestive negative space',
  medium: 'clear erotic tension, closer body language, richer visual detail',
  strong: 'intense adult-only sensual mood, direct body language and expression, within consent and safety boundaries'
};

const LIGHTING_DESCRIPTIONS = [
  { zh: '左側柔和主光，右側淡陰影', en: 'soft key light from the left, subtle shadow on the right' },
  { zh: '右側柔和主光，左側淡陰影', en: 'soft key light from the right, subtle shadow on the left' },
  { zh: '正上方頂光，肩頸輪廓清楚', en: 'direct top light, clear shoulder and neck contours' },
  { zh: '正面柔光，臉部均勻明亮', en: 'front soft light, evenly bright facial detail' },
  { zh: '背後逆光，形成清楚邊緣光', en: 'backlight from behind, clear rim-light outline' },
  { zh: '左後方逆光，髮絲有亮邊', en: 'back-left rim light, bright edge highlights on hair' },
  { zh: '右後方逆光，側臉有亮邊', en: 'back-right rim light, bright edge highlights on the side profile' },
  { zh: '左上四十五度主光，陰影自然', en: 'upper-left 45-degree key light, natural dimensional shadows' },
  { zh: '右上四十五度主光，陰影自然', en: 'upper-right 45-degree key light, natural dimensional shadows' },
  { zh: '下方低角度補光，陰影輕微托亮', en: 'low fill light from below, gently lifted shadows' },
  { zh: '左右雙側夾光，身形兩側細亮邊', en: 'dual side rim lights, thin highlights along both body edges' },
  { zh: '大面積柔箱光，皮膚質感乾淨', en: 'large softbox light, clean and smooth skin texture' },
  { zh: '窄束聚光，焦點集中於臉與手', en: 'narrow spotlight focused on face and hands' },
  { zh: '柔和環形光，圓形反射高光', en: 'soft ring light with circular reflective highlights' },
  { zh: '高反差硬光，陰影邊界銳利', en: 'high-contrast hard light with sharp shadow edges' },
  { zh: '低反差柔光，陰影過渡平滑', en: 'low-contrast soft light with smooth shadow transitions' },
  { zh: '左側冷光右側暖光，色溫對比', en: 'cool light from the left and warm light from the right, color-temperature contrast' },
  { zh: '右側冷光左側暖光，色溫對比', en: 'cool light from the right and warm light from the left, color-temperature contrast' },
  { zh: '微弱輪廓光，主體前方柔亮', en: 'subtle rim light with softly lit front details' },
  { zh: '全局漫射光，沒有明顯硬陰影', en: 'global diffused light with no obvious hard shadows' },
  { zh: '高調亮白光，曝光清透乾淨', en: 'high-key bright white light with clean airy exposure' },
  { zh: '低調暗面光，亮部集中明確', en: 'low-key directional light with concentrated highlights' },
  { zh: '暖金色柔光，膚色溫潤', en: 'warm golden soft light with flattering skin warmth' },
  { zh: '冷藍色柔光，膚色清冷', en: 'cool blue soft light with a crisp skin tone' },
  { zh: '粉色柔光，邊緣帶淡粉暈染', en: 'pink soft light with gentle rosy edge bloom' },
  { zh: '紫色側光，陰影帶神祕色調', en: 'purple side light with mysterious tinted shadows' },
  { zh: '青綠補光，暗部保留彩色層次', en: 'teal fill light preserving colorful shadow depth' },
  { zh: '琥珀主光，亮部柔暖', en: 'amber key light with soft warm highlights' },
  { zh: '銀白冷硬光，線條俐落', en: 'silver-white crisp light with clean sharp lines' },
  { zh: '珍珠霧面柔光，反差極低', en: 'pearl-matte soft light with very low contrast' },
  { zh: '散射晨白光，亮暗過渡細膩', en: 'diffused pale white light with delicate tonal transitions' },
  { zh: '蜂巢格控光，亮區集中不溢散', en: 'grid-controlled light with a tight contained highlight area' },
  { zh: '條狀側光，身體線條被拉長', en: 'strip side light elongating the body line' },
  { zh: '切割光影，局部亮面幾何分明', en: 'cut light pattern with crisp geometric highlight areas' },
  { zh: '柔亮反射補光，暗部細節可見', en: 'soft reflected fill light revealing shadow details' },
  { zh: '瞳孔高光補光，反射點清楚', en: 'eye fill light with clear catchlights in the pupils' },
  { zh: '髮頂亮光，頭髮層次分明', en: 'hair light from above creating separated hair layers' },
  { zh: '肩線輪廓光，肩背邊緣明確', en: 'shoulder rim light defining the shoulder and back edges' },
  { zh: '輪廓反差光，外緣明亮內側柔暗', en: 'rim-contrast light with bright outer edges and soft inner shadows' },
  { zh: '均勻受控燈光，細節完整清晰', en: 'even controlled lighting with complete crisp detail' },
  { zh: '單點主光，畫面焦點簡潔', en: 'single key light creating a clean visual focal point' },
  { zh: '雙點主補光，臉部與身形平衡', en: 'two-point key-and-fill lighting balancing face and body' },
  { zh: '三點布光，主補背光分明', en: 'three-point lighting with distinct key, fill, and back light' },
  { zh: '柔和漸層光，亮度由左至右下降', en: 'soft gradient light fading from left to right' },
  { zh: '柔和漸層光，亮度由右至左下降', en: 'soft gradient light fading from right to left' },
  { zh: '頂部柔罩光，頭髮與肩線輕亮', en: 'overhead diffused light softly brightening hair and shoulders' },
  { zh: '斜向窄光，臉部與鎖骨被勾勒', en: 'diagonal narrow light sculpting face and collarbone' },
  { zh: '柔和閃光，邊界乾淨不刺眼', en: 'soft flash light with clean edges and no harsh glare' },
  { zh: '偏振反射光，皮膚高光受控', en: 'polarized reflected light with controlled skin highlights' },
  { zh: '低飽和色光，整體顏色克制', en: 'low-saturation colored light with restrained overall color' }
];

const CAMERA_ANGLES = [
  { zh: '第一人稱 POV 視角', en: 'first-person POV viewpoint' },
  { zh: '第二人稱對視視角', en: 'second-person eye-contact viewpoint' },
  { zh: '第三人稱旁觀視角', en: 'third-person observer viewpoint' },
  { zh: '蟲視低角視角', en: 'worm-eye low viewpoint' },
  { zh: '鳥瞰高角視角', en: 'bird-eye overhead viewpoint' },
  { zh: '正面視角', en: 'straight-on frontal viewpoint' },
  { zh: '背面視角', en: 'rear viewpoint' },
  { zh: '左側視角', en: 'left-side viewpoint' },
  { zh: '右側視角', en: 'right-side viewpoint' },
  { zh: '左前方四分之三視角', en: 'front-left three-quarter viewpoint' },
  { zh: '右前方四分之三視角', en: 'front-right three-quarter viewpoint' },
  { zh: '左後方四分之三視角', en: 'rear-left three-quarter viewpoint' },
  { zh: '右後方四分之三視角', en: 'rear-right three-quarter viewpoint' },
  { zh: '俯視視角', en: 'top-down viewpoint' },
  { zh: '仰視視角', en: 'upward-looking viewpoint' },
  { zh: '斜俯視角', en: 'diagonal downward viewpoint' },
  { zh: '斜仰視角', en: 'diagonal upward viewpoint' },
  { zh: '眼平視角', en: 'eye-height viewpoint' },
  { zh: '胸口高度視角', en: 'chest-height viewpoint' },
  { zh: '腰部高度視角', en: 'waist-height viewpoint' },
  { zh: '膝部高度視角', en: 'knee-height viewpoint' },
  { zh: '地面貼近視角', en: 'near-ground viewpoint' },
  { zh: '天花板俯看視角', en: 'ceiling-down viewpoint' },
  { zh: '鏡中反射視角', en: 'mirror-reflection viewpoint' },
  { zh: '水面反射視角', en: 'water-reflection viewpoint' },
  { zh: '玻璃反射視角', en: 'glass-reflection viewpoint' },
  { zh: '前景遮擋視角', en: 'foreground-obstructed viewpoint' },
  { zh: '窄縫框景視角', en: 'narrow-gap framed viewpoint' },
  { zh: '圓形框景視角', en: 'circular-framed viewpoint' },
  { zh: '廣角視角', en: 'wide-angle viewpoint' },
  { zh: '長焦視角', en: 'telephoto viewpoint' },
  { zh: '微距細節視角', en: 'macro-detail viewpoint' },
  { zh: '魚眼視角', en: 'fisheye viewpoint' },
  { zh: '等距視角', en: 'isometric viewpoint' },
  { zh: '軸測視角', en: 'axonometric viewpoint' },
  { zh: '肩線高度視角', en: 'shoulder-height viewpoint' },
  { zh: '雙眼水平視角', en: 'binocular-level viewpoint' },
  { zh: '單眼近距視角', en: 'single-eye close viewpoint' },
  { zh: '低平線視角', en: 'low-horizon viewpoint' },
  { zh: '高平線視角', en: 'high-horizon viewpoint' },
  { zh: '中心透視視角', en: 'central-perspective viewpoint' },
  { zh: '一點透視視角', en: 'one-point-perspective viewpoint' },
  { zh: '兩點透視視角', en: 'two-point-perspective viewpoint' },
  { zh: '三點透視視角', en: 'three-point-perspective viewpoint' },
  { zh: '垂直縱深視角', en: 'vertical-depth viewpoint' },
  { zh: '水平縱深視角', en: 'horizontal-depth viewpoint' },
  { zh: '貼近前景視角', en: 'near-foreground viewpoint' },
  { zh: '中距離觀察視角', en: 'mid-distance observing viewpoint' },
  { zh: '遠距離觀察視角', en: 'far-distance observing viewpoint' },
  { zh: '無人機俯瞰視角', en: 'drone-like overhead viewpoint' }
];

const COMPOSITION_STRUCTURES = [
  { zh: '中央對稱構圖', en: 'centered symmetrical composition' },
  { zh: '三分法構圖', en: 'rule-of-thirds composition' },
  { zh: '黃金比例構圖', en: 'golden-ratio composition' },
  { zh: '對角線構圖', en: 'diagonal composition' },
  { zh: 'S 曲線構圖', en: 'S-curve composition' },
  { zh: '三角形構圖', en: 'triangular composition' },
  { zh: '框中框構圖', en: 'frame-within-frame composition' },
  { zh: '前中後景層次構圖', en: 'foreground-midground-background layered composition' },
  { zh: '留白構圖', en: 'negative-space composition' },
  { zh: '滿版構圖', en: 'full-frame composition' },
  { zh: '極簡構圖', en: 'minimal composition' },
  { zh: '密集細節構圖', en: 'dense-detail composition' },
  { zh: '水平線構圖', en: 'horizontal-line composition' },
  { zh: '垂直線構圖', en: 'vertical-line composition' },
  { zh: '引導線構圖', en: 'leading-line composition' },
  { zh: '放射線構圖', en: 'radial-line composition' },
  { zh: '螺旋構圖', en: 'spiral composition' },
  { zh: '交叉構圖', en: 'cross composition' },
  { zh: 'L 型構圖', en: 'L-shaped composition' },
  { zh: 'V 型構圖', en: 'V-shaped composition' },
  { zh: 'Z 型構圖', en: 'Z-shaped composition' },
  { zh: 'X 型構圖', en: 'X-shaped composition' },
  { zh: '圓形構圖', en: 'circular composition' },
  { zh: '橢圓構圖', en: 'oval composition' },
  { zh: '拱形構圖', en: 'arched composition' },
  { zh: '層疊構圖', en: 'stacked-layer composition' },
  { zh: '左右平衡構圖', en: 'left-right balanced composition' },
  { zh: '上下平衡構圖', en: 'top-bottom balanced composition' },
  { zh: '偏心構圖', en: 'off-center composition' },
  { zh: '近大遠小構圖', en: 'near-large far-small depth composition' },
  { zh: '剪影外輪廓構圖', en: 'silhouette-contour composition' },
  { zh: '局部裁切構圖', en: 'cropped-detail composition' },
  { zh: '半身肖像構圖', en: 'half-body portrait composition' },
  { zh: '全身肖像構圖', en: 'full-body portrait composition' },
  { zh: '雙人平衡構圖', en: 'two-subject balanced composition' },
  { zh: '三人三角構圖', en: 'three-subject triangle composition' },
  { zh: '多層遮擋構圖', en: 'multi-layer occlusion composition' },
  { zh: '鏡像對稱構圖', en: 'mirror-symmetry composition' },
  { zh: '動態留白構圖', en: 'motion-negative-space composition' },
  { zh: '視線引導構圖', en: 'gaze-leading composition' },
  { zh: '手部焦點構圖', en: 'hand-focused composition' },
  { zh: '服裝輪廓構圖', en: 'outfit-silhouette composition' },
  { zh: '身形輪廓構圖', en: 'body-contour composition' },
  { zh: '低重心構圖', en: 'low-center-of-gravity composition' },
  { zh: '高重心構圖', en: 'high-center-of-gravity composition' },
  { zh: '開放式構圖', en: 'open composition' },
  { zh: '封閉式構圖', en: 'closed composition' },
  { zh: '電影寬銀幕構圖', en: 'cinematic widescreen composition' },
  { zh: '直式海報構圖', en: 'vertical poster composition' },
  { zh: '社群封面構圖', en: 'social-cover composition' }
];

const ART_STYLES = [
  { zh: '電影劇照風', en: 'cinematic still frame, dramatic composition, filmic color grading' },
  { zh: '高級雜誌寫真風', en: 'premium editorial photography, refined styling, glossy finish' },
  { zh: '精品時尚封面風', en: 'luxury fashion magazine cover, polished styling, premium composition' },
  { zh: '高級閨房寫真風', en: 'fine-art boudoir photography, elegant shadows, restrained sensuality' },
  { zh: '古典油畫寫實風', en: 'classic oil painting realism, soft brush texture, museum portrait lighting' },
  { zh: '巴洛克肖像風', en: 'baroque-inspired portrait, rich contrast, ornate visual atmosphere' },
  { zh: '新黑色電影風', en: 'neo-noir photography, deep shadows, moody tension' },
  { zh: '柔和粉彩插畫風', en: 'soft pastel illustration, dreamy colors, delicate linework' },
  { zh: '日系動畫主視覺風', en: 'anime key visual style, clean rendering, expressive eyes' },
  { zh: '漫畫封面風', en: 'manga cover illustration, sharp line art, dramatic screentone depth' },
  { zh: '半寫實數位繪畫風', en: 'semi-realistic digital painting, painterly edges, detailed anatomy' },
  { zh: '高級伸展台時尚風', en: 'high-fashion runway editorial, bold silhouette, glossy styling' },
  { zh: '復古底片攝影風', en: 'vintage film photography, subtle grain, warm faded tones' },
  { zh: '拍立得親密快照風', en: 'polaroid-inspired intimate snapshot, soft flash, nostalgic mood' },
  { zh: '超現實夢境藝術風', en: 'surreal dreamscape art, symbolic props, floating atmosphere' },
  { zh: '賽博龐克霓虹風', en: 'cyberpunk neon illustration, reflective surfaces, futuristic palette' },
  { zh: '黑暗哥德浪漫風', en: 'dark gothic romance, velvet shadows, silver highlights' },
  { zh: '極簡棚拍肖像風', en: 'minimalist studio portrait, clean backdrop, precise body lines' },
  { zh: '浪漫水彩風', en: 'romantic watercolor wash, translucent layers, gentle color bleeding' },
  { zh: '新藝術海報風', en: 'Art Nouveau poster style, flowing ornamental lines, elegant framing' },
  { zh: '裝飾藝術奢華風', en: 'Art Deco glamour, geometric framing, gold accents, sleek luxury' },
  { zh: '文藝復興肖像氛圍', en: 'Renaissance portrait mood, balanced composition, soft sfumato lighting' },
  { zh: '印象派光影研究風', en: 'impressionist light study, visible strokes, luminous color vibration' },
  { zh: '高細節 3D 渲染風', en: 'hyper-detailed 3D render, cinematic materials, realistic fabric simulation' },
  { zh: '柔焦美妝廣告風', en: 'soft glam beauty campaign, luminous makeup, creamy highlights' },
  { zh: '黑白時尚攝影風', en: 'editorial black-and-white photography, sculptural contrast, timeless mood' },
  { zh: '高亮柔白棚拍風', en: 'high-key studio style, bright airy tones, soft exposure' },
  { zh: '低調暗背景戲劇肖像風', en: 'low-key dramatic portrait, dark background, focused rim lighting' },
  { zh: '韓系 Webtoon 插畫風', en: 'Korean webtoon illustration, smooth shading, stylish character design' },
  { zh: '日系視覺小說 CG 風', en: 'Japanese visual novel CG style, polished lighting, emotional framing' },
  { zh: '奇幻角色設計風', en: 'fantasy character art, ornate costume details, magical ambience' },
  { zh: '神話女神插畫風', en: 'mythic goddess illustration, radiant aura, heroic scale' },
  { zh: '精品香水廣告風', en: 'luxury perfume advertisement, sensual elegance, glossy finish' },
  { zh: '音樂錄影帶畫面風', en: 'music video frame, dynamic colored lights, performance energy' },
  { zh: '時裝型錄攝影風', en: 'fashion lookbook photography, clean poses, precise garment detail' },
  { zh: '建築室內雜誌風', en: 'architectural interior editorial, strong lines, refined spatial composition' },
  { zh: '浪漫燭光寫實風', en: 'romantic warm-glow realism, textured shadows' },
  { zh: '雨夜電影攝影風', en: 'rainy-night cinematic photography, reflections, blue-orange contrast' },
  { zh: '柔焦魅力攝影風', en: 'soft-focus glamour photography, gentle bloom, polished skin highlights' },
  { zh: '紀實親密肖像風', en: 'documentary-style intimate portrait, natural framing, believable emotion' },
  { zh: '空靈奇幻寫實風', en: 'ethereal fantasy realism, delicate atmosphere' },
  { zh: '復古 80 年代霓虹海報風', en: 'retro 1980s neon poster, saturated colors, graphic lighting' },
  { zh: 'Y2K 亮面數位藝術風', en: 'Y2K glossy digital art, chrome accents, playful luxury' },
  { zh: '高細節概念美術風', en: 'high-detail concept art, cinematic composition, clear focal hierarchy' },
  { zh: '高級 AI 肖像風', en: 'premium AI portrait style, crisp details, balanced realism and fantasy' },
  { zh: '浪漫故事書插畫風', en: 'storybook romantic illustration, warm palette, graceful shapes' },
  { zh: '單色水墨風', en: 'monochrome ink wash, expressive brushwork, elegant negative space' },
  { zh: '大理石雕像美學風', en: 'sculptural marble statue aesthetic, smooth forms, gallery lighting' },
  { zh: '紅毯明星雜誌風', en: 'red-carpet celebrity editorial, confident pose, flash-lit glamour' },
  { zh: '超乾淨商業渲染風', en: 'ultra-clean commercial render, sharp focus, production-ready prompt style' }
];

function option(zh, en, rarity = '') {
  return { zh, en, rarity };
}

const AI_OPTION = option('AI判斷', 'AI decides the most compatible option from the full prompt context', 'ai');

const GENDER_OPTIONS = [
  option('女性成人', 'adult woman'),
  option('男性成人', 'adult man'),
  option('非二元成人', 'non-binary adult'),
  option('雌雄同體幻想成人', 'androgynous fantasy adult', 'rare'),
  option('可自訂性別呈現的成人', 'adult with customizable gender presentation', 'rare')
];

const dailyRacePairs = [
  ['人類', 'human'], ['東亞成人', 'East Asian adult'], ['東南亞成人', 'Southeast Asian adult'], ['南亞成人', 'South Asian adult'], ['中亞成人', 'Central Asian adult'],
  ['西亞成人', 'West Asian adult'], ['北非成人', 'North African adult'], ['西非成人', 'West African adult'], ['東非成人', 'East African adult'], ['南非成人', 'Southern African adult'],
  ['歐洲成人', 'European adult'], ['北歐成人', 'Northern European adult'], ['南歐成人', 'Southern European adult'], ['東歐成人', 'Eastern European adult'], ['拉丁裔成人', 'Latine adult'],
  ['加勒比成人', 'Caribbean adult'], ['原住民成人', 'Indigenous adult'], ['太平洋島民成人', 'Pacific Islander adult'], ['混血成人', 'mixed-heritage adult'], ['都會人類成人', 'urban human adult'],
  ['鄉村人類成人', 'rural human adult'], ['島嶼人類成人', 'island human adult'], ['沙漠人類成人', 'desert-region human adult'], ['高原人類成人', 'highland human adult'], ['海岸人類成人', 'coastal human adult'],
  ['森林聚落人類成人', 'forest-settlement human adult'], ['北境人類成人', 'northern-region human adult'], ['南境人類成人', 'southern-region human adult'], ['草原人類成人', 'grassland human adult'], ['港都人類成人', 'harbor-city human adult'],
  ['學院派成人', 'scholarly adult human'], ['藝術家成人', 'artist adult human'], ['運動型成人', 'athletic adult human'], ['商務型成人', 'business-styled adult human'], ['旅行者成人', 'traveler adult human'],
  ['貴族氣質成人', 'aristocratic adult human'], ['街頭風成人', 'street-style adult human'], ['古典氣質成人', 'classic-elegant adult human'], ['摩登氣質成人', 'modern-chic adult human'], ['自然系成人', 'natural-style adult human'],
  ['冷豔氣質成人', 'cool-glam adult human'], ['甜美氣質成人', 'sweet-glam adult human'], ['成熟氣質成人', 'mature-elegant adult human'], ['神祕氣質成人', 'mysterious adult human'], ['溫柔氣質成人', 'gentle adult human'],
  ['強勢氣質成人', 'commanding adult human'], ['自由奔放成人', 'free-spirited adult human'], ['精緻都會成人', 'polished metropolitan adult human'], ['復古氣質成人', 'retro-styled adult human'], ['極簡氣質成人', 'minimalist adult human']
];

const rareRacePairs = [
  ['精靈族', 'elf'], ['暗精靈族', 'dark elf'], ['半精靈族', 'half-elf'], ['天使族', 'angelic race'], ['惡魔族', 'demon race'],
  ['魅魔族', 'succubus-like fantasy adult'], ['龍裔族', 'dragonkin'], ['狐族獸人', 'fox kemonomimi adult'], ['貓族獸人', 'cat kemonomimi adult'], ['狼族獸人', 'wolf kemonomimi adult'],
  ['兔族獸人', 'rabbit kemonomimi adult'], ['鹿角族', 'antlered fantasy adult'], ['蛇裔族', 'serpentine fantasy adult'], ['人魚族', 'merfolk adult'], ['海妖族', 'siren fantasy adult'],
  ['吸血族', 'vampire adult'], ['半吸血族', 'dhampir adult'], ['妖精族', 'fae adult'], ['花精族', 'floral fae adult'], ['月靈族', 'moon spirit adult'],
  ['星靈族', 'star spirit adult'], ['機械人偶族', 'android doll adult'], ['仿生人族', 'synthetic humanoid adult'], ['賽博改造族', 'cybernetic enhanced adult'], ['水晶族', 'crystal humanoid adult'],
  ['幽影族', 'shadowborn adult'], ['光翼族', 'light-winged fantasy adult'], ['鳳凰裔族', 'phoenixkin adult'], ['雪女族', 'snow spirit adult'], ['火焰精靈族', 'fire spirit adult'],
  ['水元素族', 'water elemental adult'], ['風元素族', 'air elemental adult'], ['土元素族', 'earth elemental adult'], ['雷元素族', 'storm elemental adult'], ['樹精族', 'dryad adult'],
  ['蘑菇妖精族', 'mushroom fae adult'], ['寶石龍族', 'gem dragonkin adult'], ['銀河旅人族', 'galactic traveler adult'], ['外星貴族族', 'alien noble adult'], ['月兔族', 'moon rabbit fantasy adult'],
  ['黑翼族', 'black-winged fantasy adult'], ['白翼族', 'white-winged fantasy adult'], ['獨角獸裔族', 'unicornkin adult'], ['豹紋獸人族', 'leopard kemonomimi adult'], ['鷹翼族', 'hawk-winged fantasy adult'],
  ['章魚海裔族', 'cephalopod merfolk adult'], ['古神祭司族', 'eldritch priest fantasy adult'], ['夢魘族', 'nightmare fantasy adult'], ['時間旅者族', 'time-traveler fantasy adult'], ['鏡像分身族', 'mirror-double fantasy adult']
];

const RACE_OPTIONS = [
  ...dailyRacePairs.map(([zh, en]) => option(zh, en, 'daily')),
  ...rareRacePairs.map(([zh, en]) => option(zh, en, 'rare'))
];

const EMOTION_OPTIONS = [
  ['自信微笑', 'confident smile'],
  ['害羞臉紅', 'shy blush'],
  ['挑逗眼神', 'teasing gaze'],
  ['沉醉表情', 'entranced expression'],
  ['冷靜凝視', 'calm stare'],
  ['溫柔微笑', 'gentle smile'],
  ['咬唇表情', 'soft lip-biting expression'],
  ['慵懶眼神', 'languid eyes'],
  ['驚喜睜眼', 'pleasantly surprised eyes'],
  ['渴望神情', 'yearning expression'],
  ['陶醉閉眼', 'blissful closed eyes'],
  ['俏皮眨眼', 'playful wink'],
  ['高傲抬眉', 'proud raised brow'],
  ['迷離眼神', 'dreamy unfocused gaze'],
  ['安定放鬆', 'relaxed composure'],
  ['羞怯低頭', 'bashful lowered gaze'],
  ['熱烈注視', 'intense direct gaze'],
  ['若有所思', 'thoughtful mood'],
  ['甜美撒嬌', 'sweet affectionate expression'],
  ['克制忍耐', 'restrained longing'],
  ['滿足微喘', 'satisfied breathless mood'],
  ['神祕淺笑', 'mysterious half-smile'],
  ['專注凝神', 'focused concentration'],
  ['柔軟依戀', 'soft attachment'],
  ['放肆大笑', 'unrestrained laugh'],
  ['倔強抿唇', 'stubborn pressed lips'],
  ['期待眼神', 'expectant gaze'],
  ['迷人側笑', 'charming side smile'],
  ['平靜挑釁', 'calm provocation'],
  ['深情凝望', 'deep affectionate gaze'],
  ['雀躍期待', 'sparkling anticipation'],
  ['嫵媚挑眉', 'alluring raised eyebrow'],
  ['壓抑喘息', 'restrained breathless expression'],
  ['撒嬌委屈', 'affectionately pouty expression'],
  ['危險微笑', 'dangerous subtle smile'],
  ['沉穩支配感', 'calm dominant presence'],
  ['被寵溺的放鬆', 'pampered relaxed expression'],
  ['羞澀偷看', 'bashful side glance'],
  ['熱戀黏膩感', 'clingy lovestruck mood'],
  ['清醒誘惑', 'clear-headed temptation'],
  ['微醺迷人', 'slightly tipsy charm'],
  ['冷豔挑釁', 'cool glamorous provocation'],
  ['柔弱求抱', 'soft longing for embrace'],
  ['得意壞笑', 'smug mischievous grin'],
  ['安靜臣服感', 'quiet yielding mood'],
  ['主導邀請感', 'leading invitational expression'],
  ['被注視的緊張', 'nervousness under attention'],
  ['滿眼愛意', 'eyes full of affection'],
  ['曖昧停頓', 'ambiguous pause'],
  ['放鬆信任', 'relaxed trust']
].map(([zh, en]) => option(zh, en));

const EXPRESSION_OPTIONS = EMOTION_OPTIONS;

const TIME_POINTS = [
  { zh: '清晨 5 點', en: '5 AM early morning' },
  { zh: '早晨 7 點', en: '7 AM morning freshness' },
  { zh: '上午 9 點', en: '9 AM clean daytime clarity' },
  { zh: '上午 11 點', en: '11 AM bright daytime balance' },
  { zh: '中午 12 點', en: '12 PM midday clarity' },
  { zh: '下午 2 點', en: '2 PM relaxed afternoon mood' },
  { zh: '下午 4 點', en: '4 PM soft afternoon depth' },
  { zh: '傍晚 5 點', en: '5 PM golden-hour softness' },
  { zh: '傍晚 6 點', en: '6 PM dusk transition' },
  { zh: '晚上 8 點', en: '8 PM evening intimacy' },
  { zh: '晚上 10 點', en: '10 PM late-evening quietness' },
  { zh: '午夜 12 點', en: '12 AM midnight mood' },
  { zh: '凌晨 1 點', en: '1 AM after-midnight stillness' },
  { zh: '凌晨 3 點', en: '3 AM quiet late-night atmosphere' },
  { zh: '雨後清晨', en: 'morning after rain' },
  { zh: '午後休息時刻', en: 'afternoon break moment' },
  { zh: '黃昏交界', en: 'twilight transition' },
  { zh: '夜深人靜', en: 'deep quiet night' },
  { zh: '週末午後', en: 'weekend afternoon' },
  { zh: '節日前夜', en: 'holiday eve' }
];

const FACE_OPTIONS = [
  ['成熟鵝蛋臉', 'mature oval face'], ['精緻瓜子臉', 'delicate V-shaped face'], ['柔和圓臉', 'soft round face'], ['高顴骨冷豔臉', 'striking high-cheekbone face'], ['深邃立體臉', 'deep sculpted facial structure'],
  ['甜美梨形臉', 'sweet pear-shaped face'], ['英氣方臉', 'handsome square face'], ['貓系上挑眼臉', 'catlike upturned-eye face'], ['狐狸系狹長眼臉', 'foxlike narrow-eye face'], ['娃娃感大眼臉', 'doll-like large-eye face'],
  ['混血立體五官臉', 'mixed-heritage sculpted features'], ['古典東方美人臉', 'classic East Asian beauty face'], ['歐美輪廓名模臉', 'Western editorial model facial structure'], ['中性俐落臉', 'androgynous sharp face'], ['溫柔姐姐系臉', 'gentle mature beauty face'],
  ['冷淡厭世臉', 'cool detached face'], ['熱情明亮臉', 'warm radiant face'], ['小鹿眼清純感成人臉', 'doe-eyed innocent-looking adult face'], ['濃顏艷麗臉', 'bold glamorous face'], ['淡顏清透臉', 'subtle translucent face'],
  ['短髮俐落臉', 'short-haired crisp face framing'], ['長髮柔順臉', 'long-haired soft face framing'], ['捲髮復古臉', 'curly-haired retro face framing'], ['濕髮性感臉', 'wet-hair sensual face framing'], ['高馬尾精神臉', 'high-ponytail energetic face framing'],
  ['厚唇魅惑臉', 'full-lipped alluring face'], ['薄唇冷感臉', 'thin-lipped cool face'], ['酒窩甜笑臉', 'dimpled sweet-smile face'], ['雀斑自然臉', 'natural freckled face'], ['痣點魅力臉', 'beauty-mark accented face']
].map(([zh, en]) => option(zh, en));


const OCCUPATION_OPTIONS = [
  option('時尚模特', 'fashion model'),
  option('攝影師', 'photographer'),
  option('調香師', 'perfumer'),
  option('珠寶設計師', 'jewelry designer'),
  option('舞者', 'dancer'),
  option('酒吧調酒師', 'bartender'),
  option('鋼琴家', 'pianist'),
  option('小提琴家', 'violinist'),
  option('畫家', 'painter'),
  option('雕塑家', 'sculptor'),
  option('服裝設計師', 'fashion designer'),
  option('造型師', 'stylist'),
  option('化妝師', 'makeup artist'),
  option('演員', 'actor'),
  option('歌手', 'singer'),
  option('主播', 'host'),
  option('作家', 'writer'),
  option('編輯', 'editor'),
  option('建築師', 'architect'),
  option('室內設計師', 'interior designer'),
  option('律師', 'lawyer'),
  option('醫師', 'doctor'),
  option('護理師', 'nurse'),
  option('企業主管', 'executive'),
  option('秘書', 'secretary'),
  option('咖啡師', 'barista'),
  option('甜點師', 'pastry chef'),
  option('廚師', 'chef'),
  option('花藝師', 'florist'),
  option('瑜伽教練', 'yoga instructor'),
  option('健身教練', 'fitness trainer'),
  option('游泳教練', 'swim coach'),
  option('賽車手', 'race driver'),
  option('空服員', 'flight attendant'),
  option('旅店經理', 'hotel manager'),
  option('圖書館員', 'librarian'),
  option('研究員', 'researcher'),
  option('教授', 'professor'),
  option('魔術師', 'magician'),
  option('偵探', 'detective'),
  option('特務', 'agent'),
  option('騎士', 'knight'),
  option('女王', 'queen'),
  option('祭司', 'priestess'),
  option('魔法師', 'mage'),
  option('星艦艦長', 'starship captain'),
  option('仿生人工程師', 'android engineer'),
  option('占星師', 'astrologer'),
  option('古董商', 'antique dealer'),
  option('花園管理者', 'garden curator')
];

const BODY_PROPORTION_OPTIONS = [
  option('均衡修長比例', 'balanced slender proportions'),
  option('高挑九頭身比例', 'tall nine-head proportions'),
  option('嬌小成年比例', 'petite adult proportions'),
  option('沙漏曲線比例', 'hourglass proportions'),
  option('梨形曲線比例', 'pear-shaped proportions'),
  option('倒三角比例', 'inverted-triangle proportions'),
  option('運動型比例', 'athletic proportions'),
  option('柔軟豐潤比例', 'soft voluptuous proportions'),
  option('寬肩窄腰比例', 'broad-shoulder narrow-waist proportions'),
  option('窄肩柔和比例', 'narrow-shoulder soft proportions'),
  option('長腿短身比例', 'long-leg short-torso proportions'),
  option('長身修腿比例', 'long-torso refined-leg proportions'),
  option('自然肉感比例', 'natural curvy proportions'),
  option('纖細骨感比例', 'slender delicate proportions'),
  option('健美線條比例', 'toned fitness proportions'),
  option('古典雕像比例', 'classic statue proportions'),
  option('圓潤可愛比例', 'rounded cute adult proportions'),
  option('冷豔名模比例', 'cool editorial model proportions'),
  option('成熟豐滿比例', 'mature full-figure proportions'),
  option('輕盈舞者比例', 'light dancer proportions'),
  option('強勢肩線比例', 'commanding shoulder-line proportions'),
  option('柔順腰臀比例', 'soft waist-hip proportions'),
  option('突出臀腿比例', 'prominent hip-leg proportions'),
  option('突出胸腰比例', 'prominent bust-waist proportions'),
  option('平衡胸臀比例', 'balanced bust-hip proportions'),
  option('細腰長腿比例', 'slim-waist long-leg proportions'),
  option('短髮俐落比例', 'crisp short-hair framing proportions'),
  option('華麗曲線比例', 'glamorous curve proportions'),
  option('自然生活比例', 'natural everyday proportions'),
  option('漫畫感修長比例', 'stylized elongated proportions'),
  option('半寫實理想比例', 'semi-real idealized proportions'),
  option('柔和 S 線比例', 'soft S-line proportions'),
  option('肩頸優雅比例', 'elegant shoulder-neck proportions'),
  option('背線突出比例', 'defined back-line proportions'),
  option('腰窩清楚比例', 'defined lower-back proportions'),
  option('手腳修長比例', 'long-limb proportions'),
  option('大腿圓潤比例', 'rounded-thigh proportions'),
  option('小腹柔軟比例', 'soft-lower-belly proportions'),
  option('胸型飽滿比例', 'full-bust proportions'),
  option('臀型豐滿比例', 'full-hip proportions'),
  option('中性俐落比例', 'androgynous crisp proportions'),
  option('柔美曲線比例', 'feminine soft-curve proportions'),
  option('陽剛寬肩比例', 'masculine broad-shoulder proportions'),
  option('高腰線比例', 'high-waistline proportions'),
  option('低腰線比例', 'low-waistline proportions'),
  option('舞台存在感比例', 'stage-presence proportions'),
  option('鏡頭友善比例', 'camera-friendly proportions'),
  option('寫真模特比例', 'portrait-model proportions'),
  option('奇幻精靈比例', 'fantasy-elf proportions'),
  option('賽博仿生比例', 'cyber-synthetic proportions')
];

const AGE_BRACKET_OPTIONS = [
  option('18-20 歲成年', '18 to 20 years old adult'),
  option('21-25 歲', '21 to 25 years old'),
  option('26-30 歲', '26 to 30 years old'),
  option('31-35 歲', '31 to 35 years old'),
  option('36-40 歲', '36 to 40 years old'),
  option('41-45 歲', '41 to 45 years old'),
  option('46-50 歲', '46 to 50 years old'),
  option('51-55 歲', '51 to 55 years old'),
  option('56-60 歲', '56 to 60 years old')
];

const dailyOutfitPairs = [
  ['白襯衫與高腰長褲', 'white shirt with high-waisted trousers'], ['針織上衣與短裙', 'knit top with short skirt'], ['絲質吊帶睡裙', 'silk camisole slip dress'], ['寬鬆男友襯衫', 'oversized boyfriend shirt'], ['黑色連身裙', 'black fitted dress'],
  ['貼身高領衫與窄裙', 'fitted turtleneck with pencil skirt'], ['家居薄針織套裝', 'soft loungewear knit set'], ['浴袍與腰帶', 'robe with waist belt'], ['露肩上衣與牛仔褲', 'off-shoulder top with jeans'], ['西裝外套與短褲', 'blazer with tailored shorts'],
  ['棉質背心與運動短褲', 'cotton tank top with athletic shorts'], ['緞面睡衣套裝', 'satin pajama set'], ['白色洋裝', 'white day dress'], ['黑色背心與皮裙', 'black tank top with leather skirt'], ['蕾絲上衣與長裙', 'lace blouse with long skirt'],
  ['修身連體衣', 'fitted bodysuit'], ['薄紗罩衫與內搭', 'sheer overshirt with inner layer'], ['短版毛衣與高腰褲', 'cropped sweater with high-waisted pants'], ['背心裙與長靴', 'pinafore dress with long boots'], ['襯衫裙', 'shirt dress'],
  ['瑜伽上衣與貼身褲', 'yoga top with fitted leggings'], ['簡約比基尼罩衫', 'minimal bikini cover-up'], ['短版西裝套裝', 'cropped suit set'], ['絲巾抹胸與寬褲', 'scarf bandeau with wide-leg pants'], ['吊帶背心與開衩裙', 'camisole with slit skirt'],
  ['柔軟開襟衫與內搭', 'soft cardigan with inner layer'], ['簡約泳裝外搭襯衫', 'simple swimwear with open shirt cover'], ['復古高腰泳裝', 'retro high-waisted swimwear'], ['長版襯衫與腰封', 'long shirt with waist cincher'], ['一字領針織裙', 'off-shoulder knit dress'],
  ['緞面襯衫與西裝褲', 'satin blouse with tailored trousers'], ['薄棉睡袍', 'light cotton sleep robe'], ['短袖上衣與包臀裙', 'short-sleeve top with bodycon skirt'], ['無袖長洋裝', 'sleeveless maxi dress'], ['街頭短版外套與短裙', 'street cropped jacket with short skirt'],
  ['羅紋背心與寬鬆長褲', 'ribbed tank with relaxed trousers'], ['細肩帶連身褲', 'spaghetti-strap jumpsuit'], ['素色 T 恤與短褲', 'plain T-shirt with shorts'], ['短版襯衫與百褶裙', 'cropped shirt with pleated skirt'], ['居家長版 T 恤', 'oversized home T-shirt'],
  ['柔軟長袍外套', 'soft long robe coat'], ['簡約運動套裝', 'minimal athletic set'], ['小禮服洋裝', 'cocktail dress'], ['薄外套與貼身洋裝', 'light jacket over fitted dress'], ['丹寧外套與連身裙', 'denim jacket with dress'],
  ['絲質圍裹裙', 'silk wrap skirt'], ['高腰短褲與襯衫', 'high-waisted shorts with shirt'], ['細肩洋裝', 'spaghetti-strap dress'], ['透明感罩衫與長褲', 'translucent overshirt with trousers'], ['素色連身睡衣', 'plain one-piece sleepwear']
];

const rareOutfitPairs = [
  ['皮革束腰', 'leather corset'], ['金屬胸甲式上衣', 'metallic cuirass-inspired top'], ['精靈長袍', 'elf-inspired long robe'], ['暗精靈網紗套裝', 'dark-elf mesh outfit'], ['天使羽飾薄紗', 'angelic feathered tulle styling'],
  ['惡魔角飾緊身衣', 'demon-horn accented bodysuit'], ['龍鱗紋貼身裝', 'dragon-scale textured fitted outfit'], ['狐耳和服改良裝', 'fox-ear modern kimono outfit'], ['貓耳皮革套裝', 'cat-ear leather outfit'], ['兔耳緞面套裝', 'rabbit-ear satin outfit'],
  ['人魚鱗片裙', 'mermaid-scale skirt'], ['海妖珍珠薄紗', 'siren pearl tulle outfit'], ['吸血鬼天鵝絨禮服', 'vampire velvet gown'], ['哥德蕾絲長裙', 'gothic lace long dress'], ['賽博透明雨衣', 'cyber translucent raincoat styling'],
  ['仿生人銀色緊身裝', 'android silver bodysuit'], ['水晶肩飾禮服', 'crystal-shoulder gown'], ['月亮祭司長袍', 'moon-priest robe'], ['星紋連身衣', 'star-pattern bodysuit'], ['鳳凰羽片披肩', 'phoenix-feather capelet'],
  ['雪女白紗和服', 'snow-spirit white gauze kimono'], ['火焰紋緊身衣', 'flame-pattern fitted suit'], ['水元素流線裙', 'water-element flowing dress'], ['風元素飄帶裝', 'air-element ribbon outfit'], ['樹精藤蔓薄紗', 'dryad vine-and-tulle styling'],
  ['寶石腰鏈舞衣', 'gem waist-chain dance outfit'], ['銀河旅人披風', 'galactic traveler cape'], ['外星貴族禮服', 'alien noble gown'], ['月兔絲緞短裝', 'moon-rabbit satin short outfit'], ['黑翼羽毛披肩', 'black-wing feather shawl'],
  ['白翼羽毛披肩', 'white-wing feather shawl'], ['獨角獸彩虹緞帶裝', 'unicorn rainbow-ribbon outfit'], ['豹紋獸人短裝', 'leopard-pattern kemonomimi outfit'], ['鷹翼肩甲裝', 'hawk-wing shoulder-armor outfit'], ['鏡面銀片禮服', 'mirror-silver sequin gown'],
  ['古神祭司長袍', 'eldritch-priest robe'], ['夢魘黑紗套裝', 'nightmare black gauze set'], ['時間旅者齒輪束身', 'time-traveler gear corsetry'], ['鏡像分身雙色裝', 'mirror-double two-tone outfit'], ['水晶吊鏈內搭', 'crystal-chain inner styling'],
  ['珍珠貝殼胸飾', 'pearl-shell bust adornment'], ['花精透明花瓣裙', 'floral-fae translucent petal skirt'], ['雷元素金屬線裝', 'storm-element metallic-line outfit'], ['暗影披風與短裝', 'shadow cloak with short outfit'], ['光翼透明披肩', 'light-wing translucent capelet'],
  ['機械人偶關節裝', 'mechanical-doll jointed outfit'], ['賽博發光線條裝', 'cyber glowing-line suit'], ['魔法學院成人禮服', 'adult magic-academy formal gown'], ['皇家舞會束身裙', 'royal ballroom corseted dress'], ['星艦指揮官緊身制服', 'starship commander fitted uniform']
];

const outfitColors = [
  ['珍珠白', 'pearl white'],
  ['霧面黑', 'matte black'],
  ['酒紅', 'wine red'],
  ['玫瑰粉', 'rose pink'],
  ['裸膚米', 'nude beige'],
  ['香檳金', 'champagne gold'],
  ['深海藍', 'deep ocean blue'],
  ['祖母綠', 'emerald green'],
  ['薰衣草紫', 'lavender purple'],
  ['煙灰色', 'smoky gray'],
  ['奶油黃', 'cream yellow'],
  ['焦糖棕', 'caramel brown'],
  ['銀白', 'silver white'],
  ['午夜藍', 'midnight blue'],
  ['櫻桃紅', 'cherry red'],
  ['孔雀綠', 'peacock green'],
  ['水晶透明', 'crystal transparent'],
  ['暖象牙', 'warm ivory'],
  ['冷灰藍', 'cool gray blue'],
  ['珊瑚橘', 'coral orange'],
  ['紫羅蘭', 'violet'],
  ['青瓷綠', 'celadon green'],
  ['黑金配色', 'black and gold'],
  ['白銀配色', 'white and silver'],
  ['粉金配色', 'pink and gold'],
  ['紅黑配色', 'red and black'],
  ['藍銀配色', 'blue and silver'],
  ['綠金配色', 'green and gold'],
  ['透明漸層', 'transparent gradient'],
  ['低飽和莫蘭迪色', 'muted Morandi palette'],
  ['寶石紅', 'ruby red'],
  ['湖水綠', 'aqua green'],
  ['霧紫灰', 'misty purple gray'],
  ['蜜桃粉', 'peach pink'],
  ['冰川藍', 'glacier blue'],
  ['古銅金', 'antique bronze'],
  ['玫瑰金', 'rose gold'],
  ['深莓紫', 'deep berry purple'],
  ['象牙黑邊', 'ivory with black trim'],
  ['黑白棋盤', 'black-white checker'],
  ['銀河漸層', 'galaxy gradient'],
  ['煙燻玫瑰', 'smoky rose'],
  ['孔雀藍綠', 'peacock teal'],
  ['暖咖啡', 'warm coffee'],
  ['冷白藍光', 'cool white blue'],
  ['赤陶橘', 'terracotta orange'],
  ['夜幕紫', 'nightfall purple'],
  ['月光銀', 'moonlight silver'],
  ['裸粉金', 'nude pink gold'],
  ['暗紅金邊', 'dark red with gold trim']
].map(([zh, en]) => option(zh, en));

const OUTFIT_MATERIAL_OPTIONS = [
  option('絲綢', 'silk'),
  option('緞面', 'satin'),
  option('蕾絲', 'lace'),
  option('薄紗', 'tulle'),
  option('雪紡', 'chiffon'),
  option('天鵝絨', 'velvet'),
  option('皮革', 'leather'),
  option('乳膠亮面', 'glossy latex'),
  option('棉質', 'cotton'),
  option('亞麻', 'linen'),
  option('羊毛', 'wool'),
  option('針織', 'knit'),
  option('丹寧', 'denim'),
  option('麂皮', 'suede'),
  option('金屬網布', 'metal mesh'),
  option('亮片布', 'sequin fabric'),
  option('珠飾布', 'beaded fabric'),
  option('羽毛材質', 'feather material'),
  option('PVC 透明材質', 'clear PVC'),
  option('歐根紗', 'organza'),
  option('網紗', 'mesh'),
  option('羅紋布', 'ribbed fabric'),
  option('亮面漆皮', 'patent leather'),
  option('柔霧皮革', 'matte leather'),
  option('緞帶材質', 'ribbon material'),
  option('羊絨', 'cashmere'),
  option('仿毛皮', 'faux fur'),
  option('水鑽鑲嵌', 'rhinestone-embedded fabric'),
  option('金蔥布', 'glitter fabric'),
  option('反光材質', 'reflective material'),
  option('透明薄膜', 'transparent film'),
  option('珍珠鏈材質', 'pearl-chain material'),
  option('金屬鏈材質', 'metal-chain material'),
  option('蕾絲刺繡', 'embroidered lace'),
  option('花瓣薄紗', 'petal tulle'),
  option('絲絨壓紋', 'embossed velvet'),
  option('大理石紋布', 'marble-pattern fabric'),
  option('蛇紋皮革', 'snake-pattern leather'),
  option('龍鱗紋材質', 'dragon-scale texture'),
  option('羽片拼接', 'feather-panel texture'),
  option('水波紋緞面', 'water-ripple satin'),
  option('霧面橡膠', 'matte rubber'),
  option('細閃紗', 'fine-shimmer gauze'),
  option('透明水晶珠', 'transparent crystal beads'),
  option('金線刺繡', 'gold-thread embroidery'),
  option('銀線刺繡', 'silver-thread embroidery'),
  option('柔光反射布', 'soft-reflective fabric'),
  option('高彈纖維', 'high-stretch fiber'),
  option('輕薄棉紗', 'light cotton gauze'),
  option('厚重披毯布', 'heavy drape fabric')
];

const bodyFeatures = [
  ['豐滿胸型', 'full bust'], ['圓潤臀線', 'rounded hips'], ['纖細腰線', 'slender waist'], ['長腿比例', 'long-leg proportions'], ['沙漏曲線', 'hourglass curves'],
  ['運動型腹線', 'athletic abdominal lines'], ['柔軟肉感曲線', 'soft voluptuous curves'], ['高挑身形', 'tall silhouette'], ['嬌小成年身形', 'petite adult silhouette'], ['寬肩窄腰', 'broad shoulders with narrow waist'],
  ['修長頸線', 'elongated neck line'], ['清楚鎖骨', 'defined collarbones'], ['圓潤大腿', 'rounded thighs'], ['結實腿線', 'toned leg lines'], ['纖長手指', 'long elegant fingers'],
  ['柔軟手臂線條', 'soft arm lines'], ['背部曲線明顯', 'defined back curve'], ['腰窩清楚', 'subtle lower-back dimples'], ['小腹自然柔軟', 'natural soft lower belly'], ['臀腰比例突出', 'prominent hip-to-waist ratio'],
  ['胸腰比例突出', 'prominent bust-to-waist ratio'], ['肩頸線優雅', 'elegant shoulder and neck line'], ['臀腿線條連貫', 'continuous hip-to-leg line'], ['膚質細緻', 'fine skin texture'], ['曬痕輪廓', 'subtle tan-line contours'],
  ['刺青點綴', 'tattoo accents'], ['痣點點綴', 'beauty-mark accents'], ['雀斑點綴', 'freckle accents'], ['肌肉線條輕微', 'subtle muscle definition'], ['曲線誇張但自然', 'exaggerated yet natural curves']
].map(([zh, en]) => option(zh, en));

const OUTFIT_INTEGRITY_OPTIONS = [
  option('完整穿著', 'fully worn outfit'),
  option('肩帶微鬆', 'slightly loosened shoulder strap'),
  option('領口微開', 'slightly open neckline'),
  option('外套半披', 'jacket half-draped'),
  option('腰帶鬆開', 'loosened waist belt'),
  option('裙襬微掀', 'slightly lifted hemline'),
  option('布料半透明但完整', 'semi-transparent but intact fabric'),
  option('局部滑落但仍遮覆', 'partially slipped while still covering'),
  option('大片布料滑落', 'large fabric panels slipping down'),
  option('近乎未著但構圖遮擋', 'nearly unclothed with composition-based coverage')
];

const COUNT_OPTIONS = [
  ['單人成人肖像', 'single adult portrait'], ['雙人合意互動', 'two consenting adults interacting'], ['三人合意構圖', 'three consenting adults composition'], ['四人成人群像', 'four-adult group composition'], ['單人半身特寫', 'single-adult half-body close portrait'],
  ['單人全身構圖', 'single-adult full-body composition'], ['雙人面對面構圖', 'two adults face-to-face composition'], ['雙人前後景構圖', 'two adults foreground-background composition'], ['雙人並肩構圖', 'two adults side-by-side composition'], ['雙人擁抱構圖', 'two adults embracing composition'],
  ['三人三角構圖', 'three adults triangular composition'], ['多人派對式構圖', 'multi-adult party-style composition'], ['單人鏡像反射構圖', 'single adult with mirror reflection composition'], ['雙人鏡像反射構圖', 'two adults with mirror reflection composition'], ['單人主體與剪影配角', 'single adult lead with adult silhouette partner'],
  ['雙人主體與模糊背景成人', 'two adult leads with blurred adult background figures'], ['單人坐姿構圖', 'single adult seated composition'], ['單人站姿構圖', 'single adult standing composition'], ['雙人高低差構圖', 'two adults with height-level contrast'], ['三人層次錯位構圖', 'three adults staggered layered composition']
].map(([zh, en]) => option(zh, en));

const POSE_OPTIONS = [
  ['站姿微側身，肩膀放鬆，腰線清楚', 'standing slight side turn, relaxed shoulders, clear waistline'], ['坐姿前傾，手臂自然支撐', 'seated forward lean with naturally supported arms'], ['仰躺伸展，手臂自然上舉', 'reclining stretch with arms raised naturally'], ['俯身靠近鏡頭，髮絲垂落', 'leaning forward toward the camera with falling hair'], ['一膝微彎站姿，身體形成 S 型線條', 'standing with one knee bent, S-curve body line'],
  ['反坐姿勢，肩頸線條清楚', 'reverse-seated pose with clear shoulder and neck line'], ['雙人面對面站立，額頭相近', 'two adults standing face-to-face with foreheads close'], ['雙人坐姿相擁，肢體輪廓清楚', 'two adults seated embrace with readable silhouettes'], ['雙人一坐一站，形成高低差', 'two adults one seated and one standing, height contrast'], ['背後擁抱姿勢，雙方明確合意', 'consensual back embrace between adults'],
  ['膝上依偎姿勢，表情親密', 'lap-cuddle pose with intimate expression'], ['斜躺姿勢，手肘支撐，腿部延伸', 'diagonal recline with elbow support and extended legs'], ['邊緣坐姿，肩線與鎖骨清楚', 'edge-seated pose with clear shoulders and collarbones'], ['站姿手扶垂直支撐，身形拉長', 'standing with hand on vertical support, elongated silhouette'], ['整理服裝姿勢，手部成為焦點', 'adjusting outfit pose with hands as focal detail'],
  ['盤腿坐姿，身體微微前傾', 'cross-legged seated pose with slight forward lean'], ['跪姿前傾，手掌穩定支撐', 'kneeling forward lean with stable palm support'], ['側坐回頭，布料沿腿部垂落', 'side-seated glance back with fabric draping along legs'], ['雙人並肩躺臥，視線交會', 'two adults lying side by side with exchanged gazes'], ['雙人剪影貼近，動作含蓄', 'two adults close in silhouette with restrained motion'],
  ['站姿雙臂自然展開，衣料有動態', 'standing with arms naturally open and fabric movement'], ['柱狀支撐旁倚靠，身體線條平行', 'leaning beside vertical support with parallel body line'], ['長袍滑落肩頭的整理姿勢', 'adjusting robe slipping from one shoulder'], ['坐姿後仰支撐，腿部自然彎曲', 'seated back lean with naturally bent legs'], ['趴臥前景，臉部靠近視線焦點', 'prone pose with face near the visual focal plane'],
  ['半跪拾起布料，手部與布料成焦點', 'half-kneeling while picking up fabric, hands and fabric as focus'], ['雙人指尖相扣，距離接近', 'two adults interlocking fingertips at close distance'], ['雙人互相整理衣領或肩帶', 'two adults adjusting each other’s collar or strap'], ['站姿回身，手扶框線支撐', 'standing turn-back pose with hand on frame support'], ['階梯式坐姿，一腿高一腿低', 'tiered seated pose with one leg higher than the other'],
  ['側坐手肘靠平面，肩膀微轉', 'side-seated with elbow on a surface and slight shoulder turn'], ['浴袍半披站姿，腰帶動態清楚', 'standing with half-draped robe and clear belt motion'], ['低頭微笑，手指撫過髮絲', 'lowered smiling gaze with fingers brushing through hair'], ['雙人額頭相抵，閉眼呼吸同步', 'two adults forehead-to-forehead with synchronized closed-eye breathing'], ['雙人一前一後站位，前景人物回眸', 'two adults staggered front-back stance with foreground glance back'],
  ['伸展躺姿，身體線條完整可讀', 'stretched reclining pose with fully readable body line'], ['半遮姿勢，薄布創造層次', 'partially covered pose with thin fabric layering'], ['坐姿交疊手臂，表情冷靜自信', 'seated pose with crossed arms and calm confidence'], ['跪坐整理長髮，背部曲線成主視覺', 'kneeling while arranging long hair, back curve as main visual'], ['站姿拉起手套或袖口', 'standing while pulling up gloves or sleeve cuffs'],
  ['半身前傾靠平面，肩頸與手部清楚', 'half-body forward lean on a surface, clear shoulders, neck, and hands'], ['雙人背靠背坐姿，視線分向兩側', 'two adults seated back-to-back with gazes in opposite directions'], ['雙人手臂環抱肩背，重心穩定', 'two adults with arms around shoulders and back, stable weight'], ['地面側躺構圖，布料鋪展成引導線', 'side-lying floor composition with fabric as leading line'], ['扶手倚坐姿勢，腿部斜向畫面角落', 'perched on an armrest-like support, legs angled toward frame corner'],
  ['薄紗間探身姿勢，前景柔化輪廓', 'leaning through sheer fabric with softened foreground contour'], ['站姿抬手觸碰耳環或髮飾', 'standing with raised hand touching earring or hair ornament'], ['雙人慢舞般貼近，手扶肩背與腰側', 'two adults close like a slow dance, hands on shoulders, back, and waist'], ['跪姿直背，手掌停在大腿上', 'upright kneeling pose with palms resting on thighs'], ['坐姿單腿伸展，另一腿自然收折', 'seated one-leg extension with the other leg naturally folded']
].map(([zh, en]) => option(zh, en));

const ACTION_OPTIONS = [
  option('單人回眸挑眉', 'single adult turns back with an inviting raised brow', 'single'),
  option('單人指尖滑過鎖骨', 'single adult traces the collarbone with fingertips', 'single'),
  option('單人慢拉肩帶但保持遮擋', 'single adult slowly loosens a shoulder strap while maintaining coverage', 'single'),
  option('單人咬唇靠近鏡頭', 'single adult approaches camera with a soft lip bite', 'single'),
  option('單人整理濕髮', 'single adult arranges damp hair', 'single'),
  option('單人側身展示腰臀線', 'single adult side-turns to emphasize hip-waist line', 'single'),
  option('單人扶住領口遮擋', 'single adult holds the neckline for coverage', 'single'),
  option('單人緩慢深呼吸', 'single adult takes slow visible breaths', 'single'),
  option('單人手指停在唇邊', 'single adult pauses fingertips near lips', 'single'),
  option('單人拉開外套一角', 'single adult opens one side of the jacket', 'single'),
  option('單人坐姿前傾凝視', 'single adult leans forward seated with a direct gaze', 'single'),
  option('單人跪坐整理長髮', 'single adult kneels and arranges long hair', 'single'),
  option('單人腿部交疊伸展', 'single adult crosses and extends legs elegantly', 'single'),
  option('單人背對鏡頭回望', 'single adult looks back over the shoulder', 'single'),
  option('單人靠牆抬手', 'single adult raises a hand while leaning near a vertical support', 'single'),
  option('單人慢轉展示背線', 'single adult slowly turns to reveal the back line', 'single'),
  option('單人拂過肩線', 'single adult brushes along the shoulder line', 'single'),
  option('單人勾住腰帶', 'single adult hooks fingertips on the waist belt', 'single'),
  option('單人抬腿調整鞋帶', 'single adult raises a leg to adjust a shoe strap', 'single'),
  option('單人把布料拉回肩上', 'single adult pulls fabric back over the shoulder', 'single'),
  option('單人掌心停在側腰', 'single adult pauses palm along the side waist', 'single'),
  option('單人低頭微笑', 'single adult lowers the head with a subtle smile', 'single'),
  option('單人抬眼直視', 'single adult raises the eyes into a direct gaze', 'single'),
  option('單人髮絲遮住半臉', 'single adult lets hair veil half the face', 'single'),
  option('單人指尖輕敲胸前吊鏈', 'single adult taps a chest-chain accessory lightly', 'single'),
  option('單人拉緊緞帶', 'single adult tightens a satin ribbon', 'single'),
  option('單人輕撫手臂', 'single adult softly strokes the arm', 'single'),
  option('單人靠近鏡面吐息', 'single adult breathes softly near a mirror-like surface', 'single'),
  option('單人慢步入鏡', 'single adult slowly steps into frame', 'single'),
  option('單人半披外套站立', 'single adult stands with a half-draped jacket', 'single'),
  option('單人椅上反坐回眸', 'single adult sits backward on a chair and glances back', 'single'),
  option('單人側躺抬眼', 'single adult side-reclines and looks up', 'single'),
  option('單人指尖沿腿線停住', 'single adult traces the leg line and pauses', 'single'),
  option('單人握住香水瓶', 'single adult holds a perfume bottle', 'single'),
  option('單人輕咬手套邊', 'single adult lightly bites the glove edge', 'single'),
  option('單人解開腰帶但不露骨', 'single adult loosens the belt without explicit reveal', 'single'),
  option('單人貼近前景停步', 'single adult stops close to foreground', 'single'),
  option('單人把玩項鍊', 'single adult plays with a necklace', 'single'),
  option('單人拉開薄紗一角', 'single adult lifts one corner of sheer fabric', 'single'),
  option('單人坐在邊緣伸腿', 'single adult sits on an edge and extends one leg', 'single'),
  option('單人仰躺抬手', 'single adult reclines and raises an arm', 'single'),
  option('單人站姿壓低肩線', 'single adult lowers one shoulder while standing', 'single'),
  option('單人用扇遮住唇角', 'single adult covers the lip corner with a fan', 'single'),
  option('單人眼罩半掀', 'single adult half-lifts a blindfold styling prop', 'single'),
  option('單人緞帶繞腕', 'single adult wraps a ribbon around the wrist', 'single'),
  option('單人拿起紅酒杯', 'single adult lifts a wine glass', 'single'),
  option('單人貼近光影邊界', 'single adult moves near the edge of the lit area', 'single'),
  option('單人回身拉住門框', 'single adult turns back and holds a frame edge', 'single'),
  option('單人蹲姿抬頭', 'single adult crouches and looks upward', 'single'),
  option('單人慢慢坐下', 'single adult slowly sits down', 'single'),
  option('單人回眸挑眉（慢速挑逗版）', 'single adult turns back with an inviting raised brow with slower teasing pacing', 'single'),
  option('單人指尖滑過鎖骨（慢速挑逗版）', 'single adult traces the collarbone with fingertips with slower teasing pacing', 'single'),
  option('單人慢拉肩帶但保持遮擋（慢速挑逗版）', 'single adult slowly loosens a shoulder strap while maintaining coverage with slower teasing pacing', 'single'),
  option('單人咬唇靠近鏡頭（慢速挑逗版）', 'single adult approaches camera with a soft lip bite with slower teasing pacing', 'single'),
  option('單人整理濕髮（慢速挑逗版）', 'single adult arranges damp hair with slower teasing pacing', 'single'),
  option('單人側身展示腰臀線（慢速挑逗版）', 'single adult side-turns to emphasize hip-waist line with slower teasing pacing', 'single'),
  option('單人扶住領口遮擋（慢速挑逗版）', 'single adult holds the neckline for coverage with slower teasing pacing', 'single'),
  option('單人緩慢深呼吸（慢速挑逗版）', 'single adult takes slow visible breaths with slower teasing pacing', 'single'),
  option('單人手指停在唇邊（慢速挑逗版）', 'single adult pauses fingertips near lips with slower teasing pacing', 'single'),
  option('單人拉開外套一角（慢速挑逗版）', 'single adult opens one side of the jacket with slower teasing pacing', 'single'),
  option('單人坐姿前傾凝視（慢速挑逗版）', 'single adult leans forward seated with a direct gaze with slower teasing pacing', 'single'),
  option('單人跪坐整理長髮（慢速挑逗版）', 'single adult kneels and arranges long hair with slower teasing pacing', 'single'),
  option('單人腿部交疊伸展（慢速挑逗版）', 'single adult crosses and extends legs elegantly with slower teasing pacing', 'single'),
  option('單人背對鏡頭回望（慢速挑逗版）', 'single adult looks back over the shoulder with slower teasing pacing', 'single'),
  option('單人靠牆抬手（慢速挑逗版）', 'single adult raises a hand while leaning near a vertical support with slower teasing pacing', 'single'),
  option('單人慢轉展示背線（慢速挑逗版）', 'single adult slowly turns to reveal the back line with slower teasing pacing', 'single'),
  option('單人拂過肩線（慢速挑逗版）', 'single adult brushes along the shoulder line with slower teasing pacing', 'single'),
  option('單人勾住腰帶（慢速挑逗版）', 'single adult hooks fingertips on the waist belt with slower teasing pacing', 'single'),
  option('單人抬腿調整鞋帶（慢速挑逗版）', 'single adult raises a leg to adjust a shoe strap with slower teasing pacing', 'single'),
  option('單人把布料拉回肩上（慢速挑逗版）', 'single adult pulls fabric back over the shoulder with slower teasing pacing', 'single'),
  option('單人掌心停在側腰（慢速挑逗版）', 'single adult pauses palm along the side waist with slower teasing pacing', 'single'),
  option('單人低頭微笑（慢速挑逗版）', 'single adult lowers the head with a subtle smile with slower teasing pacing', 'single'),
  option('單人抬眼直視（慢速挑逗版）', 'single adult raises the eyes into a direct gaze with slower teasing pacing', 'single'),
  option('單人髮絲遮住半臉（慢速挑逗版）', 'single adult lets hair veil half the face with slower teasing pacing', 'single'),
  option('單人指尖輕敲胸前吊鏈（慢速挑逗版）', 'single adult taps a chest-chain accessory lightly with slower teasing pacing', 'single'),
  option('單人拉緊緞帶（慢速挑逗版）', 'single adult tightens a satin ribbon with slower teasing pacing', 'single'),
  option('單人輕撫手臂（慢速挑逗版）', 'single adult softly strokes the arm with slower teasing pacing', 'single'),
  option('單人靠近鏡面吐息（慢速挑逗版）', 'single adult breathes softly near a mirror-like surface with slower teasing pacing', 'single'),
  option('單人慢步入鏡（慢速挑逗版）', 'single adult slowly steps into frame with slower teasing pacing', 'single'),
  option('單人半披外套站立（慢速挑逗版）', 'single adult stands with a half-draped jacket with slower teasing pacing', 'single'),
  option('單人椅上反坐回眸（慢速挑逗版）', 'single adult sits backward on a chair and glances back with slower teasing pacing', 'single'),
  option('單人側躺抬眼（慢速挑逗版）', 'single adult side-reclines and looks up with slower teasing pacing', 'single'),
  option('單人指尖沿腿線停住（慢速挑逗版）', 'single adult traces the leg line and pauses with slower teasing pacing', 'single'),
  option('單人握住香水瓶（慢速挑逗版）', 'single adult holds a perfume bottle with slower teasing pacing', 'single'),
  option('單人輕咬手套邊（慢速挑逗版）', 'single adult lightly bites the glove edge with slower teasing pacing', 'single'),
  option('單人解開腰帶但不露骨（慢速挑逗版）', 'single adult loosens the belt without explicit reveal with slower teasing pacing', 'single'),
  option('單人貼近前景停步（慢速挑逗版）', 'single adult stops close to foreground with slower teasing pacing', 'single'),
  option('單人把玩項鍊（慢速挑逗版）', 'single adult plays with a necklace with slower teasing pacing', 'single'),
  option('單人拉開薄紗一角（慢速挑逗版）', 'single adult lifts one corner of sheer fabric with slower teasing pacing', 'single'),
  option('單人坐在邊緣伸腿（慢速挑逗版）', 'single adult sits on an edge and extends one leg with slower teasing pacing', 'single'),
  option('單人仰躺抬手（慢速挑逗版）', 'single adult reclines and raises an arm with slower teasing pacing', 'single'),
  option('單人站姿壓低肩線（慢速挑逗版）', 'single adult lowers one shoulder while standing with slower teasing pacing', 'single'),
  option('單人用扇遮住唇角（慢速挑逗版）', 'single adult covers the lip corner with a fan with slower teasing pacing', 'single'),
  option('單人眼罩半掀（慢速挑逗版）', 'single adult half-lifts a blindfold styling prop with slower teasing pacing', 'single'),
  option('單人緞帶繞腕（慢速挑逗版）', 'single adult wraps a ribbon around the wrist with slower teasing pacing', 'single'),
  option('單人拿起紅酒杯（慢速挑逗版）', 'single adult lifts a wine glass with slower teasing pacing', 'single'),
  option('單人貼近光影邊界（慢速挑逗版）', 'single adult moves near the edge of the lit area with slower teasing pacing', 'single'),
  option('單人回身拉住門框（慢速挑逗版）', 'single adult turns back and holds a frame edge with slower teasing pacing', 'single'),
  option('單人蹲姿抬頭（慢速挑逗版）', 'single adult crouches and looks upward with slower teasing pacing', 'single'),
  option('單人慢慢坐下（慢速挑逗版）', 'single adult slowly sits down with slower teasing pacing', 'single'),
  option('雙人對視靠近', 'two adults move closer with eye contact', 'two'),
  option('雙人指尖交纏', 'two adults interlace fingertips', 'two'),
  option('雙人額頭相抵呼吸', 'two adults touch foreheads and breathe slowly', 'two'),
  option('雙人一前一後回眸', 'two adults stand front-back with a glance back', 'two'),
  option('雙人整理彼此衣領', 'two adults adjust each other’s collars', 'two'),
  option('雙人慢舞貼近', 'two adults move close in a slow-dance rhythm', 'two'),
  option('雙人肩背環抱', 'two adults wrap arms around shoulders and back', 'two'),
  option('雙人一坐一站互看', 'two adults one seated one standing exchanging gaze', 'two'),
  option('雙人交錯坐姿', 'two adults sit in staggered positions', 'two'),
  option('雙人背後擁抱', 'two adults use a consensual back embrace', 'two'),
  option('雙人手掌疊放', 'two adults stack palms together', 'two'),
  option('雙人一人拉近緞帶', 'two adults with one drawing the ribbon closer', 'two'),
  option('雙人耳邊低語', 'two adults whisper near the ear', 'two'),
  option('雙人靠牆對望', 'two adults hold close eye contact near a vertical support', 'two'),
  option('雙人交換外套', 'two adults exchange a jacket', 'two'),
  option('雙人同步回頭', 'two adults turn back in sync', 'two'),
  option('雙人共同整理薄紗', 'two adults arrange sheer fabric together', 'two'),
  option('雙人膝蓋輕碰', 'two adults lightly touch knees', 'two'),
  option('雙人手腕被輕牽', 'two adults with one gently holding the wrist', 'two'),
  option('雙人一人扶住下巴', 'two adults with one lifting the other’s chin', 'two'),
  option('雙人坐姿相擁', 'two adults sit in a close embrace', 'two'),
  option('雙人並肩貼近', 'two adults stand close shoulder to shoulder', 'two'),
  option('雙人鏡前整理造型', 'two adults adjust styling near a mirror-like surface', 'two'),
  option('雙人輪流看向鏡頭', 'two adults alternate gaze toward camera', 'two'),
  option('雙人一人披上外套', 'two adults with one draping a jacket over the other', 'two'),
  option('雙人腰側輕扶', 'two adults gently hold the waist side', 'two'),
  option('雙人手指沿手臂移動', 'two adults trace fingertips along an arm', 'two'),
  option('雙人慢步靠近', 'two adults slowly step closer', 'two'),
  option('雙人分坐高低位', 'two adults sit at different levels', 'two'),
  option('雙人一人俯身低語', 'two adults with one leaning down to whisper', 'two'),
  option('雙人共享紅酒杯', 'two adults share a wine glass', 'two'),
  option('雙人拉住同一條緞帶', 'two adults hold the same satin ribbon', 'two'),
  option('雙人共同遮擋薄紗', 'two adults hold sheer fabric for coverage', 'two'),
  option('雙人背靠背深呼吸', 'two adults stand back-to-back breathing slowly', 'two'),
  option('雙人牽手入鏡', 'two adults enter frame holding hands', 'two'),
  option('雙人交錯站位拉開距離', 'two adults stagger positions with controlled distance', 'two'),
  option('雙人一人坐膝旁', 'two adults with one seated near the other’s knees', 'two'),
  option('雙人視線一上一下', 'two adults exchange high-low gaze', 'two'),
  option('雙人共同整理長髮', 'two adults arrange long hair together', 'two'),
  option('雙人一人輕碰唇角', 'two adults with one touching near the lip corner', 'two'),
  option('雙人手掌沿背線停住', 'two adults with a palm pausing along the back line', 'two'),
  option('雙人貼近但不接觸', 'two adults move close without touching', 'two'),
  option('雙人輪廓重疊', 'two adults overlap silhouettes', 'two'),
  option('雙人互扣腰鏈', 'two adults clasp a waist-chain accessory together', 'two'),
  option('雙人互相戴上飾品', 'two adults place accessories on each other', 'two'),
  option('雙人慢慢分開回望', 'two adults slowly separate and glance back', 'two'),
  option('雙人一人坐一人倚靠', 'two adults one seated and one leaning nearby', 'two'),
  option('雙人手扶肩線', 'two adults hold each other near the shoulder line', 'two'),
  option('雙人同看一面鏡', 'two adults look toward the same mirror-like surface', 'two'),
  option('雙人呼吸節奏同步', 'two adults synchronize breathing rhythm', 'two'),
  option('雙人對視靠近（慢速挑逗版）', 'two adults move closer with eye contact with slower teasing pacing', 'two'),
  option('雙人指尖交纏（慢速挑逗版）', 'two adults interlace fingertips with slower teasing pacing', 'two'),
  option('雙人額頭相抵呼吸（慢速挑逗版）', 'two adults touch foreheads and breathe slowly with slower teasing pacing', 'two'),
  option('雙人一前一後回眸（慢速挑逗版）', 'two adults stand front-back with a glance back with slower teasing pacing', 'two'),
  option('雙人整理彼此衣領（慢速挑逗版）', 'two adults adjust each other’s collars with slower teasing pacing', 'two'),
  option('雙人慢舞貼近（慢速挑逗版）', 'two adults move close in a slow-dance rhythm with slower teasing pacing', 'two'),
  option('雙人肩背環抱（慢速挑逗版）', 'two adults wrap arms around shoulders and back with slower teasing pacing', 'two'),
  option('雙人一坐一站互看（慢速挑逗版）', 'two adults one seated one standing exchanging gaze with slower teasing pacing', 'two'),
  option('雙人交錯坐姿（慢速挑逗版）', 'two adults sit in staggered positions with slower teasing pacing', 'two'),
  option('雙人背後擁抱（慢速挑逗版）', 'two adults use a consensual back embrace with slower teasing pacing', 'two'),
  option('雙人手掌疊放（慢速挑逗版）', 'two adults stack palms together with slower teasing pacing', 'two'),
  option('雙人一人拉近緞帶（慢速挑逗版）', 'two adults with one drawing the ribbon closer with slower teasing pacing', 'two'),
  option('雙人耳邊低語（慢速挑逗版）', 'two adults whisper near the ear with slower teasing pacing', 'two'),
  option('雙人靠牆對望（慢速挑逗版）', 'two adults hold close eye contact near a vertical support with slower teasing pacing', 'two'),
  option('雙人交換外套（慢速挑逗版）', 'two adults exchange a jacket with slower teasing pacing', 'two'),
  option('雙人同步回頭（慢速挑逗版）', 'two adults turn back in sync with slower teasing pacing', 'two'),
  option('雙人共同整理薄紗（慢速挑逗版）', 'two adults arrange sheer fabric together with slower teasing pacing', 'two'),
  option('雙人膝蓋輕碰（慢速挑逗版）', 'two adults lightly touch knees with slower teasing pacing', 'two'),
  option('雙人手腕被輕牽（慢速挑逗版）', 'two adults with one gently holding the wrist with slower teasing pacing', 'two'),
  option('雙人一人扶住下巴（慢速挑逗版）', 'two adults with one lifting the other’s chin with slower teasing pacing', 'two'),
  option('雙人坐姿相擁（慢速挑逗版）', 'two adults sit in a close embrace with slower teasing pacing', 'two'),
  option('雙人並肩貼近（慢速挑逗版）', 'two adults stand close shoulder to shoulder with slower teasing pacing', 'two'),
  option('雙人鏡前整理造型（慢速挑逗版）', 'two adults adjust styling near a mirror-like surface with slower teasing pacing', 'two'),
  option('雙人輪流看向鏡頭（慢速挑逗版）', 'two adults alternate gaze toward camera with slower teasing pacing', 'two'),
  option('雙人一人披上外套（慢速挑逗版）', 'two adults with one draping a jacket over the other with slower teasing pacing', 'two'),
  option('雙人腰側輕扶（慢速挑逗版）', 'two adults gently hold the waist side with slower teasing pacing', 'two'),
  option('雙人手指沿手臂移動（慢速挑逗版）', 'two adults trace fingertips along an arm with slower teasing pacing', 'two'),
  option('雙人慢步靠近（慢速挑逗版）', 'two adults slowly step closer with slower teasing pacing', 'two'),
  option('雙人分坐高低位（慢速挑逗版）', 'two adults sit at different levels with slower teasing pacing', 'two'),
  option('雙人一人俯身低語（慢速挑逗版）', 'two adults with one leaning down to whisper with slower teasing pacing', 'two'),
  option('雙人共享紅酒杯（慢速挑逗版）', 'two adults share a wine glass with slower teasing pacing', 'two'),
  option('雙人拉住同一條緞帶（慢速挑逗版）', 'two adults hold the same satin ribbon with slower teasing pacing', 'two'),
  option('雙人共同遮擋薄紗（慢速挑逗版）', 'two adults hold sheer fabric for coverage with slower teasing pacing', 'two'),
  option('雙人背靠背深呼吸（慢速挑逗版）', 'two adults stand back-to-back breathing slowly with slower teasing pacing', 'two'),
  option('雙人牽手入鏡（慢速挑逗版）', 'two adults enter frame holding hands with slower teasing pacing', 'two'),
  option('雙人交錯站位拉開距離（慢速挑逗版）', 'two adults stagger positions with controlled distance with slower teasing pacing', 'two'),
  option('雙人一人坐膝旁（慢速挑逗版）', 'two adults with one seated near the other’s knees with slower teasing pacing', 'two'),
  option('雙人視線一上一下（慢速挑逗版）', 'two adults exchange high-low gaze with slower teasing pacing', 'two'),
  option('雙人共同整理長髮（慢速挑逗版）', 'two adults arrange long hair together with slower teasing pacing', 'two'),
  option('雙人一人輕碰唇角（慢速挑逗版）', 'two adults with one touching near the lip corner with slower teasing pacing', 'two'),
  option('雙人手掌沿背線停住（慢速挑逗版）', 'two adults with a palm pausing along the back line with slower teasing pacing', 'two'),
  option('雙人貼近但不接觸（慢速挑逗版）', 'two adults move close without touching with slower teasing pacing', 'two'),
  option('雙人輪廓重疊（慢速挑逗版）', 'two adults overlap silhouettes with slower teasing pacing', 'two'),
  option('雙人互扣腰鏈（慢速挑逗版）', 'two adults clasp a waist-chain accessory together with slower teasing pacing', 'two'),
  option('雙人互相戴上飾品（慢速挑逗版）', 'two adults place accessories on each other with slower teasing pacing', 'two'),
  option('雙人慢慢分開回望（慢速挑逗版）', 'two adults slowly separate and glance back with slower teasing pacing', 'two'),
  option('雙人一人坐一人倚靠（慢速挑逗版）', 'two adults one seated and one leaning nearby with slower teasing pacing', 'two'),
  option('雙人手扶肩線（慢速挑逗版）', 'two adults hold each other near the shoulder line with slower teasing pacing', 'two'),
  option('雙人同看一面鏡（慢速挑逗版）', 'two adults look toward the same mirror-like surface with slower teasing pacing', 'two'),
  option('雙人呼吸節奏同步（慢速挑逗版）', 'two adults synchronize breathing rhythm with slower teasing pacing', 'two'),
  option('三人三角站位對視', 'three adults form a triangle stance with exchanged gazes', 'three'),
  option('三人前中後景層次', 'three adults arrange in foreground-midground-background layers', 'three'),
  option('三人輪流看向鏡頭', 'three adults alternate gaze toward camera', 'three'),
  option('三人共同整理布料', 'three adults arrange fabric together', 'three'),
  option('三人慢步靠近中心', 'three adults slowly move toward center', 'three'),
  option('三人一坐兩站', 'three adults with one seated and two standing', 'three'),
  option('三人兩側扶肩', 'three adults with side figures holding shoulders', 'three'),
  option('三人手部交會', 'three adults bring hands together', 'three'),
  option('三人共享視線焦點', 'three adults share one gaze focal point', 'three'),
  option('三人交錯回眸', 'three adults stagger and glance back', 'three'),
  option('三人高低層次坐姿', 'three adults sit in layered height levels', 'three'),
  option('三人慢舞環繞', 'three adults move in a slow circular rhythm', 'three'),
  option('三人共同拉開披肩', 'three adults open a shawl together', 'three'),
  option('三人一人主導兩人回應', 'three adults with one leading and two responding', 'three'),
  option('三人左右對稱靠近', 'three adults approach in left-right symmetry', 'three'),
  option('三人背靠背輪廓', 'three adults create back-to-back silhouettes', 'three'),
  option('三人共同整理飾品', 'three adults arrange accessories together', 'three'),
  option('三人手扶同一框線', 'three adults hold the same frame edge', 'three'),
  option('三人一前兩後構圖', 'three adults one in front and two behind', 'three'),
  option('三人兩前一後構圖', 'three adults two in front and one behind', 'three'),
  option('三人指尖連線', 'three adults connect fingertips as a line', 'three'),
  option('三人肩線交錯', 'three adults stagger shoulder lines', 'three'),
  option('三人共同舉起薄紗', 'three adults lift sheer fabric together', 'three'),
  option('三人互相交換視線', 'three adults exchange gazes among each other', 'three'),
  option('三人圍繞坐姿', 'three adults sit in a loose circle', 'three'),
  option('三人共同拿起道具', 'three adults lift a prop together', 'three'),
  option('三人節奏同步呼吸', 'three adults synchronize breathing rhythm', 'three'),
  option('三人一人靠近鏡頭', 'three adults with one moving closer to camera', 'three'),
  option('三人分層伸手', 'three adults extend hands in layers', 'three'),
  option('三人同向回身', 'three adults turn back in the same direction', 'three'),
  option('三人一人低語兩人傾聽', 'three adults with one whispering and two listening', 'three'),
  option('三人互相整理衣袖', 'three adults adjust each other’s sleeves', 'three'),
  option('三人交錯站坐跪', 'three adults mix standing sitting and kneeling levels', 'three'),
  option('三人兩側牽手', 'three adults with side figures holding hands', 'three'),
  option('三人中央主體凝視', 'three adults with central subject gazing directly', 'three'),
  option('三人共同遮擋構圖', 'three adults create shared coverage with fabric', 'three'),
  option('三人環繞主體', 'three adults loosely surround a central subject', 'three'),
  option('三人同時抬眼', 'three adults raise their eyes together', 'three'),
  option('三人一人披外套', 'three adults with one receiving a jacket drape', 'three'),
  option('三人手臂形成框景', 'three adults use arms to form a frame', 'three'),
  option('三人近遠距離錯位', 'three adults stagger near and far distances', 'three'),
  option('三人共同坐到邊緣', 'three adults sit along an edge together', 'three'),
  option('三人交錯髮絲與布料', 'three adults layer hair and fabric movement', 'three'),
  option('三人輪廓半遮', 'three adults create partially covered silhouettes', 'three'),
  option('三人共同收束緞帶', 'three adults gather a satin ribbon together', 'three'),
  option('三人左右引導中央', 'three adults side figures guide the central figure', 'three'),
  option('三人視線向同一方向', 'three adults gaze in one direction', 'three'),
  option('三人互扶腰背', 'three adults support waist and back lines', 'three'),
  option('三人慢慢散開', 'three adults slowly spread apart', 'three'),
  option('三人收攏成緊密構圖', 'three adults gather into a close composition', 'three'),
  option('三人三角站位對視（慢速挑逗版）', 'three adults form a triangle stance with exchanged gazes with slower teasing pacing', 'three'),
  option('三人前中後景層次（慢速挑逗版）', 'three adults arrange in foreground-midground-background layers with slower teasing pacing', 'three'),
  option('三人輪流看向鏡頭（慢速挑逗版）', 'three adults alternate gaze toward camera with slower teasing pacing', 'three'),
  option('三人共同整理布料（慢速挑逗版）', 'three adults arrange fabric together with slower teasing pacing', 'three'),
  option('三人慢步靠近中心（慢速挑逗版）', 'three adults slowly move toward center with slower teasing pacing', 'three'),
  option('三人一坐兩站（慢速挑逗版）', 'three adults with one seated and two standing with slower teasing pacing', 'three'),
  option('三人兩側扶肩（慢速挑逗版）', 'three adults with side figures holding shoulders with slower teasing pacing', 'three'),
  option('三人手部交會（慢速挑逗版）', 'three adults bring hands together with slower teasing pacing', 'three'),
  option('三人共享視線焦點（慢速挑逗版）', 'three adults share one gaze focal point with slower teasing pacing', 'three'),
  option('三人交錯回眸（慢速挑逗版）', 'three adults stagger and glance back with slower teasing pacing', 'three'),
  option('三人高低層次坐姿（慢速挑逗版）', 'three adults sit in layered height levels with slower teasing pacing', 'three'),
  option('三人慢舞環繞（慢速挑逗版）', 'three adults move in a slow circular rhythm with slower teasing pacing', 'three'),
  option('三人共同拉開披肩（慢速挑逗版）', 'three adults open a shawl together with slower teasing pacing', 'three'),
  option('三人一人主導兩人回應（慢速挑逗版）', 'three adults with one leading and two responding with slower teasing pacing', 'three'),
  option('三人左右對稱靠近（慢速挑逗版）', 'three adults approach in left-right symmetry with slower teasing pacing', 'three'),
  option('三人背靠背輪廓（慢速挑逗版）', 'three adults create back-to-back silhouettes with slower teasing pacing', 'three'),
  option('三人共同整理飾品（慢速挑逗版）', 'three adults arrange accessories together with slower teasing pacing', 'three'),
  option('三人手扶同一框線（慢速挑逗版）', 'three adults hold the same frame edge with slower teasing pacing', 'three'),
  option('三人一前兩後構圖（慢速挑逗版）', 'three adults one in front and two behind with slower teasing pacing', 'three'),
  option('三人兩前一後構圖（慢速挑逗版）', 'three adults two in front and one behind with slower teasing pacing', 'three'),
  option('三人指尖連線（慢速挑逗版）', 'three adults connect fingertips as a line with slower teasing pacing', 'three'),
  option('三人肩線交錯（慢速挑逗版）', 'three adults stagger shoulder lines with slower teasing pacing', 'three'),
  option('三人共同舉起薄紗（慢速挑逗版）', 'three adults lift sheer fabric together with slower teasing pacing', 'three'),
  option('三人互相交換視線（慢速挑逗版）', 'three adults exchange gazes among each other with slower teasing pacing', 'three'),
  option('三人圍繞坐姿（慢速挑逗版）', 'three adults sit in a loose circle with slower teasing pacing', 'three'),
  option('三人共同拿起道具（慢速挑逗版）', 'three adults lift a prop together with slower teasing pacing', 'three'),
  option('三人節奏同步呼吸（慢速挑逗版）', 'three adults synchronize breathing rhythm with slower teasing pacing', 'three'),
  option('三人一人靠近鏡頭（慢速挑逗版）', 'three adults with one moving closer to camera with slower teasing pacing', 'three'),
  option('三人分層伸手（慢速挑逗版）', 'three adults extend hands in layers with slower teasing pacing', 'three'),
  option('三人同向回身（慢速挑逗版）', 'three adults turn back in the same direction with slower teasing pacing', 'three'),
  option('三人一人低語兩人傾聽（慢速挑逗版）', 'three adults with one whispering and two listening with slower teasing pacing', 'three'),
  option('三人互相整理衣袖（慢速挑逗版）', 'three adults adjust each other’s sleeves with slower teasing pacing', 'three'),
  option('三人交錯站坐跪（慢速挑逗版）', 'three adults mix standing sitting and kneeling levels with slower teasing pacing', 'three'),
  option('三人兩側牽手（慢速挑逗版）', 'three adults with side figures holding hands with slower teasing pacing', 'three'),
  option('三人中央主體凝視（慢速挑逗版）', 'three adults with central subject gazing directly with slower teasing pacing', 'three'),
  option('三人共同遮擋構圖（慢速挑逗版）', 'three adults create shared coverage with fabric with slower teasing pacing', 'three'),
  option('三人環繞主體（慢速挑逗版）', 'three adults loosely surround a central subject with slower teasing pacing', 'three'),
  option('三人同時抬眼（慢速挑逗版）', 'three adults raise their eyes together with slower teasing pacing', 'three'),
  option('三人一人披外套（慢速挑逗版）', 'three adults with one receiving a jacket drape with slower teasing pacing', 'three'),
  option('三人手臂形成框景（慢速挑逗版）', 'three adults use arms to form a frame with slower teasing pacing', 'three'),
  option('三人近遠距離錯位（慢速挑逗版）', 'three adults stagger near and far distances with slower teasing pacing', 'three'),
  option('三人共同坐到邊緣（慢速挑逗版）', 'three adults sit along an edge together with slower teasing pacing', 'three'),
  option('三人交錯髮絲與布料（慢速挑逗版）', 'three adults layer hair and fabric movement with slower teasing pacing', 'three'),
  option('三人輪廓半遮（慢速挑逗版）', 'three adults create partially covered silhouettes with slower teasing pacing', 'three'),
  option('三人共同收束緞帶（慢速挑逗版）', 'three adults gather a satin ribbon together with slower teasing pacing', 'three'),
  option('三人左右引導中央（慢速挑逗版）', 'three adults side figures guide the central figure with slower teasing pacing', 'three'),
  option('三人視線向同一方向（慢速挑逗版）', 'three adults gaze in one direction with slower teasing pacing', 'three'),
  option('三人互扶腰背（慢速挑逗版）', 'three adults support waist and back lines with slower teasing pacing', 'three'),
  option('三人慢慢散開（慢速挑逗版）', 'three adults slowly spread apart with slower teasing pacing', 'three'),
  option('三人收攏成緊密構圖（慢速挑逗版）', 'three adults gather into a close composition with slower teasing pacing', 'three')
];

const dailyScenePairs = [
  ['高樓公寓客廳', 'high-rise apartment living room'], ['晨光公寓臥室', 'morning apartment bedroom'], ['極簡白色攝影棚', 'minimal white photo studio'], ['現代簡約浴室', 'modern minimal bathroom'], ['精品試衣間', 'boutique fitting room'],
  ['奢華化妝台前', 'luxury vanity area'], ['摩登 loft 公寓', 'modern loft apartment'], ['城市夜景陽台', 'city-view balcony'], ['復古唱片房', 'vintage record room'], ['私人鋼琴房', 'private piano room'],
  ['古典圖書館角落', 'classic library corner'], ['法式老宅書房', 'French townhouse study'], ['絲絨沙發會客室', 'velvet sofa parlor'], ['白色大理石走廊', 'white marble corridor'], ['歐式陽光溫室', 'European sunroom'],
  ['湖畔木屋室內', 'lakeside cabin interior'], ['熱帶度假別墅', 'tropical resort villa'], ['海景露台躺椅區', 'ocean-view terrace lounge'], ['私人泳池旁', 'private poolside'], ['山景度假木屋', 'mountain-view vacation cabin'],
  ['夜晚雨窗咖啡館', 'night cafe beside a rainy window'], ['柔粉色甜點店包廂', 'soft-pink dessert shop booth'], ['黑膠音樂酒廊', 'vinyl music lounge'], ['藍調錄音室', 'blues recording studio'], ['藝術家工作室', 'artist studio'],
  ['私人美術館展廳', 'private gallery exhibition hall'], ['現代藝術裝置空間', 'modern art installation space'], ['高級香水展示室', 'luxury perfume display room'], ['時尚攝影棚', 'fashion photo studio'], ['黑色背景攝影棚', 'black-backdrop photo studio'],
  ['紅毯後台休息室', 'red-carpet backstage lounge'], ['高級飯店套房', 'luxury hotel suite'], ['奢華飯店浴室', 'luxury hotel bathroom'], ['溫泉旅館房間', 'hot-spring inn room'], ['日式旅館榻榻米房', 'Japanese inn tatami room'],
  ['竹林旁溫泉小屋', 'hot-spring cottage beside bamboo grove'], ['巴黎老公寓陽台', 'Paris old-apartment balcony'], ['紐約高樓公寓客廳', 'New York high-rise living room'], ['地中海白牆房間', 'Mediterranean white-wall room'], ['摩洛哥拱門房間', 'Moroccan arch room'],
  ['午後窗邊床', 'afternoon window-side bed'], ['冬夜毛毯沙發區', 'winter blanket sofa area'], ['秋日壁爐客廳', 'autumn fireplace living room'], ['夏日海風臥室', 'summer sea-breeze bedroom'], ['春日花瓣白房間', 'spring petal white room'],
  ['大面積落地鏡舞蹈室', 'large-mirror dance studio'], ['高級健身房休息區', 'premium gym lounge area'], ['私人電影院沙發區', 'private cinema sofa area'], ['復古旅館走廊', 'retro hotel hallway'], ['空中花園休息室', 'sky-garden lounge']
];

const rareScenePairs = [
  ['金色宮殿內室', 'golden palace inner chamber'], ['皇家宮殿更衣室', 'royal palace dressing room'], ['紅色絲絨劇院包廂', 'red velvet theater box'], ['古典柱廊長階', 'classical colonnade stairway'], ['威尼斯鏡面沙龍', 'Venetian mirror salon'],
  ['水晶吊燈宴會廳', 'crystal-chandelier ballroom'], ['黑金主題派對房間', 'black-and-gold theme party room'], ['暗紅地下爵士酒吧', 'dark-red underground jazz bar'], ['暗紫夜店 VIP 包廂', 'dark-purple nightclub VIP booth'], ['霓虹酒吧角落', 'neon bar corner'],
  ['未來感賽博套房', 'futuristic cyber suite'], ['銀色未來實驗室', 'silver futuristic laboratory'], ['星艦觀景艙', 'starship observation cabin'], ['月面基地休息室', 'lunar-base lounge'], ['賽博霓虹街景室內', 'cyber-neon street-view interior'],
  ['粉色霓虹化妝間', 'pink neon makeup room'], ['玻璃天井長廊', 'glass-atrium corridor'], ['海邊玻璃屋', 'seaside glass house'], ['沙漠帳篷豪華房', 'luxury desert tent room'], ['豪華郵輪艙房', 'luxury cruise cabin'],
  ['私人花園玻璃亭', 'private garden glass pavilion'], ['玫瑰溫室長廊', 'rose greenhouse corridor'], ['月光花園涼亭', 'moonlit garden pavilion'], ['雪夜壁爐旁', 'snow-night fireplace area'], ['雨夜車窗旁', 'rain-night car-window interior'],
  ['霧面玻璃淋浴間', 'frosted-glass shower room'], ['大理石浴池與霧氣', 'marble bath with mist'], ['私人桑拿房外間', 'private sauna anteroom'], ['黑白棋盤地板房間', 'black-and-white checkerboard room'], ['古董鏡牆房間', 'antique mirror-wall room'],
  ['深色木質酒窖', 'dark wooden wine cellar'], ['深色皮革書房', 'dark leather study'], ['金色電梯廳', 'golden elevator hall'], ['玻璃帷幕辦公室夜景', 'glass-curtain office night view'], ['午夜城市天橋', 'midnight city skybridge'],
  ['水晶洞窟臥榻區', 'crystal cavern lounge bed area'], ['精靈森林樹屋', 'elf forest treehouse'], ['暗精靈地下聖殿', 'dark-elf underground sanctuary'], ['龍巢寶庫內室', 'dragon-hoard inner chamber'], ['人魚海底宮殿', 'merfolk underwater palace'],
  ['雲端天使露台', 'cloudborne angelic terrace'], ['惡魔城堡紅廳', 'demon-castle red hall'], ['月兔神社內殿', 'moon-rabbit shrine inner hall'], ['星空觀測穹頂', 'starry observatory dome'], ['時間齒輪密室', 'time-gear secret chamber'],
  ['鏡像迷宮沙龍', 'mirror-maze salon'], ['漂浮島花園', 'floating-island garden'], ['外星貴族會客艙', 'alien noble reception cabin'], ['夢境薄霧房間', 'dreamlike mist room'], ['古神祭壇遠景室', 'eldritch altar distant chamber']
];


const dailyAccessoryPairs = [
  ['珍珠耳環', 'pearl earrings'], ['細金項鍊', 'thin gold necklace'], ['銀色手環', 'silver bracelet'], ['絲巾', 'silk scarf'], ['髮夾', 'hair clip'],
  ['緞帶髮帶', 'ribbon hairband'], ['細框眼鏡', 'thin-frame glasses'], ['復古墨鏡', 'vintage sunglasses'], ['腕錶', 'wristwatch'], ['香水瓶', 'perfume bottle'],
  ['小手包', 'small clutch bag'], ['皮革手套', 'leather gloves'], ['蕾絲手套', 'lace gloves'], ['寬簷帽', 'wide-brim hat'], ['貝雷帽', 'beret'],
  ['高跟鞋', 'high heels'], ['長靴', 'long boots'], ['踝鍊', 'anklet'], ['戒指組', 'ring set'], ['胸針', 'brooch'],
  ['羽毛披肩', 'feather shawl'], ['薄紗披肩', 'tulle shawl'], ['緞面披肩', 'satin shawl'], ['花束', 'bouquet'], ['紅酒杯', 'wine glass'],
  ['咖啡杯', 'coffee cup'], ['書本', 'book'], ['復古相機', 'vintage camera'], ['黑膠唱片', 'vinyl record'], ['化妝刷', 'makeup brush'],
  ['口紅', 'lipstick'], ['粉餅盒', 'compact powder case'], ['鏡子', 'hand mirror'], ['手機', 'smartphone'], ['耳機', 'headphones'],
  ['羽毛扇', 'feather fan'], ['紙扇', 'paper fan'], ['摺扇', 'folding fan'], ['手提燈', 'hand lantern'], ['燭台', 'candlestick'],
  ['玫瑰花瓣', 'rose petals'], ['緞面枕頭', 'satin pillow'], ['毛毯', 'soft blanket'], ['相框', 'photo frame'], ['小托盤', 'small tray'],
  ['珠寶盒', 'jewelry box'], ['香氛蠟燭', 'scented candle'], ['水晶杯', 'crystal glass'], ['金屬腰鏈', 'metal waist chain'], ['透明雨傘', 'transparent umbrella']
];

const intimateAccessoryPairs = [
  ['絲質眼罩', 'silk blindfold styling prop'], ['羽毛逗弄棒', 'feather teasing wand'], ['緞帶手腕裝飾', 'ribbon wrist adornment'], ['愛心項圈', 'heart choker'], ['金屬頸環', 'metal collar necklace'],
  ['皮革腿環', 'leather thigh garter'], ['蕾絲腿環', 'lace thigh garter'], ['緞面綁帶', 'satin tie ribbon'], ['透明薄紗', 'transparent gauze veil'], ['珍珠身體鏈', 'pearl body chain'],
  ['金色身體鏈', 'gold body chain'], ['心形手拿牌', 'heart-shaped handheld sign'], ['羽毛尾飾', 'feather tail accessory'], ['貓耳髮箍', 'cat-ear headband'], ['兔耳髮箍', 'rabbit-ear headband'],
  ['狐耳髮箍', 'fox-ear headband'], ['惡魔角髮箍', 'demon-horn headband'], ['天使光環髮箍', 'angel halo headband'], ['小翅膀背飾', 'small wing back accessory'], ['腿部緞帶綁飾', 'leg ribbon wrap'],
  ['腰間緞帶綁飾', 'waist ribbon wrap'], ['皮革腰封道具', 'leather waist cincher prop'], ['蕾絲面紗', 'lace face veil'], ['薄紗眼紗', 'sheer eye veil'], ['唇印卡片', 'kiss-mark card'],
  ['心形抱枕', 'heart-shaped pillow'], ['絲質床巾', 'silk sheet prop'], ['緞面長手套', 'satin opera gloves'], ['皮革短手套', 'short leather gloves'], ['透明高跟鞋', 'clear high heels'],
  ['金屬腳鍊', 'metal ankle chain'], ['珍珠肩鏈', 'pearl shoulder chain'], ['胸前吊鏈裝飾', 'chest chain adornment'], ['腰側吊鏈', 'side-waist chain'], ['水晶流蘇', 'crystal tassel prop'],
  ['毛絨手銬造型道具', 'fluffy cuff styling prop'], ['緞面束縛造型帶', 'satin restraint-inspired styling ribbon'], ['皮革 harness 造型配件', 'leather harness-inspired accessory'], ['愛心貼紙', 'heart stickers'], ['星形亮片貼飾', 'star sequin stickers'],
  ['身體亮粉', 'body glitter'], ['香氛按摩油瓶', 'aroma massage oil bottle'], ['玫瑰金鍊條', 'rose-gold chain prop'], ['黑色蕾絲扇', 'black lace fan'], ['紅色緞帶蝴蝶結', 'red satin bow'],
  ['透明披覆薄膜', 'transparent drape film'], ['羽毛肩飾', 'feather shoulder accessory'], ['水鑽腰帶', 'rhinestone waist belt'], ['心形鎖頭吊飾', 'heart-lock charm'], ['小鈴鐺飾品', 'small bell charm accessory']
];

const ACCESSORY_OPTIONS = [
  ...dailyAccessoryPairs.map(([zh, en]) => option(zh, en, 'daily')),
  ...intimateAccessoryPairs.map(([zh, en]) => option(zh, en, 'intimate'))
];

const CUSTOMIZATION_OPTIONS = {
  genders: GENDER_OPTIONS,
  faces: FACE_OPTIONS,
  outfits: [
    ...dailyOutfitPairs.map(([zh, en]) => option(zh, en, 'daily')),
    ...rareOutfitPairs.map(([zh, en]) => option(zh, en, 'rare'))
  ],
  outfitColors,
  outfitMaterials: OUTFIT_MATERIAL_OPTIONS,
  outfitIntegrity: OUTFIT_INTEGRITY_OPTIONS,
  bodyFeatures,
  counts: COUNT_OPTIONS,
  accessories: ACCESSORY_OPTIONS,
  actions: ACTION_OPTIONS,
  poses: POSE_OPTIONS,
  scenes: [
    ...dailyScenePairs.map(([zh, en]) => option(zh, en, 'daily')),
    ...rareScenePairs.map(([zh, en]) => option(zh, en, 'rare'))
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

  if (containsCjk(conditions)) {
    return { ok: false, reason: '客製化條件會進入英文可複製提示詞，請改用英文填寫。' };
  }

  return { ok: true, conditions };
}

function containsCjk(value) {
  return /[\u3400-\u9fff]/.test(String(value ?? ''));
}

function toCopySafeEnglishSubject(value) {
  if (!containsCjk(value)) {
    return value;
  }

  return 'adult sensual visual direction based on the reviewed source request';
}

function getPresetOption(list, value) {
  const normalized = normalizeInput(value);

  if (!normalized || normalized === AI_OPTION.zh || normalized === AI_OPTION.en) {
    return AI_OPTION;
  }

  return list.find((preset) => preset.zh === normalized || preset.en === normalized) || AI_OPTION;
}

function getCustomizationOption(groupName, value) {
  const group = CUSTOMIZATION_OPTIONS[groupName] || [];
  return getPresetOption(group, value);
}

function getActionGroupForCount(countZh) {
  if (/三人/.test(countZh)) {
    return 'three';
  }

  if (/雙人|兩人/.test(countZh)) {
    return 'two';
  }

  return 'single';
}

function getActionsForCount(countZh) {
  const group = getActionGroupForCount(countZh);
  return ACTION_OPTIONS.filter((actionOption) => actionOption.rarity === group);
}

function isMultiCharacterCount(countZh) {
  return countZh !== AI_OPTION.zh && !/^單人/.test(countZh);
}

function validateCustomDetailInput(input) {
  const details = normalizeInput(input);

  if (!details) {
    return { ok: true, details: '', englishDetails: '' };
  }

  const blocked = BLOCKED_PATTERNS.find(({ pattern }) => pattern.test(details));
  if (blocked) {
    return { ok: false, reason: blocked.reason };
  }

  return {
    ok: true,
    details,
    englishDetails: containsCjk(details)
      ? 'user-provided multi-character detail customization, apply only as safety-compliant adult styling, roles, spacing, and interaction notes'
      : details
  };
}

function hasSceneLeak(text) {
  const chineseScenePattern = /臥室|房|套房|公寓|旅館|酒店|宮殿|酒吧|露台|花園|泳池|浴室|窗|床|沙發|舞台|圖書館/;
  const englishScenePattern = /\b(studio|bedroom|room|suite|apartment|hotel|palace|bar|terrace|garden|pool|bathroom|window|bed|sofa|stage|library)\b/i;
  return chineseScenePattern.test(text) || englishScenePattern.test(text);
}

function hasLightingLeak(text) {
  const chineseLightingPattern = /光|燈|陰影|亮|暗|曝光|逆光|柔光|硬光|聚光|補光/;
  const englishLightingPattern = /\b(lighting|light|shadow|bright|dark|exposure|rim|softbox|spotlight)\b/i;
  return chineseLightingPattern.test(text) || englishLightingPattern.test(text);
}

function hasActionLeak(text) {
  const chineseActionPattern = /站|坐|躺|跪|靠|扶|拉|摸|觸|整理|回眸|親吻|低語|呼吸|動作/;
  const englishActionPattern = /\b(stand|standing|sit|seated|recline|kneel|lean|hold|touch|kiss|whisper|breathe|motion|pose|gesture)\b/i;
  return chineseActionPattern.test(text) || englishActionPattern.test(text);
}

function hasExpressionLeak(text) {
  const chineseExpressionPattern = /表情|眼神|微笑|咬唇|挑眉|凝視|臉紅/;
  const englishExpressionPattern = /\b(expression|smile|lip-biting|raised brow|blush|gaze)\b/i;
  return chineseExpressionPattern.test(text) || englishExpressionPattern.test(text);
}

function checkElementBoundaries() {
  return {
    lightingHasSceneLeak: LIGHTING_DESCRIPTIONS.some(({ zh, en }) => hasSceneLeak(`${zh} ${en}`)),
    lightingHasExpressionLeak: LIGHTING_DESCRIPTIONS.some(({ zh, en }) => hasExpressionLeak(`${zh} ${en}`)),
    cameraHasSceneOrActionLeak: CAMERA_ANGLES.some(({ zh, en }) => hasSceneLeak(`${zh} ${en}`) || hasActionLeak(`${zh} ${en}`)),
    poseHasLightingOrSceneLeak: CUSTOMIZATION_OPTIONS.poses.some(({ zh, en }) => hasLightingLeak(`${zh} ${en}`) || hasSceneLeak(`${zh} ${en}`)),
    outfitHasSceneLeak: CUSTOMIZATION_OPTIONS.outfits.some(({ zh, en }) => hasSceneLeak(`${zh} ${en}`))
  };
}

function rewritePrompt(input, options = {}) {
  const validation = validatePrompt(input);
  if (!validation.ok) {
    return {
      ok: false,
      prompt: '',
      englishPrompt: '',
      chineseConfirmation: '',
      reason: validation.reason,
      screened: false
    };
  }

  const customConditionValidation = validateOptionalConditions(options.customConditions);
  if (!customConditionValidation.ok) {
    return {
      ok: false,
      prompt: '',
      englishPrompt: '',
      chineseConfirmation: '',
      reason: customConditionValidation.reason,
      screened: false
    };
  }

  const multiCharacterDetailValidation = validateCustomDetailInput(options.multiCharacterDetails);
  if (!multiCharacterDetailValidation.ok) {
    return {
      ok: false,
      prompt: '',
      englishPrompt: '',
      chineseConfirmation: '',
      reason: multiCharacterDetailValidation.reason,
      screened: false
    };
  }

  const intensity = INTENSITY_WORDS[options.intensity] ? options.intensity : 'medium';
  const lighting = getPresetOption(LIGHTING_DESCRIPTIONS, options.lighting);
  const camera = getPresetOption(CAMERA_ANGLES, options.camera);
  const composition = getPresetOption(COMPOSITION_STRUCTURES, options.composition);
  const artStyle = getPresetOption(ART_STYLES, options.artStyle);
  const race = getPresetOption(RACE_OPTIONS, options.race);
  const emotion = getPresetOption(EMOTION_OPTIONS, options.emotion || options.expression);
  const timePoint = getPresetOption(TIME_POINTS, options.timePoint);
  const gender = getCustomizationOption('genders', options.gender);
  const occupation = getPresetOption(OCCUPATION_OPTIONS, options.occupation);
  const ageBracket = getPresetOption(AGE_BRACKET_OPTIONS, options.ageBracket);
  const bodyProportion = getPresetOption(BODY_PROPORTION_OPTIONS, options.bodyProportion);
  const face = getCustomizationOption('faces', options.face);
  const outfit = getCustomizationOption('outfits', options.outfit);
  const outfitColor = getCustomizationOption('outfitColors', options.outfitColor);
  const outfitMaterial = getCustomizationOption('outfitMaterials', options.outfitMaterial);
  const bodyFeature = getCustomizationOption('bodyFeatures', options.bodyFeature);
  const outfitIntegrity = getCustomizationOption('outfitIntegrity', options.outfitIntegrity);
  const count = getCustomizationOption('counts', options.count);
  const scene = getCustomizationOption('scenes', options.scene);
  const accessory = getCustomizationOption('accessories', options.accessory);
  const actionGroupOptions = getActionsForCount(count.zh);
  const action = getPresetOption(actionGroupOptions, options.action);
  const pose = getCustomizationOption('poses', options.pose);

  let rewritten = validation.prompt;
  let chineseRewritten = validation.prompt;

  for (const { pattern, replacement } of PHRASE_RULES) {
    rewritten = rewritten.replace(pattern, replacement);
  }

  for (const { pattern, replacement } of CHINESE_PHRASE_RULES) {
    chineseRewritten = chineseRewritten.replace(pattern, replacement);
  }

  const chinesePrompt = [
    `主題／動作：${chineseRewritten}`,
    `性別：${gender.zh}`,
    `種族：${race.zh}`,
    `情緒：${emotion.zh}`,
    `時間點：${timePoint.zh}`,
    `年齡級距：${ageBracket.zh}`,
    `職業：${occupation.zh}`,
    `身材比例：${bodyProportion.zh}`,
    `臉蛋：${face.zh}`,
    `身上特徵：${bodyFeature.zh}`,
    `服裝：${outfit.zh}`,
    `服裝配色：${outfitColor.zh}`,
    `服裝材質：${outfitMaterial.zh}`,
    `服裝完整度：${outfitIntegrity.zh}`,
    `人數／構圖：${count.zh}`,
    `場景：${scene.zh}`,
    `配件／道具：${accessory.zh}`,
    `光感：${lighting.zh}`,
    `鏡位：${camera.zh}`,
    `構圖結構：${composition.zh}`,
    `畫風：${artStyle.zh}`,
    `動作：${action.zh}`,
    `體位／互動：${pose.zh}`,
    `氛圍：${INTENSITY_WORDS[intensity]}`,
    '優先規則：最上方原始提示詞若與下方客製化選項重樣或衝突，以原始提示詞為主',
    '安全：所有角色皆為明確 18+ 且合意的成年人，無脅迫、無未成年'
  ];

  if (customConditionValidation.conditions) {
    chinesePrompt.push(`客製化條件：${customConditionValidation.conditions}`);
  }

  const characterDetailLines = Array.isArray(options.characterDetails)
    ? options.characterDetails.map((detail, index) => ({ index: index + 1, ...validateCustomDetailInput(detail) }))
    : [];
  const safeCharacterDetailLines = isMultiCharacterCount(count.zh)
    ? characterDetailLines.filter((detail) => detail.ok && detail.details)
    : [];

  const shouldApplyMultiCharacterDetails = isMultiCharacterCount(count.zh) && multiCharacterDetailValidation.details;
  if (shouldApplyMultiCharacterDetails) {
    chinesePrompt.push(`多人細節客製化：${multiCharacterDetailValidation.details}`);
  }

  for (const characterDetail of safeCharacterDetailLines) {
    chinesePrompt.push(`角色${characterDetail.index}細節：${characterDetail.details}`);
  }

  const englishSubject = toCopySafeEnglishSubject(rewritten);

  const englishPrompt = [
    `subject/action: ${englishSubject}`,
    `gender: ${gender.en}`,
    `race: ${race.en}`,
    `emotion: ${emotion.en}`,
    `time point: ${timePoint.en}`,
    `age bracket: ${ageBracket.en}`,
    `occupation: ${occupation.en}`,
    `body proportion: ${bodyProportion.en}`,
    `face: ${face.en}`,
    `body feature: ${bodyFeature.en}`,
    `outfit: ${outfit.en}`,
    `outfit color palette: ${outfitColor.en}`,
    `outfit material: ${outfitMaterial.en}`,
    `outfit integrity: ${outfitIntegrity.en}`,
    `character count/composition: ${count.en}`,
    `scene: ${scene.en}`,
    `accessory/prop: ${accessory.en}`,
    `lighting: ${lighting.en}`,
    `camera angle/viewpoint: ${camera.en}`,
    `composition structure: ${composition.en}`,
    `art style: ${artStyle.en}`,
    `action: ${action.en}`,
    `position/interaction: ${pose.en}`,
    `tone: ${DEFAULT_STYLE.tone}`,
    `intensity: ${INTENSITY_WORDS[intensity]}`,
    `quality: ${DEFAULT_STYLE.quality}`,
    'priority: if the source prompt conflicts with or duplicates preset options, the source prompt takes precedence',
    `safety: ${DEFAULT_STYLE.safety}`
  ];

  if (customConditionValidation.conditions) {
    englishPrompt.push(`custom conditions: ${customConditionValidation.conditions}`);
  }

  if (shouldApplyMultiCharacterDetails) {
    englishPrompt.push(`multi-character custom details: ${multiCharacterDetailValidation.englishDetails}`);
  }

  for (const characterDetail of safeCharacterDetailLines) {
    englishPrompt.push(`character ${characterDetail.index} details: ${characterDetail.englishDetails}`);
  }

  return {
    ok: true,
    prompt: englishPrompt.join(', '),
    englishPrompt: englishPrompt.join(', '),
    chineseConfirmation: chinesePrompt.join('，'),
    reason: '',
    screened: true
  };
}

const IMAGE_TO_VIDEO_TIER_PROMPTS = [
  { score: 1, max: 1, zh: '安全生活動態，只有呼吸、眨眼與髮絲自然擺動', en: 'safe everyday motion with only breathing, blinking, and natural hair movement' },
  { score: 2, max: 2, zh: '生活感慢推鏡，加入輕微姿勢調整與布料自然晃動', en: 'everyday slow push-in with subtle posture adjustment and natural fabric sway' },
  { score: 3, max: 3, zh: '柔和魅力動態，強調眼神、微笑與肩頸細節', en: 'soft glamour motion emphasizing gaze, smile, shoulders, and neck details' },
  { score: 4, max: 4, zh: '輕度曖昧運鏡，手部整理服裝、身體重心自然轉移', en: 'lightly intimate camera motion, hands adjusting outfit, natural weight shift' },
  { score: 5, max: 5, zh: '性感但克制的動態，慢速靠近、髮絲與布料有節奏擺動', en: 'sensual but restrained motion, slow approach, rhythmic hair and fabric movement' },
  { score: 6, max: 6, zh: '成人向魅力動態，眼神更直接、姿態更有張力但不露骨', en: 'adult-only glamour motion, more direct gaze, stronger posture tension, non-explicit' },
  { score: 7, max: 7, zh: '高曖昧張力圖轉影，布料微滑、呼吸更明顯、保持藝術遮擋', en: 'high intimate-tension image-to-video, slight fabric slipping, more visible breathing, artistic coverage' },
  { score: 8, max: 8, zh: '強烈成人向但安全的動態，貼近鏡頭與身體曲線張力，避免性行為', en: 'intense adult-only but safe motion, closer camera presence and body-line tension, avoid sexual acts' },
  { score: 9, max: 9, zh: '高色情張力安全版，保留合意成人與遮擋，不新增露骨裸露', en: 'high sensual-tension safety version, consenting adults and coverage preserved, no new explicit nudity' },
  { score: 10, max: 10, zh: '最高張力安全邊界，僅允許藝術遮擋、慢速情緒與非露骨成人氛圍', en: 'maximum-tension safety boundary, only artistic coverage, slow emotion, and non-explicit adult mood' }
];

const IMAGE_TO_VIDEO_UNSAFE_REVISIONS = [
  { pattern: /未成年|幼|蘿莉|正太|學生|校服|child|minor|teen|underage/i, zh: '改成「所有角色皆為明確 18+ 成年人，成熟外觀與成人造型」。', en: 'Change it to clearly 18+ adult characters with mature styling and adult presentation.' },
  { pattern: /強迫|迷姦|下藥|昏迷|睡著|無意識|rape|forced|drugged|unconscious/i, zh: '改成「合意成人互動、清醒、主動回應、可隨時停止」。', en: 'Change it to consenting adult interaction, awake, actively responsive, and able to stop at any time.' },
  { pattern: /偷拍|偷窺|未同意|voyeur|hidden camera/i, zh: '改成「明確同意拍攝的成人寫真／電影鏡頭」。', en: 'Change it to an explicitly consented adult portrait or cinematic shot.' },
  { pattern: /血|虐殺|肢解|重傷|blood|gore|dismember/i, zh: '移除血腥暴力，改成「戲劇化但無傷害的姿態與光影」。', en: 'Remove graphic violence and use dramatic but non-harmful posing and lighting instead.' }
];

function clampScore(value) {
  return Math.min(10, Math.max(1, Math.round(value)));
}

function getImageToVideoTier(score) {
  const normalizedScore = clampScore(score);
  return IMAGE_TO_VIDEO_TIER_PROMPTS.find((tier) => tier.score === normalizedScore) || IMAGE_TO_VIDEO_TIER_PROMPTS.at(-1);
}

function getImageToVideoPromptChoices(score) {
  const normalizedScore = clampScore(score);
  const candidateScores = [normalizedScore - 1, normalizedScore, normalizedScore + 1]
    .filter((candidate) => candidate >= 1 && candidate <= 10);

  return candidateScores.map((candidate) => getImageToVideoTier(candidate));
}

function estimateExplicitnessScore({ skinToneRatio = 0, fileName = '', imageDescription = '', desiredMotion = '' } = {}) {
  const normalizedText = normalizeInput(`${fileName} ${imageDescription} ${desiredMotion}`);
  let score = 1 + (Number(skinToneRatio) || 0) * 8;

  const scoreRules = [
    { pattern: /泳裝|比基尼|bikini|swimwear/i, points: 1 },
    { pattern: /內衣|睡衣|蕾絲|lingerie|underwear|lace/i, points: 2 },
    { pattern: /性感|挑逗|曖昧|sensual|sexy|seductive|intimate/i, points: 2 },
    { pattern: /裸|裸體|全裸|nude|naked|topless/i, points: 3 },
    { pattern: /做愛|性交|高潮|性行為|sex|orgasm|explicit/i, points: 4 }
  ];

  for (const { pattern, points } of scoreRules) {
    if (pattern.test(normalizedText)) {
      score += points;
    }
  }

  return clampScore(score);
}

function buildImageToVideoRevision(input) {
  const normalized = normalizeInput(input);
  const matchedRevision = IMAGE_TO_VIDEO_UNSAFE_REVISIONS.find(({ pattern }) => pattern.test(normalized));

  if (matchedRevision) {
    return matchedRevision;
  }

  return {
    zh: '降低露骨程度，改成合意成人、藝術構圖、慢速運鏡與非露骨的情緒張力。',
    en: 'Reduce explicitness and rewrite it as consenting adults, artistic composition, slow camera movement, and non-explicit emotional tension.'
  };
}

function rewriteImageMotionToEnglish(input) {
  let rewritten = normalizeInput(input);

  for (const { pattern, replacement } of PHRASE_RULES) {
    rewritten = rewritten.replace(pattern, replacement);
  }

  if (!rewritten) {
    return '';
  }

  if (containsCjk(rewritten)) {
    return 'user-requested safe motion direction, interpreted only if it stays within adult consent and non-explicit safety boundaries';
  }

  return rewritten;
}

function createImageToVideoPrompt({
  fileName = '',
  imageDescription = '',
  desiredMotion = '',
  skinToneRatio = 0,
  durationSeconds = 5,
  motionStrength = 'medium'
} = {}) {
  const combinedForSafety = normalizeInput(`${fileName} ${imageDescription} ${desiredMotion}`);
  const blocked = BLOCKED_PATTERNS.find(({ pattern }) => pattern.test(combinedForSafety));

  if (blocked) {
    const revision = buildImageToVideoRevision(combinedForSafety);
    return {
      ok: false,
      prompt: '',
      englishPrompt: '',
      chineseConfirmation: '',
      reason: blocked.reason,
      screened: false,
      explicitnessScore: estimateExplicitnessScore({ skinToneRatio, fileName, imageDescription, desiredMotion }),
      suggestedFix: revision
    };
  }

  const explicitnessScore = estimateExplicitnessScore({ skinToneRatio, fileName, imageDescription, desiredMotion });
  const tier = getImageToVideoTier(explicitnessScore);
  const promptChoices = getImageToVideoPromptChoices(explicitnessScore);
  const requestedMotionEn = rewriteImageMotionToEnglish(desiredMotion);
  const safeDuration = Math.min(12, Math.max(3, Number(durationSeconds) || 5));
  const safeMotionStrength = ['subtle', 'medium', 'strong'].includes(motionStrength) ? motionStrength : 'medium';
  const sourceNoteZh = normalizeInput(imageDescription) || '由上傳圖片作為主體參考，維持角色、服裝、構圖與背景一致';
  const requestedMotionZh = normalizeInput(desiredMotion) || '未指定額外動態，依色情程度自動建議安全圖轉影動作';

  const chinesePrompt = [
    `圖轉影色情程度：${explicitnessScore}/10`,
    `中文對照詞意：${tier.zh}`,
    `圖片判定：${sourceNoteZh}`,
    `用戶希望：${requestedMotionZh}`,
    `修正策略：若希望內容過於露骨，改為合意成人、慢速運鏡、情緒張力、布料與髮絲自然動態`,
    '安全：所有角色皆為明確 18+ 且合意的成年人，無未成年、無非合意、無偷拍、無血腥暴力'
  ];

  const englishPrompt = [
    'image-to-video prompt',
    `adult-only explicitness rating: ${explicitnessScore}/10`,
    tier.en,
    'use the uploaded image as the visual reference, preserve identity-agnostic subject appearance, outfit, composition, and background',
    `duration: ${safeDuration} seconds`,
    `motion strength: ${safeMotionStrength}`,
    'add natural micro-movements, breathing, hair motion, fabric motion, cinematic camera easing, no abrupt morphing',
    'no new explicit nudity beyond the source image, no sexual-act animation, no coercion, no minors, no voyeur framing, no graphic violence',
    DEFAULT_STYLE.safety
  ];

  if (requestedMotionEn) {
    englishPrompt.push(`user requested safe motion: ${requestedMotionEn}`);
  }

  return {
    ok: true,
    prompt: englishPrompt.join(', '),
    englishPrompt: englishPrompt.join(', '),
    chineseConfirmation: chinesePrompt.join('，'),
    reason: '',
    screened: true,
    explicitnessScore,
    suggestedFix: null,
    promptChoices
  };
}

if (typeof module !== 'undefined') {
  module.exports = {
    rewritePrompt,
    validatePrompt,
    createImageToVideoPrompt,
    estimateExplicitnessScore,
    PHRASE_RULES,
    CHINESE_PHRASE_RULES,
    BLOCKED_PATTERNS,
    LIGHTING_DESCRIPTIONS,
    CAMERA_ANGLES,
    COMPOSITION_STRUCTURES,
    ART_STYLES,
    RACE_OPTIONS,
    EMOTION_OPTIONS,
    EXPRESSION_OPTIONS,
    TIME_POINTS,
    GENDER_OPTIONS,
    OCCUPATION_OPTIONS,
    BODY_PROPORTION_OPTIONS,
    AGE_BRACKET_OPTIONS,
    ACTION_OPTIONS,
    ACCESSORY_OPTIONS,
    OUTFIT_MATERIAL_OPTIONS,
    CUSTOMIZATION_OPTIONS,
    IMAGE_TO_VIDEO_TIER_PROMPTS,
    getImageToVideoPromptChoices,
    getActionsForCount,
    checkElementBoundaries
  };
}

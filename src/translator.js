const DEFAULT_STYLE = {
  tone: 'cinematic, sensual, adult-only',
  quality: 'high-detail, tasteful composition, coherent non-conflicting prompt elements',
  safety: 'all characters are clearly 18+, consenting adults; no coercion, no minors'
};

const BLOCKED_PATTERNS = [
  { pattern: /未成年|幼|蘿莉|正太|學生|校服|child|minor|teen|underage/i, reason: '內容疑似涉及未成年人。' },
  { pattern: /強迫|迷姦|下藥|昏迷|睡著|無意識|rape|forced|drugged|unconscious/i, reason: '內容疑似涉及非合意或無法同意情境。' },
  { pattern: /偷拍|偷窺|未同意|voyeur|hidden camera/i, reason: '內容疑似涉及未同意拍攝或偷窺。' },
  { pattern: /血(?!鬼)|虐殺|肢解|重傷|blood|gore|dismember/i, reason: '內容疑似涉及血腥暴力。' }
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

const INTENSITY_PROFILES = {
  soft: {
    zh: '柔和：保留距離感、表情含蓄、布料與遮擋完整，鏡頭動作慢且不壓迫',
    en: 'soft intensity profile: restrained distance, subtle expression, intact styling and tasteful coverage, slow non-pressuring camera language'
  },
  medium: {
    zh: '中等：成人曖昧張力明確，肢體語言更靠近，細節更豐富但仍保持安全遮擋',
    en: 'medium intensity profile: clear adult sensual tension, closer body language, richer detail, still safety-compliant with tasteful coverage'
  },
  strong: {
    zh: '強烈：眼神與姿態更直接，鏡頭距離更近，情慾張力更高但仍維持合意與非露骨邊界',
    en: 'strong intensity profile: more direct gaze and posture, closer framing, heightened adult erotic tension while staying consensual and non-explicit'
  }
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
  { zh: '超乾淨商業渲染風', en: 'ultra-clean commercial render, sharp focus, production-ready prompt style' },
  { zh: '透明水晶夢境風', en: 'transparent crystal dream style, refractive highlights, delicate fantasy polish' },
  { zh: '暗黑童話插畫風', en: 'dark fairytale illustration, moody ornament, sensual storybook atmosphere' },
  { zh: '洛可可粉金肖像風', en: 'rococo rose-gold portrait, ornate curves, delicate luxury detail' },
  { zh: '維多利亞哥德寫真風', en: 'Victorian gothic editorial, corseted silhouettes, antique shadow mood' },
  { zh: '未來奢華時尚風', en: 'futuristic luxury fashion, sleek metallic styling, premium sci-fi glamour' },
  { zh: '霓虹玻璃棚拍風', en: 'neon glass studio style, reflective panels, vivid color glow' },
  { zh: '柔霧膠片寫真風', en: 'soft mist film portrait, creamy grain, gentle nostalgic bloom' },
  { zh: '高彩度流行海報風', en: 'high-saturation pop poster, bold graphic color, crisp figure emphasis' },
  { zh: '低飽和文藝寫真風', en: 'low-saturation art portrait, quiet palette, refined emotional texture' },
  { zh: '日系寫真集封面風', en: 'Japanese photobook cover style, clean layout, intimate editorial softness' },
  { zh: '韓系偶像概念照風', en: 'K-pop idol concept photo style, polished styling, dramatic color accents' },
  { zh: '歐美時尚大片風', en: 'Western high-fashion campaign, confident styling, cinematic editorial scale' },
  { zh: '精品內衣型錄風', en: 'luxury lingerie lookbook style, tasteful adult styling, fabric detail focus' },
  { zh: '成人戀愛遊戲CG風', en: 'adult romance game CG style, polished character rendering, emotional close framing' },
  { zh: '乙女向華麗插畫風', en: 'otome-inspired ornate illustration, jeweled details, romantic elegance' },
  { zh: '奇幻酒館海報風', en: 'fantasy tavern poster style, warm dramatic color, character-led composition' },
  { zh: '魔法儀式光效風', en: 'magical ritual glow style, luminous symbols, fantasy atmospheric light' },
  { zh: '太空歌劇肖像風', en: 'space opera portrait, cosmic backdrop feeling, polished sci-fi costume detail' },
  { zh: '賽博偶像舞台風', en: 'cyber idol stage style, neon accents, glossy performance energy' },
  { zh: '復古科幻雜誌風', en: 'retro sci-fi magazine cover, painted futurism, bold dramatic shapes' },
  { zh: '蒸汽龐克華麗風', en: 'steampunk glamour style, brass details, smoky warm atmosphere' },
  { zh: '柴油龐克電影風', en: 'dieselpunk cinematic style, industrial elegance, high-contrast atmosphere' },
  { zh: '沙漠黃金幻想風', en: 'desert-gold fantasy style, sun-warmed palette, ornate textile texture' },
  { zh: '海底人魚幻想風', en: 'underwater merfolk fantasy, blue-green caustic light, flowing fabric motion' },
  { zh: '森林妖精柔光風', en: 'forest fae soft-light style, green-gold ambience, delicate magical texture' },
  { zh: '冰雪女王肖像風', en: 'ice-queen portrait style, silver-blue palette, crystalline highlights' },
  { zh: '火焰女神海報風', en: 'fire goddess poster style, amber glow, strong silhouette drama' },
  { zh: '月光吸血鬼寫真風', en: 'moonlit vampire editorial, cool silver light, velvet darkness' },
  { zh: '天使羽光插畫風', en: 'angelic feather-light illustration, pearly highlights, airy softness' },
  { zh: '惡魔紅黑海報風', en: 'demon red-black poster style, bold contrast, glossy shadow tension' },
  { zh: '花魁浮世繪混合風', en: 'oiran ukiyo-e fusion style, ornate patterns, modern sensual elegance' },
  { zh: '中國古風工筆風', en: 'Chinese gongbi-inspired style, fine lines, elegant textile detail' },
  { zh: '港風復古電影風', en: 'Hong Kong retro cinema style, neon warmth, nostalgic film contrast' },
  { zh: '台式寫真棚拍風', en: 'Taiwanese portrait studio style, soft glamour, approachable polish' },
  { zh: '法式香頌海報風', en: 'French chanson poster style, romantic typography mood, vintage elegance' },
  { zh: '義式奢華電影風', en: 'Italian luxury cinema style, warm sensual color, refined drama' },
  { zh: '北歐極簡寫真風', en: 'Nordic minimalist portrait, clean palette, calm sculptural composition' },
  { zh: '拉丁熱情海報風', en: 'Latine passion poster style, warm saturated palette, rhythmic composition' },
  { zh: '黑金奢華廣告風', en: 'black-gold luxury advertisement, glossy premium contrast, jewel highlights' },
  { zh: '銀白未來廣告風', en: 'silver-white futuristic advertisement, clean reflections, sleek material finish' },
  { zh: '糖果色夢幻插畫風', en: 'candy-color dreamy illustration, playful pastel shine, soft rounded detail' },
  { zh: '濃厚油彩肖像風', en: 'thick impasto oil portrait, visible brush texture, dramatic painted depth' },
  { zh: '鉛筆素描寫真風', en: 'pencil sketch portrait style, delicate shading, intimate line texture' },
  { zh: '炭筆高反差風', en: 'charcoal high-contrast style, smoky shadows, expressive figure contours' },
  { zh: '彩色鉛筆柔描風', en: 'colored-pencil soft rendering, textured paper feel, gentle color layering' },
  { zh: '玻璃反射藝術風', en: 'glass-reflection art style, layered reflections, prismatic composition' },
  { zh: '水面倒影電影風', en: 'water-reflection cinematic style, rippled highlights, moody symmetry' },
  { zh: '珠寶櫥窗廣告風', en: 'jewelry-window advertisement style, sparkling accents, luxury product polish' },
  { zh: '夢幻薄霧棚拍風', en: 'dreamy haze studio style, soft diffusion, luminous figure edges' },
  { zh: '超寫實高解析風', en: 'hyper-real high-resolution style, precise skin and fabric detail, premium realism' }
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
  ['精靈族', 'elf adult'],
  ['暗精靈族', 'dark elf adult'],
  ['半精靈族', 'half-elf adult'],
  ['高等精靈族', 'high elf adult'],
  ['森林精靈族', 'forest elf adult'],
  ['月光精靈族', 'moonlight elf adult'],
  ['天使族', 'angelic adult'],
  ['墮天使族', 'fallen angel adult'],
  ['惡魔族', 'demon adult'],
  ['魅魔族', 'succubus-like fantasy adult'],
  ['夢魔族', 'incubus-like fantasy adult'],
  ['龍裔族', 'dragonkin adult'],
  ['龍角人族', 'dragon-horned adult'],
  ['鳳凰裔族', 'phoenixkin adult'],
  ['獨角獸裔族', 'unicornkin adult'],
  ['狐族獸人', 'fox kemonomimi adult'],
  ['貓族獸人', 'cat kemonomimi adult'],
  ['狼族獸人', 'wolf kemonomimi adult'],
  ['兔族獸人', 'rabbit kemonomimi adult'],
  ['豹紋獸人族', 'leopard kemonomimi adult'],
  ['鹿角族', 'antlered fantasy adult'],
  ['鷹翼族', 'hawk-winged fantasy adult'],
  ['蛇裔族', 'serpentine fantasy adult'],
  ['人魚族', 'merfolk adult'],
  ['海妖族', 'siren fantasy adult'],
  ['章魚海裔族', 'cephalopod merfolk adult'],
  ['吸血族', 'vampire adult'],
  ['半吸血族', 'dhampir adult'],
  ['妖精族', 'fae adult'],
  ['花精族', 'floral fae adult'],
  ['蘑菇妖精族', 'mushroom fae adult'],
  ['樹精族', 'dryad adult'],
  ['月靈族', 'moon spirit adult'],
  ['星靈族', 'star spirit adult'],
  ['夢境靈族', 'dream spirit adult'],
  ['幽影族', 'shadowborn adult'],
  ['光翼族', 'light-winged fantasy adult'],
  ['黑翼族', 'black-winged fantasy adult'],
  ['水元素族', 'water elemental adult'],
  ['火焰精靈族', 'fire elemental adult'],
  ['風元素族', 'air elemental adult'],
  ['土元素族', 'earth elemental adult'],
  ['雷元素族', 'storm elemental adult'],
  ['水晶族', 'crystal humanoid adult'],
  ['寶石龍族', 'gem dragonkin adult'],
  ['機械人偶族', 'android doll adult'],
  ['仿生人族', 'synthetic humanoid adult'],
  ['賽博改造族', 'cybernetically enhanced adult'],
  ['外星貴族族', 'alien noble adult'],
  ['鏡像分身族', 'mirror-double fantasy adult']
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
  option('清晨 5 點（藍調冷光、露水空氣、低反差絲滑質感）', '5 AM blue-hour cool light, dewy air, low-contrast silky texture'),
  option('早晨 7 點（清新晨光、淡金色調、乾淨亞麻質感）', '7 AM fresh morning glow, pale gold color, clean linen-like texture'),
  option('上午 9 點（清透日光、中性色溫、俐落肌膚與布料質感）', '9 AM clear daylight, neutral color balance, crisp skin and fabric texture'),
  option('上午 11 點（明亮均衡日光、奶油高光、精修雜誌質感）', '11 AM bright balanced daylight, creamy highlights, polished editorial texture'),
  option('中午 12 點（正午清晰白光、乾淨色溫、銳利材質質感）', '12 PM high midday clarity, clean white color temperature, sharp material texture'),
  option('下午 2 點（午後暖光、蜂蜜米色調、柔軟可觸布料質感）', '2 PM relaxed afternoon warmth, honey beige color, soft tactile fabric texture'),
  option('下午 4 點（斜射柔光、暖琥珀色、天鵝絨般柔深質感）', '4 PM mellow slanted light, warm amber color, velvet-soft texture depth'),
  option('傍晚 5 點（金色夕陽柔光、蜜桃金色調、發亮膚質質感）', '5 PM golden-hour softness, peach-gold color, glowing skin texture'),
  option('傍晚 6 點（暮色交界光、藕紫橘色混合、平滑電影質感）', '6 PM dusk transition, mauve orange color mix, smooth cinematic texture'),
  option('晚上 8 點（夜晚親密暖光、酒紅鎢絲色、亮面陰影質感）', '8 PM evening intimacy, wine-red and warm tungsten color, glossy shadow texture'),
  option('晚上 10 點（深夜靜謐低光、深梅紫色、緞面陰影質感）', '10 PM late-evening quietness, deep plum color, satin shadow texture'),
  option('午夜 12 點（午夜冷調光、藍黑色、冷冽拋光質感）', '12 AM midnight mood, blue-black color, cool polished texture'),
  option('凌晨 1 點（午夜後微光、霧紫色、柔顆粒質感）', '1 AM after-midnight stillness, muted violet color, soft grain texture'),
  option('凌晨 3 點（深夜安靜冷光、墨藍色、低語霧面質感）', '3 AM quiet late-night atmosphere, ink-blue color, hushed matte texture'),
  option('雨後清晨（銀藍反射光、潮濕空氣、玻璃水潤質感）', 'morning after rain, silver-blue reflected light, damp glassy texture'),
  option('午後休息時刻（溫暖漫射光、放鬆暖色、棉質柔軟質感）', 'afternoon break moment, warm diffuse color, relaxed cotton-soft texture'),
  option('黃昏交界（玫瑰紫漸層光色、空氣感薄霧質感）', 'twilight transition, rose-violet gradient color, airy haze texture'),
  option('夜深人靜（低調暖點光、深色陰影、厚絨柔暗質感）', 'deep quiet night, low-key warm accents, plush shadow texture'),
  option('週末午後（慵懶日光、舒適暖色、針織般柔軟質感）', 'weekend afternoon, lazy sunlit color, cozy knit-like texture'),
  option('節日前夜（珠寶色暖閃光、節慶亮面質感）', 'holiday eve, jewel-toned warm sparkle, festive glossy texture')
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
  ['蕾絲深V連身衣', 'lace deep-V bodysuit'],
  ['黑色緞面吊帶裙', 'black satin slip dress'],
  ['透明薄紗罩衫', 'sheer mesh cover-up'],
  ['皮革束腰馬甲', 'leather waist corset'],
  ['開衩高腰短裙', 'high-slit waist skirt'],
  ['細肩帶亮面洋裝', 'glossy spaghetti-strap dress'],
  ['網紗拼接上衣', 'mesh-panel top'],
  ['露肩綁帶上衣', 'off-shoulder tie-front top'],
  ['短版緊身背心', 'cropped fitted camisole'],
  ['半透明蕾絲長袍', 'semi-sheer lace robe'],
  ['黑絲吊帶套裝', 'black stocking garter set'],
  ['玫瑰刺繡內搭', 'rose-embroidered intimate layer'],
  ['緞帶綁結胸衣', 'ribbon-tied bustier'],
  ['亮片迷你洋裝', 'sequined mini dress'],
  ['貓耳緊身裝', 'cat-ear fitted outfit'],
  ['兔耳短版套裝', 'bunny-ear cropped set'],
  ['女僕風情趣圍裙', 'maid-inspired teasing apron'],
  ['護士風短版制服', 'nurse-inspired cropped uniform'],
  ['秘書風窄裙套裝', 'secretary-inspired pencil-skirt set'],
  ['空服風貼身制服', 'flight-attendant-inspired fitted uniform'],
  ['皮革短外套內搭', 'leather short jacket with intimate inner layer'],
  ['珍珠鏈胸飾搭配', 'pearl-chain bust adornment styling'],
  ['金屬環扣連身裝', 'metal-ring bodysuit'],
  ['高衩旗袍改良款', 'high-slit modern qipao'],
  ['和風短襦袢造型', 'short kimono-inspired robe styling'],
  ['濕感亮面襯衫', 'wet-look glossy shirt'],
  ['肩帶微鬆背心裙', 'loosened-strap camisole dress'],
  ['鏤空腰線洋裝', 'cutout-waist dress'],
  ['後背交叉綁帶裙', 'cross-back lace-up dress'],
  ['側邊綁帶熱褲', 'side-tie hot shorts'],
  ['薄紗長手套搭配', 'sheer long-glove styling'],
  ['高腰吊襪帶搭配', 'high-waist garter styling'],
  ['絲質睡袍半披', 'half-draped silk robe'],
  ['豹紋貼身裙', 'leopard fitted dress'],
  ['酒紅蕾絲胸衣', 'wine-red lace corset'],
  ['銀色金屬感連身衣', 'silver metallic bodysuit'],
  ['黑色網眼長裙', 'black fishnet long skirt'],
  ['透明雨衣內搭', 'transparent raincoat with intimate inner styling'],
  ['緞面蝴蝶結套裝', 'satin bow-tie set'],
  ['低背開衩禮服', 'low-back slit gown'],
  ['鎖鏈腰飾短裝', 'chain-waist short outfit'],
  ['肩頸繞帶上衣', 'neck-wrap strappy top'],
  ['胸前挖空洋裝', 'front-cutout dress'],
  ['側乳線條背心', 'side-line fitted tank'],
  ['綁帶皮革短裙', 'lace-up leather mini skirt'],
  ['亮面乳膠短裝', 'glossy latex short outfit'],
  ['薄紗荷葉邊內搭', 'sheer ruffled intimate layer'],
  ['羽毛披肩內搭', 'feather capelet with intimate styling'],
  ['水鑽胸鏈搭配', 'rhinestone chest-chain styling'],
  ['黑金誘惑禮服', 'black-gold seduction gown']
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
  ['私人花園玻璃亭', 'private garden glass pavilion'], ['玫瑰溫室長廊', 'rose greenhouse corridor'], ['星夜花園涼亭', 'starlit garden pavilion'], ['雪夜壁爐旁', 'snow-night fireplace area'], ['雨夜車窗旁', 'rain-night car-window interior'],
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


const tabooAccessoryPairs = [
  ['古銅鑰匙串', 'antique bronze keyring'], ['天鵝絨邀請卡', 'velvet invitation card'], ['封蠟信封', 'wax-sealed envelope'], ['烏木摺扇', 'ebony folding fan'], ['黃銅懷錶', 'brass pocket watch'],
  ['星盤羅盤', 'astrolabe compass'], ['水晶占卜球', 'crystal scrying orb'], ['塔羅牌盒', 'tarot card box'], ['月相手鏡', 'moon-phase hand mirror'], ['香氛玻璃瓶', 'fragrance glass vial'],
  ['銀柄手杖', 'silver-handled cane'], ['羽毛面具', 'feather masquerade mask'], ['劇院望遠鏡', 'opera binoculars'], ['黑曜石戒盒', 'obsidian ring box'], ['珍珠信物盒', 'pearl keepsake box'],
  ['紅木珠寶匣', 'mahogany jewelry casket'], ['金屬書籤匕首', 'dagger-shaped metal bookmark'], ['魔法卷軸筒', 'spell scroll tube'], ['古籍皮革封套', 'antique book leather sleeve'], ['夜航船票', 'night-voyage ticket'],
  ['密會房卡', 'rendezvous room card'], ['宮廷通行徽章', 'court access badge'], ['星艦身份牌', 'starship identity tag'], ['龍鱗護符', 'dragon-scale talisman'], ['精靈葉冠', 'elf leaf circlet'],
  ['玫瑰金胸針', 'rose-gold brooch'], ['水晶髮梳', 'crystal hair comb'], ['寶石耳墜盒', 'gem earring case'], ['絲絨手拿包', 'velvet clutch'], ['霧面酒杯', 'matte goblet'],
  ['月光燭台', 'moonlit candlestick'], ['銀托香爐', 'silver incense burner'], ['琥珀香膏盒', 'amber balm case'], ['羽毛筆與墨水', 'quill and ink set'], ['密碼鎖筆記本', 'coded-lock notebook'],
  ['古典音樂盒', 'classic music box'], ['小型留聲機', 'mini gramophone'], ['黑膠唱片套', 'vinyl record sleeve'], ['劇本冊', 'script booklet'], ['舞會號碼牌', 'ballroom number card'],
  ['水晶酒瓶塞', 'crystal bottle stopper'], ['鎏金托盤', 'gilded tray'], ['雪茄木盒', 'cigar wooden box'], ['天文望遠鏡', 'astronomy telescope'], ['航海地圖卷', 'rolled nautical map'],
  ['古堡徽章', 'castle crest badge'], ['祕境門牌', 'hidden-room door plaque'], ['沙漏計時器', 'hourglass timer'], ['玻璃玫瑰罩', 'glass rose cloche'], ['午夜請帖', 'midnight invitation card']
];

const ACCESSORY_OPTIONS = [
  ...dailyAccessoryPairs.map(([zh, en]) => option(zh, en, 'daily')),
  ...intimateAccessoryPairs.map(([zh, en]) => option(zh, en, 'intimate'))
];


const ACTION_MODE_OPTIONS = [
  option('肩膀以上（舌頭／眼神／嘴唇）', 'above-shoulder facial, tongue, gaze, and lip movement', 'above'),
  option('手部動作（揉捏／擁抱／搓揉）', 'hand and arm movement, kneading, hugging, rubbing', 'hands'),
  option('下半身（張開／攤躺）', 'lower-body posing, opening lines, sprawled recline', 'lower'),
  option('不同姿態（躺著／坐著）', 'overall posture such as lying, sitting, kneeling, standing', 'posture')
];

const actionDetailSeeds = {
  above: {
    normalZh: ['自然微笑','直視鏡頭','側臉回望','低頭含笑','抬眼凝視','撥髮露耳','手扶下巴','輕閉眼呼吸','微張唇','挑眉側看','髮絲遮半臉','臉頰近鏡頭','耳環成焦點','頸側線條','柔和眨眼','嘴角微揚','輕吐氣','視線向下','視線上挑','三分之二臉角度','髮尾掃臉側','肩頸放鬆','唇部柔焦','眼神光明亮','安靜凝望'],
    normalEn: ['natural smile','direct camera gaze','side-profile glance back','lowered smiling gaze','raised-eye stare','hair tuck revealing the ear','hand supporting chin','closed-eye breathing','softly parted lips','raised-brow side gaze','hair veiling half the face','cheek close to camera','earring focal detail','clear neck-side line','gentle blink','subtle upturned mouth corner','soft exhale','downward gaze','upward teasing glance','three-quarter face angle','hair ends brushing face side','relaxed shoulder-neck line','soft-focus lip detail','bright catchlights in eyes','quiet steady gaze'],
    sensualZh: ['慢舔嘴唇','咬住下唇','舌尖碰唇角','阿黑顏挑逗表情','濕潤唇面特寫','吐舌靠近鏡頭','含住指尖','輕咬食指','舌尖掃過下唇','挑逗吹氣','用唇拉住薄紗','咬住緞帶末端','眼神迷離','唇峰慢舔','舌尖碰項鍊墜飾','用牙齒勾手套','濕唇貼近鏡頭','指尖分開唇瓣','咬唇忍笑','親吻手心','吻過肩頭','舔過肩頸線','用唇含珍珠鏈','半閉眼吐氣','舌尖停在唇邊'],
    sensualEn: ['slow lip lick','lower-lip bite','tongue touching lip corner','ahegao-inspired teasing expression','glossy wet-lip close-up','tongue-out camera approach','fingertips held between lips','soft index-finger bite','tongue sweeping lower lip','teasing breath','lips catching sheer fabric','biting satin ribbon end','hazy desirous gaze','slow lick across cupid bow','tongue touching necklace pendant','teeth catching glove edge','glossy lips close to camera','fingertips parting lips','lip-biting restrained smile','kiss to the palm','kiss across shoulder','lick along shoulder-neck line','lips holding pearl chain','half-lidded exhale','tongue paused near lips']
  },
  hands: {
    normalZh: ['整理頭髮','拉直衣領','扶住肩線','交疊在胸前','托住下巴','撫過髮尾','握住緞帶','調整手套','輕碰耳環','整理項鍊','扶住腰側','自然垂放','拉住外套邊','按住裙襬','輕握酒杯道具','撥髮到耳後','掌心朝鏡頭','指尖近唇邊','交握放膝上','握住椅背','扶住門框','輕按胸前布料','整理腰帶','拉住袖口','指尖勾飾品'],
    normalEn: ['arranging hair','straightening collar','resting on shoulder line','crossed over chest area','supporting chin','brushing hair ends','holding satin ribbon','adjusting gloves','touching earring','arranging necklace','at side waist','resting naturally','holding jacket edge','holding hem','holding glass prop','tucking hair behind ear','palm toward camera','fingertips near lips','clasped over knees','holding chair back','holding frame edge','pressing front fabric lightly','adjusting waist belt','pulling sleeve cuffs','hooking accessory'],
    sensualZh: ['揉捏胸前布料','擁抱貼近身體','搓揉手臂線條','慢滑過側腰','托住雙峰輪廓','揉過臀側布料','拉鬆肩帶','勾住腰鏈','慢拉領口','按住胸口起伏','搓揉大腿外側','擁住後頸','揉捏肩背線條','交纏在腰前','裙襬拉高但保持遮擋','拉住吊帶扣','慢撫腹側','環抱胸前布料','搓揉掌心靠近鏡頭','捏住緞帶繃緊','輕拍臀側','揉捏腰側布料','拉開外套露內搭','擁抱另一角色腰線','搓揉手腕內側'],
    sensualEn: ['kneading fabric over chest','hugging close to body','rubbing along arm line','slowly sliding over side waist','cupping bust silhouette over fabric','kneading fabric over hip side','loosening shoulder strap','hooking waist chain','slowly opening neckline','covering rising chest','rubbing outer thigh','embracing nape','kneading shoulder-back line','intertwined at front waist','lifting hem while maintaining coverage','holding garter clasp','slowly stroking side abdomen','hugging front fabric','rubbing palms then moving close to camera','pinching satin ribbon taut','lightly patting hip side','kneading waist-side fabric','opening jacket to reveal inner styling','embracing another adult waist','rubbing inner wrist']
  },
  lower: {
    normalZh: ['自然站姿','雙腿交叉站姿','側坐腿部延伸','膝蓋微彎','坐姿雙腳收攏','一腿前伸','階梯式坐姿','靠牆站姿','長裙垂落線條','步伐停格','跪坐保持端正','腳尖踮起','坐姿腿部斜放','盤腿坐姿','半跪拾起布料','側躺腿線延伸','站姿重心轉移','高低腿坐姿','腳踝交疊','膝上布料成焦點','腿部靠近畫面邊緣','腿部自然收折','扶膝坐姿','長靴線條展示','裙襬鋪展'],
    normalEn: ['natural standing stance','crossed-leg standing stance','side-seated leg extension','slight knee bend','seated feet together','one leg extended forward','tiered seated position','wall-lean standing stance','long skirt drape line','paused walking step','upright kneeling sit','tiptoe emphasis','seated legs angled aside','cross-legged seated pose','half-kneel picking up fabric','side-lying leg-line extension','standing weight shift','high-low leg seated pose','ankles crossed','fabric over knees focal detail','legs near frame edge','naturally folded legs','seated with hands near knees','boot line display','spread skirt hem'],
    sensualZh: ['腿部微張但保持遮擋','攤躺腿線延伸','跪姿腿部靠近鏡頭','側躺大腿成焦點','坐姿膝蓋分開但遮擋','一腿抬高調整鞋帶','慢拉絲襪邊緣','吊帶扣成焦點','臀腿曲線側向展示','低腰坐姿挑逗重心','趴姿腿部交疊','膝跪向鏡頭靠近','裙襬微掀但遮擋','腿部開合動勢停格','攤躺單腿彎曲','高衩布料露出腿線','腳尖勾住布料','大腿外側手掌停住','雙腿斜向鏡頭','臀側輕拍動作','跪坐腿部打開層次','腿部壓住薄紗','坐姿向後攤躺','側跪腰臀線突出','伸展到畫面前景'],
    sensualEn: ['legs slightly open while maintaining coverage','sprawled recline with leg-line extension','kneeling legs close to camera','side-lying thigh emphasis','seated knees apart while maintaining coverage','one leg raised to adjust shoe strap','slowly pulling stocking edge','garter clasp focal detail','side display of hip-leg curve','low seated teasing weight','prone crossed legs','kneeling approach toward camera','hem slightly lifted while maintaining coverage','paused opening-closing leg motion','sprawled recline with one leg bent','high-slit fabric showing leg line','toes hooking fabric','palm paused on outer thigh','legs angled toward camera','light hip-side pat motion','kneeling sit with opened leg layering','legs pressing sheer fabric','seated lean-back sprawl','side-kneel emphasizing waist-hip line','extension into foreground']
  },
  posture: {
    normalZh: ['站著正面構圖','站著側身構圖','坐著端正構圖','坐著前傾構圖','躺著側臥構圖','躺著仰臥構圖','跪坐端正構圖','半跪構圖','靠牆站立','靠椅坐姿','趴臥看向鏡頭','盤腿坐著','低身蹲姿','階梯高低坐姿','背對回望','框線旁倚靠','站坐轉換瞬間','一手支撐坐姿','雙手支撐跪姿','伸展手臂站姿','長袍披掛站姿','坐在邊緣','地面側坐','回身跨步','自然慢舞站位'],
    normalEn: ['standing front composition','standing side-turn composition','upright seated composition','seated forward lean composition','side-lying composition','supine lying composition','upright kneeling-sit composition','half-kneeling composition','standing wall lean','seated leaning on chair','prone looking toward camera','cross-legged seated','low crouch','tiered high-low seated','back-facing glance over shoulder','leaning by frame edge','between standing and sitting','seated with one-hand support','kneeling with both-hand support','standing with arms extended','standing with robe drape','seated on edge','side-seated on floor','turning step back','slow-dance standing placement'],
    sensualZh: ['慵懶攤躺','低腰坐著後仰','跪著向鏡頭靠近','趴著回頭挑逗','側躺腿線拉長','仰躺單腿彎曲','坐著膝蓋分開但遮擋','半跪腰線前傾','靠牆拱身','坐在邊緣低頭咬唇','跪坐整理吊帶','攤躺伸手邀請','側坐拉開衣料','趴臥腿部交疊','坐著向鏡頭滑近','仰躺薄紗覆身','跪姿背線突出','站姿肩帶滑落','側躺扶住腰臀','低身蹲姿抬眼','坐姿腿部斜向前景','半躺胸前布料成焦點','趴姿向前伸展','跪坐腿部開合層次','站姿臀腿側線展示'],
    sensualEn: ['languid sprawled recline','low seated backward lean','kneeling close toward camera','prone teasing glance back','side-lying elongated leg line','supine with one leg bent','seated knees apart with coverage','half-kneel forward waist line','arched wall lean','edge-seated lowered lip bite','kneeling-sit adjusting straps','sprawled reaching invitation','side-seated opening fabric','prone crossed legs','seated sliding closer to camera','supine under sheer fabric','kneeling with emphasized back line','standing with slipping shoulder strap','side-lying holding waist-hip line','low crouch with raised eyes','seated legs angled into foreground','half-reclined with front fabric focus','prone forward stretch','kneeling-sit with opened leg layering','standing side display of hip-leg line']
  }
};

function makeActionDetailOptions(mode) {
  const group = actionDetailSeeds[mode] || actionDetailSeeds.above;
  return [
    ...group.normalZh.map((zh, index) => option(`${ACTION_MODE_OPTIONS.find((item) => item.rarity === mode).zh}｜正常｜${zh}`, group.normalEn[index], mode)),
    ...group.sensualZh.map((zh, index) => option(`${ACTION_MODE_OPTIONS.find((item) => item.rarity === mode).zh}｜情慾｜${zh}`, group.sensualEn[index], mode))
  ];
}

const ACTION_DETAIL_OPTIONS = Object.fromEntries(Object.keys(actionDetailSeeds).map((mode) => [mode, makeActionDetailOptions(mode)]));
const ALL_ACTION_DETAIL_OPTIONS = Object.values(ACTION_DETAIL_OPTIONS).flat();

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
  actionModes: ACTION_MODE_OPTIONS,
  actionDetails: ALL_ACTION_DETAIL_OPTIONS,
  actions: ALL_ACTION_DETAIL_OPTIONS,
  poses: [],
  scenes: [
    ...dailyScenePairs.map(([zh, en]) => option(zh, en, 'daily')),
    ...rareScenePairs.map(([zh, en]) => option(zh, en, 'rare'))
  ]
};


function makePairs(prefixZh, prefixEn, count, rarity) {
  return Array.from({ length: count }, (_, index) => [`${prefixZh}${String(index + 1).padStart(3, '0')}`, `${prefixEn} ${index + 1}`]).map(([zh, en]) => option(zh, en, rarity));
}

function makeNamedPresetPairs(stylePairs, itemPairs, rarity) {
  return stylePairs.flatMap(([styleZh, styleEn]) => itemPairs.map(([itemZh, itemEn]) => option(`${styleZh}${itemZh}`, `${styleEn} ${itemEn}`, rarity)));
}

const maleNormalOutfitItems = [
  ['亞麻襯衫套裝', 'linen shirt set'], ['飛行員夾克穿搭', 'bomber jacket outfit'], ['羊毛西裝三件式', 'wool three-piece suit'], ['工裝背心長褲', 'utility vest and trousers'], ['針織開襟衫搭配', 'knit cardigan ensemble'],
  ['高領毛衣長褲', 'turtleneck and trousers'], ['長版風衣造型', 'long trench-coat styling'], ['騎士短外套套裝', 'rider jacket set'], ['寬版連帽上衣', 'oversized hoodie outfit'], ['襯衫馬甲搭配', 'shirt and waistcoat pairing'],
  ['機能口袋外套', 'technical pocket jacket'], ['絲巾西裝外套', 'scarf with blazer styling'], ['典禮燕尾服', 'ceremonial tailcoat'], ['復古背帶褲', 'vintage suspenders trousers'], ['丹寧外套穿搭', 'denim jacket outfit'],
  ['軍裝靈感長外套', 'military-inspired long coat'], ['騎馬靴長褲造型', 'riding boots and trousers'], ['廚師外套造型', 'chef jacket styling'], ['醫師長袍造型', 'doctor coat styling'], ['偵探大衣造型', 'detective overcoat styling'],
  ['星艦制服套裝', 'starship uniform set'], ['魔法師長袍', 'mage robe'], ['武士羽織造型', 'samurai haori styling'], ['禮賓制服套裝', 'concierge uniform set'], ['舞者寬褲造型', 'dancer wide-trouser styling']
];

const femaleNormalOutfitItems = [
  ['襯衫長裙套裝', 'shirt and long-skirt set'], ['針織洋裝穿搭', 'knit dress outfit'], ['西裝外套長褲', 'blazer and trousers'], ['長版風衣洋裝', 'trench dress styling'], ['高腰寬褲造型', 'high-waisted wide-trouser styling'],
  ['百褶裙學院造型', 'pleated-skirt academy styling'], ['絲巾襯衫套裝', 'scarf and blouse set'], ['連帽外套短裙', 'hoodie and skirt outfit'], ['丹寧外套洋裝', 'denim jacket over dress'], ['毛呢斗篷造型', 'wool cape styling'],
  ['典禮禮服長裙', 'ceremonial evening gown'], ['花藝圍裙洋裝', 'florist apron dress'], ['騎士外套長靴', 'rider jacket with tall boots'], ['空服制服套裝', 'flight-attendant uniform set'], ['護理師外套造型', 'nurse coat styling'],
  ['書卷風背心裙', 'bookish pinafore dress'], ['調香師工作服', 'perfumer workwear'], ['畫家罩衫長裙', 'painter smock and skirt'], ['魔法師披肩洋裝', 'mage capelet dress'], ['星艦艦長制服', 'starship captain uniform'],
  ['和風羽織長裙', 'haori and long-skirt styling'], ['歐式宮廷長裙', 'European court gown'], ['現代旗袍改良款', 'modern qipao dress'], ['芭蕾暖身套裝', 'ballet warm-up set'], ['茶會洋裝', 'tea-party dress']
];

const adultMaleOutfitItems = [
  ['絲緞睡袍造型', 'satin sleep-robe styling'], ['開領襯衫長褲', 'open-collar shirt and trousers'], ['貼身背心長褲', 'fitted tank and trousers'], ['半披西裝外套', 'half-draped blazer styling'], ['皮革束帶背心', 'leather strapped vest'],
  ['低腰休閒長褲', 'low-waist lounge trousers'], ['網紗內搭襯衫', 'mesh-layer shirt'], ['緞面家居套裝', 'satin lounge set'], ['展演胸 harness', 'performance chest harness'], ['長袍腰帶造型', 'belted robe styling'],
  ['透明感罩衫內搭', 'translucent overshirt with inner layer'], ['皮革手套西裝', 'leather-glove suit styling'], ['側開襟長衫', 'side-open long tunic'], ['貼身高領短袖', 'fitted short-sleeve turtleneck'], ['浴袍腰封造型', 'robe with waist cincher'],
  ['緞帶領結襯衫', 'ribbon-tie shirt'], ['薄針織家居服', 'light knit loungewear'], ['舞者貼身練習服', 'fitted dancer practice outfit'], ['金屬環扣背心', 'metal-ring vest'], ['夜店短外套穿搭', 'club cropped-jacket outfit'],
  ['宮廷寢袍造型', 'courtly night robe styling'], ['賽博貼身制服', 'cyber fitted uniform'], ['吸血鬼絲絨披風', 'vampire velvet cape styling'], ['溫泉浴衣半披', 'onsen yukata half-drape'], ['睡眠襯衫造型', 'sleep shirt styling']
];

const adultFemaleOutfitItems = [
  ['絲緞吊帶長裙', 'satin camisole gown'], ['蕾絲罩衫內搭', 'lace cover-up with inner layer'], ['束腰馬甲長裙', 'corset and long-skirt set'], ['薄紗披肩洋裝', 'tulle shawl over dress'], ['高衩晚禮服', 'high-slit evening gown'],
  ['緞面睡袍造型', 'satin sleep-robe styling'], ['露肩綁帶上衣', 'off-shoulder tie-front top'], ['貼身連體衣外搭', 'fitted bodysuit with outer layer'], ['長手套禮服造型', 'opera gloves with gown styling'], ['網紗拼接洋裝', 'mesh-panel dress'],
  ['皮革束腰短外套', 'leather waist-cincher jacket'], ['珍珠肩鏈長裙', 'pearl shoulder-chain gown'], ['蝴蝶結胸衣長裙', 'bow bustier and long skirt'], ['側綁帶短裙套裝', 'side-tie skirt set'], ['透明雨衣內搭', 'transparent raincoat with inner styling'],
  ['和風短襦袢造型', 'short kimono-inspired robe'], ['改良旗袍高衩款', 'modern qipao with high slit'], ['貓耳連身裝', 'cat-ear fitted outfit'], ['兔耳短版套裝', 'bunny-ear cropped set'], ['女僕圍裙造型', 'maid-inspired apron styling'],
  ['護士短版制服', 'nurse-inspired cropped uniform'], ['空服貼身制服', 'flight-attendant fitted uniform'], ['秘書窄裙套裝', 'secretary pencil-skirt set'], ['水鑽胸鏈洋裝', 'rhinestone chest-chain dress'], ['乳膠亮面短裝', 'glossy latex short outfit']
];

const normalOutfitStyles = [['都會', 'urban'], ['復古', 'retro'], ['休閒', 'casual'], ['典禮', 'ceremonial']];
const adultOutfitStyles = [['私密', 'private'], ['夜色', 'night'], ['誘惑', 'alluring'], ['貼身', 'body-hugging']];

const everydaySceneItems = [
  ['公寓客廳', 'apartment living room'], ['窗邊臥室', 'window-side bedroom'], ['白色攝影棚', 'white photo studio'], ['精品試衣間', 'boutique fitting room'], ['化妝台角落', 'vanity corner'],
  ['loft 公寓', 'loft apartment'], ['城市陽台', 'city balcony'], ['唱片房', 'record room'], ['鋼琴房', 'piano room'], ['圖書館角落', 'library corner'],
  ['老宅書房', 'townhouse study'], ['絲絨會客室', 'velvet parlor'], ['大理石走廊', 'marble corridor'], ['玻璃溫室', 'glass sunroom'], ['湖畔木屋', 'lakeside cabin'],
  ['度假別墅', 'resort villa'], ['海景露台', 'ocean-view terrace'], ['泳池旁休息區', 'poolside lounge'], ['咖啡館窗邊', 'cafe window seat'], ['甜點店包廂', 'dessert shop booth'],
  ['音樂酒廊', 'music lounge'], ['錄音室', 'recording studio'], ['藝術家工作室', 'artist studio'], ['美術館展廳', 'gallery exhibition hall'], ['空中花園', 'sky garden']
];

const mysteriousSceneItems = [
  ['宮殿內室', 'palace inner chamber'], ['劇院包廂', 'theater box'], ['古典柱廊長階', 'classical colonnade stairway'], ['鏡面沙龍', 'mirror salon'], ['水晶宴會廳', 'crystal ballroom'],
  ['地下爵士酒吧', 'underground jazz bar'], ['夜店 VIP 包廂', 'nightclub VIP booth'], ['賽博套房', 'cyber suite'], ['未來實驗室', 'futuristic laboratory'], ['星艦觀景艙', 'starship observation cabin'],
  ['月面基地休息室', 'lunar-base lounge'], ['霓虹街景室內', 'neon street-view interior'], ['玻璃天井長廊', 'glass atrium corridor'], ['海邊玻璃屋', 'seaside glass house'], ['沙漠帳篷豪華房', 'luxury desert tent room'],
  ['郵輪艙房', 'cruise cabin'], ['玫瑰溫室長廊', 'rose greenhouse corridor'], ['星夜花園涼亭', 'starlit garden pavilion'], ['雪夜壁爐旁', 'snow-night fireplace area'], ['古董鏡牆房間', 'antique mirror-wall room'],
  ['水晶洞窟休息區', 'crystal cavern lounge'], ['精靈森林樹屋', 'elf forest treehouse'], ['龍巢寶庫內室', 'dragon-hoard chamber'], ['星空觀測穹頂', 'starry observatory dome'], ['鏡像迷宮沙龍', 'mirror-maze salon']
];

const sceneStyles = [['都會', 'urban'], ['古典', 'classic'], ['現代', 'modern'], ['靜謐', 'quiet']];
const mysteriousSceneStyles = [['皇家', 'royal'], ['霓虹', 'neon'], ['奇幻', 'fantasy'], ['密會', 'secret-meeting']];

COMPOSITION_STRUCTURES.splice(0, COMPOSITION_STRUCTURES.length,
  ...[
    ['中央主體', 'centered subject'], ['三分法', 'rule of thirds'], ['對角線', 'diagonal layout'], ['前中後景', 'foreground midground background layers'], ['留白', 'negative space'],
    ['滿版', 'full frame'], ['水平線', 'horizontal line'], ['垂直線', 'vertical line'], ['引導線', 'leading lines'], ['框中框', 'frame within frame'],
    ['三角形', 'triangle layout'], ['圓形視覺', 'circular visual path'], ['左右平衡', 'left-right balance'], ['上下平衡', 'top-bottom balance'], ['偏心主體', 'off-center subject'],
    ['近大遠小', 'near-large far-small depth'], ['局部裁切', 'cropped detail'], ['半身', 'half body'], ['全身', 'full body'], ['電影寬幅', 'cinematic widescreen']
  ].map(([zh, en]) => option(zh, en))
);

COUNT_OPTIONS.splice(0, COUNT_OPTIONS.length,
  ...[
    ['單人', 'single adult'], ['雙人', 'two adults'], ['三人', 'three adults'], ['四人', 'four adults'], ['多人', 'multi-adult group'],
    ['單人半身', 'single adult half body'], ['單人全身', 'single adult full body'], ['雙人面對面', 'two adults face to face'], ['雙人並肩', 'two adults side by side'], ['雙人前後站位', 'two adults front-back placement'],
    ['三人並列', 'three adults side by side'], ['三人主副關係', 'three adults lead and supporting roles'], ['四人派對', 'four-adult party'], ['多人舞台', 'multi-adult stage group'], ['單人鏡前', 'single adult near mirror'],
    ['雙人鏡前', 'two adults near mirror'], ['單人坐姿', 'single adult seated'], ['單人站姿', 'single adult standing'], ['雙人高低差', 'two adults height contrast'], ['三人層次', 'three adults layered placement']
  ].map(([zh, en]) => option(zh, en))
);

bodyFeatures.splice(0, bodyFeatures.length,
  ...[
    ['鎖骨小痣','beauty mark near collarbone'], ['眼下淚痣','tear mole under eye'], ['肩上刺青','shoulder tattoo'], ['手腕刺青','wrist tattoo'], ['頸側紋身','neck-side tattoo'],
    ['耳骨環','helix piercing'], ['肚臍環','navel piercing'], ['鎖骨鏈印痕','subtle necklace mark'], ['手指戒痕','ring mark on finger'], ['淡雀斑','soft freckles'],
    ['曬痕邊界','subtle tan line'], ['指甲彩繪','nail art'], ['唇珠明顯','defined cupid bow'], ['眼尾亮片','eye-corner glitter'], ['肩頸香水光澤','perfume sheen on shoulder-neck'],
    ['髮際碎髮','baby hair at hairline'], ['耳後髮絲','hair strands behind ear'], ['膝側小痣','small mole near knee'], ['腳踝鍊痕','anklet mark'], ['掌心薄繭','subtle palm callus'],
    ['手背青筋','subtle hand veins'], ['肩帶壓痕','strap indentation'], ['腰鏈壓痕','waist-chain indentation'], ['手套壓痕','glove indentation'], ['淡疤點綴','subtle scar accent'],
    ['耳垂紅暈','earlobe blush'], ['眼影暈染','smudged eyeshadow'], ['髮尾挑染','dyed hair tips'], ['臨時貼紙','temporary sticker accent'], ['水鑽貼飾','rhinestone sticker accent']
  ].map(([zh, en]) => option(zh, en))
);

CUSTOMIZATION_OPTIONS.outfits.splice(0, CUSTOMIZATION_OPTIONS.outfits.length,
  ...makeNamedPresetPairs(normalOutfitStyles, maleNormalOutfitItems, 'male-normal'),
  ...makeNamedPresetPairs(adultOutfitStyles, adultMaleOutfitItems, 'male-sensual'),
  ...makeNamedPresetPairs(normalOutfitStyles, femaleNormalOutfitItems, 'female-normal'),
  ...makeNamedPresetPairs(adultOutfitStyles, adultFemaleOutfitItems, 'female-sensual')
);

CUSTOMIZATION_OPTIONS.scenes.splice(0, CUSTOMIZATION_OPTIONS.scenes.length,
  ...makeNamedPresetPairs(sceneStyles, everydaySceneItems, 'normal'),
  ...makeNamedPresetPairs(mysteriousSceneStyles, mysteriousSceneItems, 'taboo')
);

CUSTOMIZATION_OPTIONS.accessories.push(...tabooAccessoryPairs.map(([zh, en]) => option(zh, en, 'taboo')));

ACTION_MODE_OPTIONS.splice(0, ACTION_MODE_OPTIONS.length,
  option('姿態', 'posture', 'posture'),
  option('肩上', 'above shoulders', 'above'),
  option('手部', 'hands', 'hands'),
  option('下半身', 'lower body', 'lower')
);

for (const [modeKey, label] of [['above', '肩上'], ['hands', '手部'], ['lower', '下半身'], ['posture', '姿態']]) {
  for (const detail of ACTION_DETAIL_OPTIONS[modeKey] || []) {
    detail.zh = detail.zh.replace(/^.*?｜/, `${label}｜`);
  }
}

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


const CJK_TO_ENGLISH_DIRECTION_TERMS = [
  ['淫亂的迪士尼公主', 'debauched adult Disney-inspired princess archetype'],
  ['迪士尼公主', 'Disney-inspired princess archetype'],
  ['迪士尼', 'Disney-inspired classic animated fairy-tale style'],
  ['淫亂的', 'debauched adult sensual'],
  ['淫亂', 'debauched adult sensual'],
  ['放蕩', 'uninhibited adult sensual'],
  ['色氣', 'erotic glamour'],
  ['吸血鬼女王', 'vampire queen'],
  ['吸血鬼', 'vampire'],
  ['女王', 'queen'],
  ['珍珠配件', 'pearl accessories'],
  ['珍珠', 'pearl'],
  ['配件', 'accessories'],
  ['賽博偶像', 'cyber idol'],
  ['賽博', 'cyber'],
  ['偶像', 'idol'],
  ['優雅護理師', 'elegant nurse'],
  ['護理師', 'nurse'],
  ['護士', 'nurse'],
  ['原創角色', 'original character'],
  ['原創', 'original'],
  ['角色', 'character'],
  ['人設', 'character design'],
  ['作品風格', 'franchise-inspired style direction'],
  ['暗黑精靈', 'dark elf'],
  ['惡魔', 'demon'],
  ['天使', 'angel'],
  ['精靈', 'elf'],
  ['貓女', 'catwoman-inspired adult heroine'],
  ['兔女郎', 'bunny-inspired adult performer'],
  ['魔法師', 'mage'],
  ['女巫', 'witch'],
  ['公主', 'princess'],
  ['皇后', 'empress'],
  ['騎士', 'knight'],
  ['修女', 'adult nun-inspired styling'],
  ['秘書', 'secretary'],
  ['老師', 'adult teacher-inspired styling'],
  ['成熟', 'mature adult'],
  ['性感', 'sensual'],
  ['可愛', 'cute adult'],
  ['冷艷', 'cool glamorous'],
  ['華麗', 'ornate'],
  ['黑色', 'black'],
  ['白色', 'white'],
  ['紅色', 'red'],
  ['金色', 'gold'],
  ['銀色', 'silver'],
  ['蕾絲', 'lace'],
  ['緞面', 'satin'],
  ['皮革', 'leather']
];

function translateCjkDirectionToEnglish(value, fallback) {
  let translated = normalizeInput(value);

  for (const { pattern, replacement } of PHRASE_RULES) {
    translated = translated.replace(pattern, ` ${replacement} `);
  }

  for (const [zh, en] of CJK_TO_ENGLISH_DIRECTION_TERMS) {
    translated = translated.replaceAll(zh, ` ${en} `);
  }

  translated = translated
    .replace(/[\u3400-\u9fff]+/g, ' ')
    .replace(/[，。、；：！？「」『』（）【】]/g, ' ')
    .replace(/\b(the|a|an)\b/gi, ' ')
    .replace(/的/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return translated || fallback;
}

function toCopySafeEnglishSubject(value) {
  if (!containsCjk(value)) {
    return value;
  }

  return translateCjkDirectionToEnglish(value, 'adult sensual visual direction based on the reviewed source request');
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

function getActionDetailsForMode(modeZh) {
  const selectedMode = ACTION_MODE_OPTIONS.find((modeOption) => modeOption.zh === modeZh || modeOption.rarity === modeZh) || ACTION_MODE_OPTIONS[0];
  return ACTION_DETAIL_OPTIONS[selectedMode.rarity] || ACTION_DETAIL_OPTIONS.above;
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
      ? translateCjkDirectionToEnglish(details, 'safety-compliant adult cosplay character direction based on the reviewed Chinese notes')
      : details
  };
}

function validateCharacterDetailInput(input) {
  if (typeof input === 'object' && input !== null) {
    const details = normalizeInput(input.zh);
    const englishDetails = normalizeInput(input.en);

    if (!details && !englishDetails) {
      return { ok: true, details: '', englishDetails: '' };
    }

    const blocked = BLOCKED_PATTERNS.find(({ pattern }) => pattern.test(`${details} ${englishDetails}`));
    if (blocked) {
      return { ok: false, reason: blocked.reason };
    }

    return {
      ok: true,
      details,
      englishDetails: englishDetails || translateCjkDirectionToEnglish(details, 'safety-compliant adult per-character settings')
    };
  }

  return validateCustomDetailInput(input);
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

  const isDesignerMode = options.audienceMode === 'designer';
  const sensualIntentPattern = /淫亂|情慾|色情|色氣|放蕩|性感|裸|做愛|性交|自慰|高潮|sensual|erotic|sexual|nude|debauched/i;
  if (isDesignerMode && sensualIntentPattern.test(`${validation.prompt} ${options.cosplayPrompt || ''}`)) {
    return {
      ok: false,
      prompt: '',
      englishPrompt: '',
      chineseConfirmation: '',
      reason: '設友模式只支援一般設計方向；如需成人向創作，請重新登入色友並確認成年人合意規範。',
      screened: false
    };
  }

  const cosplayValidation = validateCustomDetailInput(options.cosplayPrompt);
  if (!cosplayValidation.ok) {
    return {
      ok: false,
      prompt: '',
      englishPrompt: '',
      chineseConfirmation: '',
      reason: cosplayValidation.reason,
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
  const actionMode = getPresetOption(ACTION_MODE_OPTIONS, options.actionMode);
  const actionDetail = getPresetOption(getActionDetailsForMode(actionMode.zh), options.actionDetail);

  let rewritten = validation.prompt;
  let chineseRewritten = validation.prompt;

  for (const { pattern, replacement } of PHRASE_RULES) {
    rewritten = rewritten.replace(pattern, replacement);
  }

  for (const { pattern, replacement } of CHINESE_PHRASE_RULES) {
    chineseRewritten = chineseRewritten.replace(pattern, replacement);
  }

  const characterDetailLines = Array.isArray(options.characterDetails)
    ? options.characterDetails.map((detail, index) => ({ index: index + 1, ...validateCharacterDetailInput(detail) }))
    : [];
  const safeCharacterDetailLines = isMultiCharacterCount(count.zh)
    ? characterDetailLines.filter((detail) => detail.ok && detail.details)
    : [];
  const hasPerCharacterDetails = safeCharacterDetailLines.length > 0;
  const chineseCharacterFields = hasPerCharacterDetails
    ? ['全局角色設定：已由角色卡分別指定，避免和 Cosplay 或全局選項重複']
    : [
      `性別：${gender.zh}`,
      `種族：${race.zh}`,
      `情緒：${emotion.zh}`,
      `年齡級距：${ageBracket.zh}`,
      `職業：${occupation.zh}`,
      `身材比例：${bodyProportion.zh}`,
      `臉蛋：${face.zh}`,
      `身上特徵：${bodyFeature.zh}`,
      `服裝：${outfit.zh}`,
      `服裝配色：${outfitColor.zh}`,
      `服裝材質：${outfitMaterial.zh}`,
      `服裝完整度：${outfitIntegrity.zh}`
    ];
  const englishCharacterFields = hasPerCharacterDetails
    ? ['global character defaults: omitted because per-character detail lines are specified to avoid duplicate settings']
    : [
      `gender: ${gender.en}`,
      `race: ${race.en}`,
      `emotion: ${emotion.en}`,
      `age bracket: ${ageBracket.en}`,
      `occupation: ${occupation.en}`,
      `body proportion: ${bodyProportion.en}`,
      `face: ${face.en}`,
      `body feature: ${bodyFeature.en}`,
      `outfit: ${outfit.en}`,
      `outfit color palette: ${outfitColor.en}`,
      `outfit material: ${outfitMaterial.en}`,
      `outfit integrity: ${outfitIntegrity.en}`
    ];

  const chinesePrompt = [
    `主題／動作：${chineseRewritten}`,
    ...chineseCharacterFields,
    `時間點：${timePoint.zh}`,
    `人數：${count.zh}`,
    `場景：${scene.zh}`,
    `配件／道具：${accessory.zh}`,
    `光感：${lighting.zh}`,
    `鏡位：${camera.zh}`,
    `構圖結構：${composition.zh}`,
    `畫風：${artStyle.zh}`,
    `動作／姿態類型：${actionMode.zh}`,
    `動作／姿態細項：${actionDetail.zh}`,
    `氛圍：${INTENSITY_WORDS[intensity]}`,
    `情慾強度運用：${INTENSITY_PROFILES[intensity].zh}`,
    '優先規則：最上方 Cosplay 若與下方客製化選項重樣或衝突，以 Cosplay 為主',
    '安全：所有角色皆為明確 18+ 且合意的成年人，無脅迫、無未成年'
  ];

  if (cosplayValidation.details) {
    chinesePrompt.push(`Cosplay：${cosplayValidation.details}`);
  }

  for (const characterDetail of safeCharacterDetailLines) {
    chinesePrompt.push(`角色${characterDetail.index}細節：${characterDetail.details}`);
  }

  const englishSubject = toCopySafeEnglishSubject(rewritten);

  const englishPrompt = [
    `subject/action: ${englishSubject}`,
    ...englishCharacterFields,
    `time point: ${timePoint.en}`,
    `character count: ${count.en}`,
    `scene: ${scene.en}`,
    `accessory/prop: ${accessory.en}`,
    `lighting: ${lighting.en}`,
    `camera angle/viewpoint: ${camera.en}`,
    `composition structure: ${composition.en}`,
    `art style: ${artStyle.en}`,
    `action/posture mode: ${actionMode.en}`,
    `action/posture detail: ${actionDetail.en}`,
    `tone: ${DEFAULT_STYLE.tone}`,
    `intensity: ${INTENSITY_WORDS[intensity]}`,
    `intensity application: ${INTENSITY_PROFILES[intensity].en}`,
    `quality: ${DEFAULT_STYLE.quality}`,
    'priority: if the Cosplay input conflicts with or duplicates global preset options, the Cosplay input takes precedence; per-character detail lines override only that specific character and omit AI-decide fields to avoid duplicate settings',
    `safety: ${DEFAULT_STYLE.safety}`
  ];

  if (cosplayValidation.details) {
    englishPrompt.push(`cosplay/character direction: ${cosplayValidation.englishDetails}`);
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


const GENERAL_IMAGE_TO_VIDEO_PROMPTS = [
  { score: 1, zh: '自然微動：眨眼、呼吸、髮絲與衣料輕微動態', en: 'natural micro-motion with blinking, breathing, subtle hair and clothing movement' },
  { score: 2, zh: '慢速推鏡：依圖片構圖輕推近主體並保留背景', en: 'slow push-in based on the image composition while preserving the background' },
  { score: 3, zh: '環境氛圍：光影、景深與背景細節輕微漂移', en: 'atmospheric motion with gentle light, depth-of-field, and background detail drift' },
  { score: 4, zh: '表情反應：自然視線、微笑與小幅轉頭', en: 'natural reaction motion with eye movement, a small smile, and a slight head turn' },
  { score: 5, zh: '電影循環：短距離平順運鏡，適合循環短片', en: 'smooth short cinematic camera move suitable for a looping clip' }
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

function rewriteDialogueToEnglish(input, label) {
  const text = normalizeInput(input);
  if (!text) {
    return '';
  }

  if (containsCjk(text)) {
    return `${label}: translate the user-provided Chinese dialogue into natural English, then animate subtle lip sync and matching reactions`;
  }

  return `${label}: ${text}`;
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
  motionStrength = 'medium',
  audienceMode = 'sensual',
  dialogueToCamera = '',
  dialogueBetweenCharacters = ''
} = {}) {
  const combinedForSafety = normalizeInput(`${fileName} ${imageDescription} ${desiredMotion} ${dialogueToCamera} ${dialogueBetweenCharacters}`);
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
  const isDesignerMode = audienceMode === 'designer';
  const promptChoices = isDesignerMode ? GENERAL_IMAGE_TO_VIDEO_PROMPTS : getImageToVideoPromptChoices(explicitnessScore);
  const tier = isDesignerMode ? promptChoices[0] : getImageToVideoTier(explicitnessScore);
  const requestedMotionEn = rewriteImageMotionToEnglish(desiredMotion);
  const dialogueToCameraEn = rewriteDialogueToEnglish(dialogueToCamera, 'dialogue to camera');
  const dialogueBetweenCharactersEn = rewriteDialogueToEnglish(dialogueBetweenCharacters, 'character-to-character dialogue');
  const safeDuration = Math.min(12, Math.max(3, Number(durationSeconds) || 5));
  const safeMotionStrength = ['subtle', 'medium', 'strong'].includes(motionStrength) ? motionStrength : 'medium';
  const sourceNoteZh = normalizeInput(imageDescription) || '由上傳圖片作為主體參考，維持角色、服裝、構圖與背景一致';
  const requestedMotionZh = normalizeInput(desiredMotion) || (isDesignerMode ? '未指定額外動態，依圖片內容提供自然圖轉影建議' : '未指定額外動態，依成人向強度自動建議安全圖轉影動作');
  const dialogueZh = [
    normalizeInput(dialogueToCamera) ? `跟鏡頭說：${normalizeInput(dialogueToCamera)}` : '',
    normalizeInput(dialogueBetweenCharacters) ? `角色間互動對話：${normalizeInput(dialogueBetweenCharacters)}` : ''
  ].filter(Boolean).join('；') || '未設定對話';

  const chinesePrompt = isDesignerMode
    ? [
      '圖轉影一般建議：依照上傳圖片內容生成 3-5 個自然動態方向',
      `中文對照詞意：${tier.zh}`,
      `圖片判定：${sourceNoteZh}`,
      `用戶希望：${requestedMotionZh}`,
      `對話：${dialogueZh}`,
      '安全：維持原圖角色、服裝、背景與構圖，不新增危險、血腥或未成年內容'
    ]
    : [
      `圖轉影成人向強度：${explicitnessScore}/10`,
      `中文對照詞意：${tier.zh}`,
      `圖片判定：${sourceNoteZh}`,
      `用戶希望：${requestedMotionZh}`,
      `對話：${dialogueZh}`,
      `修正策略：若希望內容過於露骨，改為合意成人、慢速運鏡、情緒張力、布料與髮絲自然動態`,
      '安全：所有角色皆為明確 18+ 且合意的成年人，無未成年、無非合意、無偷拍、無血腥暴力'
    ];

  const englishPrompt = isDesignerMode
    ? [
      'image-to-video prompt',
      `motion suggestion: ${tier.en}`,
      'use the uploaded image as the visual reference, preserve subject appearance, outfit, composition, and background',
      `duration: ${safeDuration} seconds`,
      `motion strength: ${safeMotionStrength}`,
      'add natural micro-movements based on the source image, cinematic camera easing, no abrupt morphing',
      'safe general-audience motion, no identity change, no graphic violence'
    ]
    : [
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
  if (dialogueToCameraEn) {
    englishPrompt.push(dialogueToCameraEn);
  }
  if (dialogueBetweenCharactersEn) {
    englishPrompt.push(dialogueBetweenCharactersEn);
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
    promptChoices,
    audienceMode: isDesignerMode ? 'designer' : 'sensual'
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
    INTENSITY_PROFILES,
    ACTION_MODE_OPTIONS,
    ACTION_DETAIL_OPTIONS,
    ALL_ACTION_DETAIL_OPTIONS,
    ACCESSORY_OPTIONS,
    OUTFIT_MATERIAL_OPTIONS,
    CUSTOMIZATION_OPTIONS,
    IMAGE_TO_VIDEO_TIER_PROMPTS,
    getImageToVideoPromptChoices,
    getActionDetailsForMode,
    checkElementBoundaries
  };
}

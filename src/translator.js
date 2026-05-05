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
  { zh: '左側主光，柔和斜射，右側保留淡陰影', en: 'soft key light from the left side, gentle diagonal illumination, subtle shadow on the right side' },
  { zh: '右側主光，柔和斜射，左側保留淡陰影', en: 'soft key light from the right side, gentle diagonal illumination, subtle shadow on the left side' },
  { zh: '正上方頂光，突出肩頸與頭髮輪廓', en: 'top light from directly above, emphasizing shoulders, neck, and hair outline' },
  { zh: '正面柔光，臉部均勻明亮，陰影很淡', en: 'front soft light, evenly bright face, very soft shadows' },
  { zh: '背後逆光，形成清楚邊緣光與剪影感', en: 'back light from behind, clear rim light and silhouette effect' },
  { zh: '左後方逆光，髮絲與肩線有亮邊', en: 'back-left rim light, bright edge on hair and shoulder line' },
  { zh: '右後方逆光，髮絲與側臉有亮邊', en: 'back-right rim light, bright edge on hair and side profile' },
  { zh: '左上 45 度主光，立體陰影自然', en: 'key light from upper-left 45 degrees, natural three-dimensional shadows' },
  { zh: '右上 45 度主光，立體陰影自然', en: 'key light from upper-right 45 degrees, natural three-dimensional shadows' },
  { zh: '低角度下方補光，臉部陰影被輕微托亮', en: 'low fill light from below, gently lifting facial shadows' },
  { zh: '左右雙側夾光，身體兩側都有細亮邊', en: 'dual side rim lights from left and right, thin highlights on both body edges' },
  { zh: '正面大面積柔光，皮膚質感乾淨柔順', en: 'large front softbox light, clean and smooth skin texture' },
  { zh: '窄束聚光，只集中照亮臉部與手部', en: 'narrow spotlight focused only on face and hands' },
  { zh: '柔和環形光，眼神有圓形高光', en: 'soft ring light, circular catchlights in the eyes' },
  { zh: '高反差硬光，陰影邊界銳利', en: 'high-contrast hard light with sharp shadow edges' },
  { zh: '低反差柔光，整體陰影過渡平滑', en: 'low-contrast soft light with smooth shadow transitions' },
  { zh: '左側冷光、右側暖光，形成雙色對比', en: 'cool light from the left and warm light from the right, two-tone contrast' },
  { zh: '右側冷光、左側暖光，形成雙色對比', en: 'cool light from the right and warm light from the left, two-tone contrast' },
  { zh: '背景微弱輪廓光，主體前方保持柔亮', en: 'subtle background rim light while the subject remains softly lit from the front' },
  { zh: '全局漫射光，沒有明顯硬陰影', en: 'global diffused light with no obvious hard shadows' }
];

const CAMERA_ANGLES = [
  { zh: '平視鏡位，自然人像構圖', en: 'eye-level shot, natural perspective, balanced portrait framing' },
  { zh: '低角度鏡位，人物存在感更強', en: 'low-angle shot, stronger presence, elongated body lines' },
  { zh: '高角度鏡位，親密俯視感', en: 'high-angle shot, intimate overview, soft vulnerability' },
  { zh: '過肩鏡位，前景肩線微模糊', en: 'over-the-shoulder shot, foreground shoulder blur, focused gaze' },
  { zh: '近景特寫，強調臉部表情', en: 'close-up shot, face and expression priority, shallow depth of field' },
  { zh: '極近特寫，強調眼神、嘴唇與指尖', en: 'extreme close-up shot, lips, eyes, and fingertips emphasized' },
  { zh: '中景鏡位，清楚呈現上半身動作', en: 'medium shot, upper body gesture and costume details clearly visible' },
  { zh: '全身鏡位，完整呈現身形與姿勢', en: 'full-body shot, complete silhouette and pose readable from head to toe' },
  { zh: '四分之三側身鏡位，增加立體感', en: 'three-quarter view, face and body turned diagonally for depth' },
  { zh: '側面輪廓鏡位，強調頸線與剪影', en: 'profile shot, side silhouette and neck line emphasized' },
  { zh: '背面回眸鏡位，呈現肩背線條', en: 'back view with head turned, elegant shoulder and spine line composition' },
  { zh: '正上方俯拍，構圖更圖像化', en: 'top-down shot, bed or floor layout visible, graphic composition' },
  { zh: '貼地低機位，前景更有張力', en: 'floor-level shot, foreground texture and dramatic perspective' },
  { zh: '鏡面反射鏡位，同時呈現本體與倒影', en: 'mirror reflection shot, subject and reflected pose both visible' },
  { zh: '門框構圖鏡位，以建築框線聚焦主體', en: 'doorway framing shot, voyeur-free staged composition through architecture' },
  { zh: '遠景定場鏡位，人物與空間一起呈現', en: 'wide establishing shot, character integrated with the full scene' },
  { zh: '傾斜鏡位，增加電影張力', en: 'Dutch angle shot, subtle tilt for tension and cinematic unease' },
  { zh: '逆光剪影鏡位，身體輪廓清楚', en: 'silhouette shot against bright background, readable body outline' },
  { zh: '手部特寫鏡位，強調觸感與布料細節', en: 'hands-focused insert shot, tactile gesture and fabric detail emphasized' },
  { zh: '雙人電影鏡位，兩位成年角色清楚入鏡', en: 'cinematic two-shot, both adult characters framed clearly with balanced spacing' }
];

const ART_STYLES = [
  { zh: '寫實雜誌攝影風', en: 'photorealistic editorial photography, natural skin texture, high-end retouching' },
  { zh: '電影劇照風', en: 'cinematic film still, 35mm lens feel, dramatic color grading' },
  { zh: '精品時尚封面風', en: 'luxury fashion magazine cover, polished styling, premium composition' },
  { zh: '高級閨房寫真風', en: 'fine-art boudoir photography, elegant shadows, restrained sensuality' },
  { zh: '古典油畫寫實風', en: 'classic oil painting realism, soft brush texture, museum portrait lighting' },
  { zh: '巴洛克肖像風', en: 'baroque-inspired portrait, rich contrast, ornate visual atmosphere' },
  { zh: '新黑色電影風', en: 'neo-noir photography, deep shadows, neon rim light, moody tension' },
  { zh: '柔和粉彩插畫風', en: 'soft pastel illustration, dreamy colors, delicate linework' },
  { zh: '日系動畫主視覺風', en: 'anime key visual style, clean rendering, expressive eyes, cinematic background' },
  { zh: '漫畫封面風', en: 'manga cover illustration, sharp line art, dramatic screentone depth' },
  { zh: '半寫實數位繪畫風', en: 'semi-realistic digital painting, painterly edges, detailed anatomy' },
  { zh: '高級伸展台時尚風', en: 'high-fashion runway editorial, bold silhouette, glossy styling' },
  { zh: '復古底片攝影風', en: 'vintage film photography, subtle grain, warm faded tones' },
  { zh: '拍立得親密快照風', en: 'polaroid-inspired intimate snapshot, soft flash, nostalgic mood' },
  { zh: '超現實夢境藝術風', en: 'surreal dreamscape art, symbolic props, floating atmosphere' },
  { zh: '賽博龐克霓虹風', en: 'cyberpunk neon illustration, reflective surfaces, futuristic palette' },
  { zh: '黑暗哥德浪漫風', en: 'dark gothic romance, velvet shadows, silver highlights, dramatic styling' },
  { zh: '極簡棚拍肖像風', en: 'minimalist studio portrait, clean backdrop, precise body lines' },
  { zh: '浪漫水彩風', en: 'romantic watercolor wash, translucent layers, gentle color bleeding' },
  { zh: '新藝術海報風', en: 'Art Nouveau poster style, flowing ornamental lines, elegant framing' },
  { zh: '裝飾藝術奢華風', en: 'Art Deco glamour, geometric framing, gold accents, sleek luxury' },
  { zh: '文藝復興肖像氛圍', en: 'Renaissance portrait mood, balanced composition, soft sfumato lighting' },
  { zh: '印象派光影研究風', en: 'impressionist light study, visible strokes, luminous color vibration' },
  { zh: '高細節 3D 渲染風', en: 'hyper-detailed 3D render, cinematic materials, realistic fabric simulation' },
  { zh: '柔焦美妝廣告風', en: 'soft glam beauty campaign, luminous makeup, creamy highlights' },
  { zh: '黑白時尚攝影風', en: 'editorial black-and-white photography, sculptural contrast, timeless mood' },
  { zh: '高亮柔白棚拍風', en: 'high-key angelic studio style, bright airy tones, soft exposure' },
  { zh: '低調暗背景戲劇肖像風', en: 'low-key dramatic portrait, black background, focused rim lighting' },
  { zh: '韓系 Webtoon 插畫風', en: 'Korean webtoon illustration, smooth shading, stylish character design' },
  { zh: '日系視覺小說 CG 風', en: 'Japanese visual novel CG style, polished lighting, emotional framing' },
  { zh: '奇幻角色設計風', en: 'fantasy character art, ornate costume details, magical ambience' },
  { zh: '神話女神插畫風', en: 'mythic goddess illustration, radiant aura, heroic scale' },
  { zh: '精品香水廣告風', en: 'luxury perfume advertisement, sensual elegance, glossy product-like finish' },
  { zh: '音樂錄影帶畫面風', en: 'music video frame, dynamic colored lights, performance energy' },
  { zh: '時裝型錄攝影風', en: 'fashion lookbook photography, clean poses, precise garment detail' },
  { zh: '建築室內雜誌風', en: 'architectural interior editorial, strong lines, refined spatial composition' },
  { zh: '浪漫燭光寫實風', en: 'romantic candlelit realism, warm glow, textured shadows' },
  { zh: '雨夜電影攝影風', en: 'rainy-night cinematic photography, reflections, blue-orange contrast' },
  { zh: '柔焦魅力攝影風', en: 'soft-focus glamour photography, gentle bloom, polished skin highlights' },
  { zh: '紀實親密肖像風', en: 'documentary-style intimate portrait, natural framing, believable emotion' },
  { zh: '空靈奇幻寫實風', en: 'ethereal fantasy realism, mist, glow particles, delicate atmosphere' },
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


const RACE_OPTIONS = [
  { zh: '人類', en: 'human' },
  { zh: '精靈族', en: 'elf' },
  { zh: '暗精靈族', en: 'dark elf' },
  { zh: '半精靈族', en: 'half-elf' },
  { zh: '天使族', en: 'angelic race' },
  { zh: '墮天使族', en: 'fallen angel race' },
  { zh: '惡魔族', en: 'demon race' },
  { zh: '魅魔族', en: 'succubus-inspired fantasy race' },
  { zh: '吸血族', en: 'vampire race' },
  { zh: '狼人族', en: 'werewolf race' },
  { zh: '狐族', en: 'fox race' },
  { zh: '貓族', en: 'cat race' },
  { zh: '兔族', en: 'rabbit race' },
  { zh: '龍族', en: 'dragon race' },
  { zh: '半龍族', en: 'half-dragon race' },
  { zh: '蛇族', en: 'serpent race' },
  { zh: '海妖族', en: 'siren race' },
  { zh: '人魚族', en: 'mermaid race' },
  { zh: '妖精族', en: 'fairy race' },
  { zh: '花妖族', en: 'flower spirit race' },
  { zh: '樹靈族', en: 'tree spirit race' },
  { zh: '雪女族', en: 'snow spirit race' },
  { zh: '鬼族', en: 'oni race' },
  { zh: '靈體族', en: 'spirit race' },
  { zh: '女神族', en: 'goddess race' },
  { zh: '半神族', en: 'demigod race' },
  { zh: '機械人族', en: 'android race' },
  { zh: '仿生人族', en: 'bionic human race' },
  { zh: '賽博改造人', en: 'cybernetic enhanced human' },
  { zh: '外星族', en: 'alien race' },
  { zh: '星靈族', en: 'astral spirit race' },
  { zh: '月影族', en: 'moon shadow race' },
  { zh: '太陽族', en: 'sun-born race' },
  { zh: '水晶族', en: 'crystal race' },
  { zh: '火焰族', en: 'fire elemental race' },
  { zh: '冰霜族', en: 'frost elemental race' },
  { zh: '雷電族', en: 'thunder elemental race' },
  { zh: '風行族', en: 'wind runner race' },
  { zh: '沙漠族', en: 'desert tribe fantasy race' },
  { zh: '森林族', en: 'forest tribe fantasy race' },
  { zh: '深海族', en: 'deep sea race' },
  { zh: '翼人族', en: 'winged humanoid race' },
  { zh: '獸人族', en: 'orc fantasy race' },
  { zh: '豹族', en: 'leopard race' },
  { zh: '鹿角族', en: 'antlered fantasy race' },
  { zh: '鳥羽族', en: 'feathered bird race' },
  { zh: '幽影族', en: 'shadow race' },
  { zh: '幻術族', en: 'illusionist race' },
  { zh: '魔法師族', en: 'mage race' },
  { zh: '皇家貴族', en: 'royal noble race' }
];

const EXPRESSION_OPTIONS = [
  { zh: '溫柔微笑', en: 'gentle smile' },
  { zh: '自信淺笑', en: 'confident slight smile' },
  { zh: '害羞低頭', en: 'shy downward gaze' },
  { zh: '迷離眼神', en: 'dreamy unfocused gaze' },
  { zh: '冷豔凝視', en: 'cool elegant stare' },
  { zh: '挑逗眨眼', en: 'playful wink' },
  { zh: '慵懶半睜眼', en: 'lazy half-lidded eyes' },
  { zh: '微醺紅暈', en: 'slightly tipsy blush' },
  { zh: '驚喜睜眼', en: 'surprised wide eyes' },
  { zh: '專注凝望', en: 'focused gaze' },
  { zh: '咬唇表情', en: 'soft lip-biting expression' },
  { zh: '輕吐氣表情', en: 'soft exhale expression' },
  { zh: '甜美笑容', en: 'sweet smile' },
  { zh: '壓抑笑意', en: 'suppressed smile' },
  { zh: '高傲抬眼', en: 'proud upward gaze' },
  { zh: '無辜眼神', en: 'innocent gaze' },
  { zh: '狡黠眼神', en: 'mischievous gaze' },
  { zh: '深情注視', en: 'affectionate stare' },
  { zh: '放鬆閉眼', en: 'relaxed closed eyes' },
  { zh: '側臉回眸', en: 'side glance over shoulder' },
  { zh: '微張唇表情', en: 'slightly parted lips' },
  { zh: '安靜沉思', en: 'quiet contemplative expression' },
  { zh: '誘惑微笑', en: 'seductive smile' },
  { zh: '柔軟撒嬌', en: 'soft affectionate expression' },
  { zh: '堅定直視', en: 'steady direct gaze' },
  { zh: '輕皺眉', en: 'subtle furrowed brows' },
  { zh: '臉頰泛紅', en: 'flushed cheeks' },
  { zh: '呼吸急促感', en: 'breathless expression' },
  { zh: '愉悅放鬆', en: 'pleased relaxed expression' },
  { zh: '期待眼神', en: 'expectant eyes' },
  { zh: '俏皮吐舌', en: 'playful tongue-out expression' },
  { zh: '女王般冷笑', en: 'queenly smirk' },
  { zh: '柔和憐愛', en: 'tender caring expression' },
  { zh: '沉醉表情', en: 'entranced expression' },
  { zh: '克制忍耐', en: 'restrained patient expression' },
  { zh: '眼角帶笑', en: 'smiling eyes' },
  { zh: '楚楚可憐', en: 'delicate vulnerable gaze' },
  { zh: '壞笑表情', en: 'naughty grin' },
  { zh: '平靜凝視', en: 'calm gaze' },
  { zh: '驕傲微笑', en: 'proud smile' },
  { zh: '低聲呢喃感', en: 'whispering expression' },
  { zh: '感動濕潤眼眶', en: 'moved watery eyes' },
  { zh: '神秘微笑', en: 'mysterious smile' },
  { zh: '放空眼神', en: 'distant blank gaze' },
  { zh: '親密依戀', en: 'intimate attached expression' },
  { zh: '戲劇化凝視', en: 'dramatic stare' },
  { zh: '柔弱喘息感', en: 'soft breathy expression' },
  { zh: '成熟從容', en: 'mature composed expression' },
  { zh: '羞澀偷看', en: 'shy stolen glance' },
  { zh: '勝利般微笑', en: 'victorious smile' }
];

const TIME_POINTS = [
  { zh: '清晨 5 點，微亮冷色調', en: '5 AM early dawn, faint cool light' },
  { zh: '早晨 7 點，清新自然光', en: '7 AM morning, fresh natural light' },
  { zh: '上午 9 點，明亮乾淨光線', en: '9 AM bright clean daylight' },
  { zh: '上午 11 點，接近正午的高亮感', en: '11 AM near-noon bright light' },
  { zh: '正午 12 點，強烈白日光', en: '12 PM noon, strong daylight' },
  { zh: '下午 2 點，穩定日光', en: '2 PM stable afternoon daylight' },
  { zh: '下午 4 點，光線開始變暖', en: '4 PM late afternoon, warming light' },
  { zh: '傍晚 5 點，柔和金色光', en: '5 PM golden-hour soft light' },
  { zh: '黃昏 6 點，橘金色調', en: '6 PM dusk, orange-gold tones' },
  { zh: '日落後 7 點，藍紫暮色', en: '7 PM after sunset, blue-purple twilight' },
  { zh: '晚上 8 點，室內暖光為主', en: '8 PM evening, warm indoor light' },
  { zh: '晚上 9 點，夜色與柔光混合', en: '9 PM night mood with soft light' },
  { zh: '晚上 10 點，低照度夜間氛圍', en: '10 PM low-light night atmosphere' },
  { zh: '深夜 11 點，安靜暗色調', en: '11 PM quiet dark tones' },
  { zh: '午夜 12 點，高反差夜景感', en: '12 AM midnight, high-contrast night mood' },
  { zh: '凌晨 1 點，私密低光環境', en: '1 AM intimate low-light setting' },
  { zh: '凌晨 2 點，深夜冷色調', en: '2 AM deep-night cool tones' },
  { zh: '凌晨 3 點，極低光與陰影', en: '3 AM very low light and shadows' },
  { zh: '凌晨 4 點，黎明前暗藍色', en: '4 AM pre-dawn dark blue tone' },
  { zh: '無指定時間，讓畫面依整體風格決定', en: 'unspecified time, let the overall style define the timing' }
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
    '絲質吊帶睡裙', '高級訂製黑色禮服', '半透明薄紗外罩', '白襯衫與鬆開的領口',
    '緞面長袍與腰帶', '皮革束腰與長手套', '蕾絲內搭與西裝外套', '復古旗袍剪裁',
    '舞台感亮片連身裝', '極簡針織貼身洋裝', '浴袍與濕髮造型', '絲巾與珠寶點綴',
    '哥德黑紗與銀飾', '未來感金屬光澤服裝', '希臘女神風垂墜布料', '高腰長裙與開衩設計',
    '絲絨披肩與裸肩輪廓', '優雅套裝搭配高跟鞋', '輕盈薄紗裙擺', '暗紅緞面禮服',
    '珍珠肩帶與細緻刺繡', '透明雨衣疊穿造型', '海邊度假罩衫', '黑白撞色時裝',
    '寬鬆男友襯衫', '芭蕾緞帶與柔軟針織', '金色鏈飾與簡潔布料', '復古睡袍與羽毛拖鞋',
    '深色制服感套裝但非校園', '藝術攝影用身體布幔', '霧面黑色連身裙', '銀色緞面短外套',
    '珍珠白蕾絲長袍', '酒紅色天鵝絨長裙', '裸色薄紗層次洋裝', '墨綠色絲質襯衫裙',
    '深藍色開襟針織外套', '香檳金細肩帶禮服', '黑色寬版腰封搭配長裙', '象牙白披肩與貼身洋裝',
    '金屬扣環皮革短上衣', '玫瑰刺繡薄紗罩衫', '復古宮廷感束身上衣', '高領無袖貼身裙',
    '單肩垂墜長禮服', '緞帶綁結胸前造型', '大露背緞面禮服', '透明網紗長袖上衣',
    '短版西裝外套與窄裙', '絲質睡袍搭配珠寶腰鏈', '黑色長版風衣半披造型', '白色長版襯衫與腰封',
    '孔雀藍亮面連身裙', '淡粉色羽毛披肩', '金色薄紗披掛造型', '銀灰色西裝背心套裝',
    '黑色蕾絲手套與晚禮服', '復古法式馬甲洋裝', '奶茶色針織連身裙', '琥珀色緞面睡裙',
    '暗紫色薄紗長裙', '深紅色皮革短外套', '白色絲質吊帶與長褲', '黑色透膚高領罩衫',
    '珍珠鏈肩飾造型', '水藍色透明披紗', '午夜藍亮片長裙', '奶油白毛絨披肩',
    '金屬銀未來感連體衣', '古典羅馬式布幔長裙', '黑色開衩長褲套裝', '淡紫色絲絨短袍',
    '紅色緞帶綁帶上衣', '大地色麂皮披肩', '霧粉色薄紗芭蕾裙', '黑金刺繡晚宴禮服',
    '亮白緞面套裝', '深灰色皮革裙裝', '金色蛇紋腰帶造型', '孔雀綠長版罩衫',
    '霧黑緊身高領長裙', '水晶流蘇肩飾', '透明歐根紗外套', '暗紅色絲絨睡袍',
    '象牙白蕾絲披肩', '金屬紫亮面短裙套裝', '柔粉色緞面浴袍', '黑色緞面手套與高衩裙',
    '香檳色亮片披肩', '月白色垂墜長袍', '酒紅色蕾絲胸衣外搭西裝', '銀線刺繡旗袍式禮服',
    '黑色羽毛肩飾禮服', '深藍色絲質睡袍', '珍珠灰薄紗層次長裙', '透明黑紗長袖披肩',
    '金色刺繡腰鏈洋裝', '銀白色緊身連體衣', '薔薇紅緞面短袍', '夜幕藍薄紗罩裙'
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
    '高樓落地窗夜景套房', '復古歐式臥室', '極簡白色攝影棚', '霓虹酒吧角落',
    '雨夜車窗旁', '私人美術館展廳', '天鵝絨窗簾舞台', '海邊玻璃屋',
    '溫泉旅館房間', '奢華飯店浴室', '燭光餐桌後的昏暗房間', '大型圓床與薄紗帳幔',
    '城市頂樓露台', '古典柱廊與長階', '暗紅色地下爵士酒吧', '黑色背景時尚攝影棚',
    '晨光灑入的公寓臥室', '大理石浴池與霧氣', '金色宮殿風內室', '未來感賽博套房',
    '法式老宅書房', '私人更衣間與落地鏡', '深色木質酒窖', '玫瑰花瓣散落的房間',
    '雪夜壁爐旁', '熱帶度假別墅', '藝術家工作室', '豪華郵輪艙房',
    '月光花園涼亭', '紅毯後台休息室', '高級飯店總統套房', '城市夜景陽台',
    '復古唱片房', '黑膠音樂酒廊', '私人攝影暗房', '香氛蠟燭臥室',
    '玻璃帷幕辦公室夜景', '摩登 loft 公寓', '高級衣帽間', '古董鏡牆房間',
    '絲絨沙發會客室', '白色大理石走廊', '金色電梯廳', '私人鋼琴房',
    '歐式陽光溫室', '雨聲環繞的屋簷下', '湖畔木屋室內', '沙漠帳篷豪華房',
    '私人泳池旁', '海景露台躺椅區', '藍調燈光錄音室', '黑色天幕攝影棚',
    '紅色絲絨劇院包廂', '古典圖書館角落', '現代藝術裝置空間', '午夜城市天橋',
    '霧面玻璃淋浴間', '日式旅館榻榻米房', '和風屏風臥室', '竹林旁溫泉小屋',
    '巴黎老公寓陽台', '紐約高樓公寓客廳', '地中海白牆房間', '摩洛哥拱門房間',
    '威尼斯鏡面沙龍', '皇家宮殿更衣室', '銀色未來實驗室', '星艦觀景艙',
    '月面基地休息室', '賽博霓虹街景室內', '粉色霓虹化妝間', '暗紫色夜店 VIP 包廂',
    '水晶吊燈宴會廳', '私人花園玻璃亭', '玫瑰溫室長廊', '秋日壁爐客廳',
    '夏日海風臥室', '春日花瓣白房間', '冬夜毛毯沙發區', '午後陽光窗邊床',
    '黑白棋盤地板房間', '大面積落地鏡舞蹈室', '高級健身房休息區', '私人桑拿房外間',
    '精品試衣間', '奢華化妝台前', '古典油畫牆客廳', '深色皮革書房',
    '現代簡約浴室', '金屬質感攝影棚', '柔粉色甜點店包廂', '夜晚雨窗咖啡館',
    '空中花園休息室', '山景度假木屋', '玻璃天井長廊', '私人電影院沙發區',
    '復古旅館走廊', '高級香水展示室', '白色帷幕婚禮後台', '黑金主題派對房間'
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

function getPresetOption(list, value) {
  const normalized = normalizeInput(value);
  return list.find((option) => option.zh === normalized || option.en === normalized) || list[0];
}

function getPresetZh(list, value) {
  return getPresetOption(list, value).zh;
}

function getPresetEn(list, value) {
  return getPresetOption(list, value).en;
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
  const lightingZh = getPresetZh(LIGHTING_DESCRIPTIONS, options.lighting);
  const lightingEn = getPresetEn(LIGHTING_DESCRIPTIONS, options.lighting);
  const cameraZh = getPresetZh(CAMERA_ANGLES, options.camera);
  const cameraEn = getPresetEn(CAMERA_ANGLES, options.camera);
  const artStyleZh = getPresetZh(ART_STYLES, options.artStyle);
  const artStyleEn = getPresetEn(ART_STYLES, options.artStyle);
  const raceZh = getPresetZh(RACE_OPTIONS, options.race);
  const raceEn = getPresetEn(RACE_OPTIONS, options.race);
  const expressionZh = getPresetZh(EXPRESSION_OPTIONS, options.expression);
  const expressionEn = getPresetEn(EXPRESSION_OPTIONS, options.expression);
  const timePointZh = getPresetZh(TIME_POINTS, options.timePoint);
  const timePointEn = getPresetEn(TIME_POINTS, options.timePoint);
  const face = getOptionValue('faces', options.face) || CUSTOMIZATION_OPTIONS.faces[0];
  const outfit = getOptionValue('outfits', options.outfit) || CUSTOMIZATION_OPTIONS.outfits[0];
  const count = getOptionValue('counts', options.count) || CUSTOMIZATION_OPTIONS.counts[0];
  const scene = getOptionValue('scenes', options.scene) || CUSTOMIZATION_OPTIONS.scenes[0];
  const pose = getOptionValue('poses', options.pose) || CUSTOMIZATION_OPTIONS.poses[0];

  let rewritten = validation.prompt;

  for (const { pattern, replacement } of PHRASE_RULES) {
    rewritten = rewritten.replace(pattern, replacement);
  }

  const chinesePrompt = [
    `主題／動作：${rewritten}`,
    `種族：${raceZh}`,
    `表情：${expressionZh}`,
    `時間點：${timePointZh}`,
    `臉蛋：${face}`,
    `服裝：${outfit}`,
    `人數／構圖：${count}`,
    `場景：${scene}`,
    `光感：${lightingZh}`,
    `鏡位：${cameraZh}`,
    `畫風：${artStyleZh}`,
    `體位／姿勢：${pose}`,
    `氛圍：${INTENSITY_WORDS[intensity]}`,
    '安全：所有角色皆為明確 18+ 且合意的成年人，無脅迫、無未成年'
  ];

  if (customConditionValidation.conditions) {
    chinesePrompt.push(`客製化條件：${customConditionValidation.conditions}`);
  }

  const englishPrompt = [
    `subject/action: ${rewritten}`,
    `race: ${raceEn}`,
    `facial expression: ${expressionEn}`,
    `time point: ${timePointEn}`,
    `face: ${face}`,
    `outfit: ${outfit}`,
    `character count/composition: ${count}`,
    `scene: ${scene}`,
    `lighting: ${lightingEn}`,
    `camera angle: ${cameraEn}`,
    `art style: ${artStyleEn}`,
    `body pose/posture: ${pose}`,
    `tone: ${DEFAULT_STYLE.tone}`,
    `intensity: ${INTENSITY_WORDS[intensity]}`,
    `quality: ${DEFAULT_STYLE.quality}`,
    `safety: ${DEFAULT_STYLE.safety}`
  ];

  if (customConditionValidation.conditions) {
    englishPrompt.push(`custom conditions: ${customConditionValidation.conditions}`);
  }

  return {
    ok: true,
    prompt: [
      '【中文確認提示詞】',
      chinesePrompt.join('，'),
      '',
      '【English generation prompt】',
      englishPrompt.join(', ')
    ].join('\n'),
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
    RACE_OPTIONS,
    EXPRESSION_OPTIONS,
    TIME_POINTS,
    CUSTOMIZATION_OPTIONS
  };
}

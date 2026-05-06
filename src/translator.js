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
  { zh: '柔和環形光，眼神圓形高光', en: 'soft ring light with circular catchlights in the eyes' },
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
  { zh: '眼神補光，瞳孔高光清楚', en: 'eye fill light with clear catchlights in the pupils' },
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
  { zh: '平視鏡位，自然人像構圖', en: 'eye-level shot, natural perspective, balanced portrait framing' },
  { zh: '低角度鏡位，人物存在感更強', en: 'low-angle shot, stronger presence, elongated body lines' },
  { zh: '高角度鏡位，親密俯視感', en: 'high-angle shot, intimate overview, soft vulnerability' },
  { zh: '過肩鏡位，前景肩線微模糊', en: 'over-the-shoulder shot, foreground shoulder blur, focused gaze' },
  { zh: '近景特寫，強調臉部表情', en: 'close-up shot, face and expression priority, shallow depth of field' },
  { zh: '極近特寫，強調眼神嘴唇與指尖', en: 'extreme close-up shot emphasizing eyes, lips, and fingertips' },
  { zh: '中景鏡位，清楚呈現上半身動作', en: 'medium shot, clear upper-body gesture and styling detail' },
  { zh: '全身鏡位，完整呈現身形與姿勢', en: 'full-body shot, complete silhouette and pose readable from head to toe' },
  { zh: '四分之三側身鏡位，增加立體感', en: 'three-quarter view with diagonal face and body angle' },
  { zh: '側面輪廓鏡位，強調線條', en: 'profile shot emphasizing clean silhouette lines' },
  { zh: '俯拍全身構圖，姿勢關係清楚', en: 'overhead full-body composition with clear pose relationship' },
  { zh: '腰平鏡位，服裝與手勢突出', en: 'waist-level shot highlighting outfit and hand gesture' },
  { zh: '廣角近距離鏡位，空間張力強', en: 'wide-angle close shot with strong spatial tension' },
  { zh: '長焦壓縮鏡位，背景層次柔化', en: 'telephoto compressed shot with softened background layers' },
  { zh: '對稱正中央鏡位，儀式感構圖', en: 'centered symmetrical shot with ceremonial composition' },
  { zh: '斜角構圖，畫面更有動勢', en: 'Dutch-angle composition with dynamic visual movement' },
  { zh: '鏡面反射鏡位，雙重視線層次', en: 'mirror-reflection shot with layered gaze direction' },
  { zh: '半身肖像鏡位，肩頸與表情清楚', en: 'half-body portrait shot with clear shoulders, neck, and expression' },
  { zh: '背面回眸鏡位，姿態曲線明確', en: 'back-view glance shot with clear posture curve' },
  { zh: '雙人對角線鏡位，互動關係清楚', en: 'two-person diagonal framing with readable interaction' }
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

function option(zh, en, rarity = 'daily') {
  return { zh, en, rarity };
}

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
  ['自信微笑', 'confident smile'], ['害羞臉紅', 'shy blush'], ['挑逗眼神', 'teasing gaze'], ['沉醉表情', 'entranced expression'], ['冷靜凝視', 'calm stare'],
  ['溫柔微笑', 'gentle smile'], ['咬唇表情', 'soft lip-biting expression'], ['慵懶眼神', 'languid eyes'], ['驚喜睜眼', 'pleasantly surprised eyes'], ['渴望神情', 'yearning expression'],
  ['陶醉閉眼', 'blissful closed eyes'], ['俏皮眨眼', 'playful wink'], ['高傲抬眉', 'proud raised brow'], ['迷離眼神', 'dreamy unfocused gaze'], ['安定放鬆', 'relaxed composure'],
  ['羞怯低頭', 'bashful lowered gaze'], ['熱烈注視', 'intense direct gaze'], ['若有所思', 'thoughtful mood'], ['甜美撒嬌', 'sweet affectionate expression'], ['克制忍耐', 'restrained longing'],
  ['滿足微喘', 'satisfied breathless mood'], ['神祕淺笑', 'mysterious half-smile'], ['專注凝神', 'focused concentration'], ['柔軟依戀', 'soft attachment'], ['放肆大笑', 'unrestrained laugh'],
  ['倔強抿唇', 'stubborn pressed lips'], ['期待眼神', 'expectant gaze'], ['迷人側笑', 'charming side smile'], ['平靜挑釁', 'calm provocation'], ['深情凝望', 'deep affectionate gaze']
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
  ['珍珠白', 'pearl white'], ['霧面黑', 'matte black'], ['酒紅', 'wine red'], ['玫瑰粉', 'rose pink'], ['裸膚米', 'nude beige'],
  ['香檳金', 'champagne gold'], ['深海藍', 'deep ocean blue'], ['祖母綠', 'emerald green'], ['薰衣草紫', 'lavender purple'], ['煙灰色', 'smoky gray'],
  ['奶油黃', 'cream yellow'], ['焦糖棕', 'caramel brown'], ['銀白', 'silver white'], ['午夜藍', 'midnight blue'], ['櫻桃紅', 'cherry red'],
  ['孔雀綠', 'peacock green'], ['水晶透明', 'crystal transparent'], ['暖象牙', 'warm ivory'], ['冷灰藍', 'cool gray blue'], ['珊瑚橘', 'coral orange'],
  ['紫羅蘭', 'violet'], ['青瓷綠', 'celadon green'], ['黑金配色', 'black and gold'], ['白銀配色', 'white and silver'], ['粉金配色', 'pink and gold'],
  ['紅黑配色', 'red and black'], ['藍銀配色', 'blue and silver'], ['綠金配色', 'green and gold'], ['透明漸層', 'transparent gradient'], ['低飽和莫蘭迪色', 'muted Morandi palette']
].map(([zh, en]) => option(zh, en));

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

const CUSTOMIZATION_OPTIONS = {
  genders: GENDER_OPTIONS,
  faces: FACE_OPTIONS,
  outfits: [
    ...dailyOutfitPairs.map(([zh, en]) => option(zh, en, 'daily')),
    ...rareOutfitPairs.map(([zh, en]) => option(zh, en, 'rare'))
  ],
  outfitColors,
  outfitIntegrity: OUTFIT_INTEGRITY_OPTIONS,
  bodyFeatures,
  counts: COUNT_OPTIONS,
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
  return list.find((preset) => preset.zh === normalized || preset.en === normalized) || list[0];
}

function getCustomizationOption(groupName, value) {
  const group = CUSTOMIZATION_OPTIONS[groupName] || [];
  return getPresetOption(group, value);
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

function checkElementBoundaries() {
  return {
    lightingHasSceneLeak: LIGHTING_DESCRIPTIONS.some(({ zh, en }) => hasSceneLeak(`${zh} ${en}`)),
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

  const intensity = INTENSITY_WORDS[options.intensity] ? options.intensity : 'medium';
  const lighting = getPresetOption(LIGHTING_DESCRIPTIONS, options.lighting);
  const camera = getPresetOption(CAMERA_ANGLES, options.camera);
  const artStyle = getPresetOption(ART_STYLES, options.artStyle);
  const race = getPresetOption(RACE_OPTIONS, options.race);
  const emotion = getPresetOption(EMOTION_OPTIONS, options.emotion || options.expression);
  const timePoint = getPresetOption(TIME_POINTS, options.timePoint);
  const gender = getCustomizationOption('genders', options.gender);
  const face = getCustomizationOption('faces', options.face);
  const outfit = getCustomizationOption('outfits', options.outfit);
  const outfitColor = getCustomizationOption('outfitColors', options.outfitColor);
  const bodyFeature = getCustomizationOption('bodyFeatures', options.bodyFeature);
  const outfitIntegrity = getCustomizationOption('outfitIntegrity', options.outfitIntegrity);
  const count = getCustomizationOption('counts', options.count);
  const scene = getCustomizationOption('scenes', options.scene);
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
    `臉蛋：${face.zh}`,
    `身上特徵：${bodyFeature.zh}`,
    `服裝：${outfit.zh}`,
    `服裝配色：${outfitColor.zh}`,
    `服裝完整度：${outfitIntegrity.zh}`,
    `人數／構圖：${count.zh}`,
    `場景：${scene.zh}`,
    `光感：${lighting.zh}`,
    `鏡位：${camera.zh}`,
    `畫風：${artStyle.zh}`,
    `體位／姿勢：${pose.zh}`,
    `氛圍：${INTENSITY_WORDS[intensity]}`,
    '安全：所有角色皆為明確 18+ 且合意的成年人，無脅迫、無未成年'
  ];

  if (customConditionValidation.conditions) {
    chinesePrompt.push(`客製化條件：${customConditionValidation.conditions}`);
  }

  const englishSubject = toCopySafeEnglishSubject(rewritten);

  const englishPrompt = [
    `subject/action: ${englishSubject}`,
    `gender: ${gender.en}`,
    `race: ${race.en}`,
    `emotion: ${emotion.en}`,
    `time point: ${timePoint.en}`,
    `face: ${face.en}`,
    `body feature: ${bodyFeature.en}`,
    `outfit: ${outfit.en}`,
    `outfit color palette: ${outfitColor.en}`,
    `outfit integrity: ${outfitIntegrity.en}`,
    `character count/composition: ${count.en}`,
    `scene: ${scene.en}`,
    `lighting: ${lighting.en}`,
    `camera angle: ${camera.en}`,
    `art style: ${artStyle.en}`,
    `body pose/posture: ${pose.en}`,
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
    prompt: englishPrompt.join(', '),
    englishPrompt: englishPrompt.join(', '),
    chineseConfirmation: chinesePrompt.join('，'),
    reason: '',
    screened: true
  };
}

if (typeof module !== 'undefined') {
  module.exports = {
    rewritePrompt,
    validatePrompt,
    PHRASE_RULES,
    CHINESE_PHRASE_RULES,
    BLOCKED_PATTERNS,
    LIGHTING_DESCRIPTIONS,
    CAMERA_ANGLES,
    ART_STYLES,
    RACE_OPTIONS,
    EMOTION_OPTIONS,
    EXPRESSION_OPTIONS,
    TIME_POINTS,
    GENDER_OPTIONS,
    CUSTOMIZATION_OPTIONS,
    checkElementBoundaries
  };
}

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
  let rewritten = validation.prompt;

  for (const { pattern, replacement } of PHRASE_RULES) {
    rewritten = rewritten.replace(pattern, replacement);
  }

  return {
    ok: true,
    prompt: [
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
    BLOCKED_PATTERNS
  };
}

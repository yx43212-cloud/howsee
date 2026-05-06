const { picpickData, basicIds, defaultTuning, assemblePrompt, normalizeState, findByLabel } = window.PicPickCore;

const pages = {
  home: document.querySelector('#homePage'),
  basic: document.querySelector('#basicPage'),
  expert: document.querySelector('#expertPage'),
  result: document.querySelector('#resultPage'),
  library: document.querySelector('#libraryPage')
};

const sliderSets = {
  basic: [
    ['identity', '人物保留度'], ['retouch', '修飾強度'], ['background', '背景變化程度'],
    ['realism', '寫實 / 插畫程度'], ['color', '色彩濃度'], ['refinement', '精緻程度']
  ],
  expert: [
    ['identity', '人物保留度'], ['retouch', '修飾強度'], ['background', '背景重塑程度'], ['realism', '寫實 / 插畫程度'],
    ['color', '色彩濃度'], ['refinement', '精緻程度'], ['cinematic', '電影感'], ['moodIntensity', '氛圍強度'],
    ['detail', '細節清晰度'], ['creativity', '創意變形程度'], ['compositionFreedom', '構圖自由度'],
    ['textPresence', '文字存在感'], ['textFusion', '圖文融合度'], ['framePresence', '框線存在感']
  ],
  frame: [
    ['frameWidth', '框線粗細'], ['frameOpacity', '框線透明度'], ['frameRadius', '圓角程度'],
    ['frameDecoration', '框線裝飾感'], ['framePadding', '留白寬度'], ['frameShadow', '陰影強度']
  ],
  text: [
    ['textSize', '文字大小'], ['textWeight', '文字粗細'], ['letterSpacing', '字距'],
    ['lineHeight', '行距'], ['textPresence', '文字存在感'], ['textFusion', '圖文融合度']
  ]
};

let lastResult = null;
let lastRouteBeforeResult = 'basic';

function routeTo(route) {
  Object.values(pages).forEach((page) => { page.hidden = true; });
  pages[route].hidden = false;
  document.querySelectorAll('[data-route]').forEach((link) => link.classList.toggle('active', link.dataset.route === route));
  if (route === 'library') renderLibrary();
  window.location.hash = route === 'home' ? '' : route;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function optionElement(item) {
  const option = document.createElement('option');
  option.value = item.id;
  option.textContent = item.category ? `${item.label}｜${item.category}` : item.label;
  return option;
}

function populateSelect(select) {
  const source = select.dataset.source;
  const basicKey = select.dataset.basicLabels;
  const fragment = document.createDocumentFragment();
  let items = [];

  if (basicKey) {
    const collectionMap = { lights: 'lights', locations: 'locations', outfits: 'outfits', accessories: 'accessories', palettes: 'color_palettes', moods: 'moods', layouts: 'layouts', outputs: 'outputs' };
    items = basicIds[basicKey].map((label) => findByLabel(collectionMap[basicKey], label)).filter(Boolean);
  } else {
    items = [...picpickData[source]];
  }

  if (select.dataset.limit) items = items.slice(0, Number(select.dataset.limit));

  if (select.dataset.grouped) {
    const groups = Map.groupBy ? Map.groupBy(items, (item) => item.category || '其他') : groupBy(items, (item) => item.category || '其他');
    for (const [category, categoryItems] of groups.entries()) {
      const group = document.createElement('optgroup');
      group.label = category;
      categoryItems.forEach((item) => group.append(optionElement(item)));
      fragment.append(group);
    }
  } else {
    items.forEach((item) => fragment.append(optionElement(item)));
  }
  select.replaceChildren(fragment);
}

function groupBy(items, getter) {
  const map = new Map();
  items.forEach((item) => {
    const key = getter(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return map;
}

function createChoiceButton(item, field) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'choice-card';
  button.dataset.value = item.id;
  button.innerHTML = `<strong>${item.label}</strong><span>${item.prompt || item.category || ''}</span>`;
  button.addEventListener('click', () => {
    document.querySelectorAll(`[data-field="${field}"] .choice-card`).forEach((card) => card.classList.remove('selected'));
    button.classList.add('selected');
    const form = button.closest('form');
    let hidden = form.querySelector(`input[name="${field}"][type="hidden"]`);
    if (!hidden) {
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = field;
      form.append(hidden);
    }
    hidden.value = item.id;
  });
  return button;
}

function populateOptionGrid(grid) {
  const field = grid.dataset.field;
  const source = grid.dataset.source;
  let items = [...picpickData[source]];

  if (grid.dataset.basic === 'styles') items = basicIds.styles.map((id) => picpickData.styles.find((item) => item.id === id)).filter(Boolean);
  if (grid.dataset.filterable) items = items.slice(0, 80);

  grid.replaceChildren(...items.map((item) => createChoiceButton(item, field)));
  grid.querySelector('.choice-card')?.click();
}

function populateBasicStyleGrid(grid) {
  const buttons = picpickData.style_categories.map((category) => {
    const style = picpickData.styles.find((item) => item.category === category.label);
    return createChoiceButton({ ...style, label: category.label, prompt: '先選大方向，PicPick 自動挑代表風格' }, 'styleId');
  });
  grid.replaceChildren(...buttons);
  grid.querySelector('.choice-card')?.click();
}

function createSlider(key, label) {
  const wrapper = document.createElement('label');
  wrapper.className = 'range-row';
  const value = defaultTuning[key] ?? 50;
  wrapper.innerHTML = `<span>${label}<b>${value}</b></span><input name="tuning.${key}" type="range" min="0" max="100" value="${value}" />`;
  const input = wrapper.querySelector('input');
  const output = wrapper.querySelector('b');
  input.addEventListener('input', () => { output.textContent = input.value; });
  return wrapper;
}

function setupSliders() {
  document.querySelectorAll('[data-sliders]').forEach((container) => {
    container.replaceChildren(...sliderSets[container.dataset.sliders].map(([key, label]) => createSlider(key, label)));
  });
}

function setupFilters() {
  const categorySelect = document.querySelector('[data-category-filter="styles"]');
  const searchInput = document.querySelector('[data-search="styles"]');
  if (!categorySelect || !searchInput) return;
  categorySelect.replaceChildren(new Option('全部分類', ''), ...picpickData.style_categories.map((category) => new Option(category.label, category.label)));
  const apply = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    document.querySelectorAll('[data-filterable="styles"] .choice-card').forEach((card) => {
      const item = picpickData.styles.find((style) => style.id === card.dataset.value);
      const matchedKeyword = !keyword || item.label.toLowerCase().includes(keyword) || item.category.toLowerCase().includes(keyword);
      const matchedCategory = !category || item.category === category;
      card.hidden = !(matchedKeyword && matchedCategory);
    });
  };
  searchInput.addEventListener('input', apply);
  categorySelect.addEventListener('change', apply);
}

function setupTextToggles() {
  document.querySelectorAll('input[name="includeText"]').forEach((toggle) => {
    toggle.addEventListener('change', () => {
      const panel = toggle.closest('form').querySelector('[data-text-panel]');
      panel.hidden = !toggle.checked;
    });
  });
}

function setupPreviews() {
  [['basicImage', 'basicPreview', 'basicPreviewText'], ['expertImage', 'expertPreview', 'expertPreviewText']].forEach(([inputId, imageId, textId]) => {
    const input = document.querySelector(`#${inputId}`);
    const image = document.querySelector(`#${imageId}`);
    const text = document.querySelector(`#${textId}`);
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      image.src = URL.createObjectURL(file);
      image.hidden = false;
      text.textContent = file.name;
    });
  });
}

function collectFormState(form) {
  const formData = new FormData(form);
  const state = { mode: form.dataset.mode, text: {}, tuning: {} };

  for (const [key, value] of formData.entries()) {
    if (key === 'image') {
      if (value?.name) state.imageName = value.name;
    } else if (key.startsWith('text.')) {
      state.text[key.replace('text.', '')] = value.toString().trim();
    } else if (key.startsWith('tuning.')) {
      state.tuning[key.replace('tuning.', '')] = Number(value);
    } else if (key === 'includeText') {
      state.includeText = true;
    } else {
      state[key] = value.toString();
    }
  }

  return normalizeState(state);
}

function showResult(result) {
  lastResult = result;
  document.querySelector('#fullPrompt').value = result.fullPrompt;
  document.querySelector('#shortPrompt').value = result.shortPrompt;
  document.querySelector('#negativePrompt').value = result.negativePrompt;
  document.querySelector('#styleCode').textContent = result.styleCode;
  document.querySelector('#presetName').value = `${result.styleCode} 我的風格`;
  document.querySelector('#resultStatus').textContent = '';
  routeTo('result');
}

function savePreset() {
  if (!lastResult) return;
  const presets = getPresets();
  const preset = {
    id: crypto.randomUUID ? crypto.randomUUID() : `preset-${Date.now()}`,
    name: document.querySelector('#presetName').value.trim() || lastResult.styleCode,
    styleCode: lastResult.styleCode,
    state: lastResult.state,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('picpick-presets', JSON.stringify([preset, ...presets]));
  document.querySelector('#resultStatus').textContent = '已儲存到我的風格庫。';
}

function getPresets() {
  try { return JSON.parse(localStorage.getItem('picpick-presets') || '[]'); } catch { return []; }
}

function renderLibrary() {
  const list = document.querySelector('#libraryList');
  const presets = getPresets();
  if (!presets.length) {
    list.innerHTML = '<article class="empty-card"><h2>還沒有儲存風格</h2><p>先到快速生成或進階客製產生提示詞，再按「儲存我的風格」。</p><button class="primary" data-route="basic" type="button">開始建立第一個風格</button></article>';
    return;
  }
  list.replaceChildren(...presets.map((preset) => {
    const card = document.createElement('article');
    card.className = 'library-card';
    card.innerHTML = `<div><span>${preset.styleCode}</span><h2>${preset.name}</h2><p>${new Date(preset.createdAt).toLocaleString('zh-TW')}</p></div><div class="button-row"><button data-apply>再次套用</button><button data-edit>編輯名稱</button><button data-delete class="danger">刪除</button></div>`;
    card.querySelector('[data-apply]').addEventListener('click', () => {
      applyStateToForm(document.querySelector('#expertForm'), preset.state);
      routeTo('expert');
    });
    card.querySelector('[data-edit]').addEventListener('click', () => {
      const nextName = prompt('請輸入新的風格名稱', preset.name);
      if (!nextName) return;
      updatePresets(presets.map((item) => item.id === preset.id ? { ...item, name: nextName } : item));
    });
    card.querySelector('[data-delete]').addEventListener('click', () => updatePresets(presets.filter((item) => item.id !== preset.id)));
    return card;
  }));
}

function updatePresets(presets) {
  localStorage.setItem('picpick-presets', JSON.stringify(presets));
  renderLibrary();
}

function applyStateToForm(form, state) {
  Object.entries(state).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'boolean') {
      const field = form.querySelector(`[name="${key}"]`);
      if (field) {
        if (field.type === 'checkbox') field.checked = Boolean(value); else field.value = value;
      }
      const choice = form.querySelector(`[data-field="${key}"] [data-value="${value}"]`);
      if (choice) choice.click();
    }
  });
  Object.entries(state.tuning || {}).forEach(([key, value]) => {
    const input = form.querySelector(`[name="tuning.${key}"]`);
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
  });
  Object.entries(state.text || {}).forEach(([key, value]) => {
    const input = form.querySelector(`[name="text.${key}"]`);
    if (input) input.value = value;
  });
  form.querySelector('[data-text-panel]')?.toggleAttribute('hidden', !state.includeText);
}

function init() {
  document.querySelectorAll('select[data-source], select[data-basic-labels]').forEach(populateSelect);
  document.querySelectorAll('.option-grid[data-source]').forEach(populateOptionGrid);
  document.querySelectorAll('.basic-style-grid').forEach(populateBasicStyleGrid);
  setupSliders();
  setupFilters();
  setupTextToggles();
  setupPreviews();

  document.body.addEventListener('click', (event) => {
    const routeButton = event.target.closest('[data-route]');
    if (routeButton) routeTo(routeButton.dataset.route);
  });

  document.querySelectorAll('form[data-mode]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      lastRouteBeforeResult = form.dataset.mode;
      showResult(assemblePrompt(collectFormState(form)));
    });
  });

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const key = button.dataset.copy;
      const text = lastResult?.[key] || document.querySelector(`#${key}`).value;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const target = document.querySelector(`#${key}`);
        target.select();
        document.execCommand('copy');
      }
      button.textContent = '已複製';
      setTimeout(() => { button.textContent = button.dataset.copy === 'fullPrompt' ? '複製完整提示詞' : button.dataset.copy === 'shortPrompt' ? '複製精簡提示詞' : '複製負面提示詞'; }, 1000);
    });
  });

  document.querySelector('#savePresetButton').addEventListener('click', savePreset);
  document.querySelector('#regenerateButton').addEventListener('click', () => routeTo(lastRouteBeforeResult));

  const initialRoute = location.hash.replace('#', '') || 'home';
  routeTo(pages[initialRoute] ? initialRoute : 'home');
}

init();

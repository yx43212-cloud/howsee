const sourcePrompt = document.querySelector('#sourcePrompt');
const intensity = document.querySelector('#intensity');
const lighting = document.querySelector('#lighting');
const camera = document.querySelector('#camera');
const artStyle = document.querySelector('#artStyle');
const gender = document.querySelector('#gender');
const race = document.querySelector('#race');
const emotion = document.querySelector('#emotion');
const timePoint = document.querySelector('#timePoint');
const face = document.querySelector('#face');
const outfit = document.querySelector('#outfit');
const outfitColor = document.querySelector('#outfitColor');
const bodyFeature = document.querySelector('#bodyFeature');
const outfitIntegrity = document.querySelector('#outfitIntegrity');
const count = document.querySelector('#count');
const scene = document.querySelector('#scene');
const action = document.querySelector('#action');
const pose = document.querySelector('#pose');
const customConditions = document.querySelector('#customConditions');
const rewriteButton = document.querySelector('#rewriteButton');
const confirmationPrompt = document.querySelector('#confirmationPrompt');
const resultPrompt = document.querySelector('#resultPrompt');
const statusMessage = document.querySelector('#status');
const copyButton = document.querySelector('#copyButton');
const outputLabels = document.querySelectorAll('.output-label');
const imageInput = document.querySelector('#imageInput');
const imagePreview = document.querySelector('#imagePreview');
const imageDescription = document.querySelector('#imageDescription');
const desiredMotion = document.querySelector('#desiredMotion');
const videoDuration = document.querySelector('#videoDuration');
const motionStrength = document.querySelector('#motionStrength');
const imageVideoButton = document.querySelector('#imageVideoButton');
const imageVideoChoiceField = document.querySelector('#imageVideoChoiceField');
const imageVideoPromptChoice = document.querySelector('#imageVideoPromptChoice');
const imageVideoStatus = document.querySelector('#imageVideoStatus');

let uploadedImageAnalysis = null;
let lastImageVideoResult = null;

function setStatus(message, state = 'idle') {
  statusMessage.textContent = message;
  statusMessage.dataset.state = state;
}

function setImageVideoStatus(message, state = 'idle') {
  imageVideoStatus.textContent = message;
  imageVideoStatus.dataset.state = state;
}

function setResultVisibility(isVisible) {
  confirmationPrompt.hidden = !isVisible;
  resultPrompt.hidden = !isVisible;
  copyButton.hidden = !isVisible;

  for (const label of outputLabels) {
    label.hidden = !isVisible;
  }
}

function getOptionLabel(optionText) {
  const baseLabel = typeof optionText === 'string' ? optionText : optionText.zh;

  if (typeof optionText !== 'object' || !optionText.rarity) {
    return baseLabel;
  }

  const rarityLabel = optionText.rarity === 'rare' ? '稀少' : '日常';
  return `${baseLabel}（${rarityLabel}）`;
}

function populateSelect(select, options) {
  const fragment = document.createDocumentFragment();

  for (const optionText of options) {
    const option = document.createElement('option');
    const value = typeof optionText === 'string' ? optionText : optionText.zh;
    option.value = value;
    option.textContent = getOptionLabel(optionText);
    fragment.append(option);
  }

  select.append(fragment);
}


function getSkinToneRatioFromImage(imageElement) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const sampleSize = 96;
  const scale = Math.min(sampleSize / imageElement.naturalWidth, sampleSize / imageElement.naturalHeight, 1);
  canvas.width = Math.max(1, Math.round(imageElement.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(imageElement.naturalHeight * scale));
  context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  let skinLikePixels = 0;
  let visiblePixels = 0;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const alpha = data[index + 3];

    if (alpha < 16) {
      continue;
    }

    visiblePixels += 1;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const isSkinLike = red > 95 && green > 40 && blue > 20 && max - min > 15 && Math.abs(red - green) > 15 && red > green && red > blue;
    const isWarmLightSkinLike = red > 170 && green > 120 && blue > 80 && red >= green && green >= blue;

    if (isSkinLike || isWarmLightSkinLike) {
      skinLikePixels += 1;
    }
  }

  return visiblePixels ? skinLikePixels / visiblePixels : 0;
}

function loadImageAnalysis(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.addEventListener('load', () => {
      try {
        imagePreview.src = objectUrl;
        imagePreview.hidden = false;
        const skinToneRatio = getSkinToneRatioFromImage(image);
        resolve({
          fileName: file.name,
          skinToneRatio,
          width: image.naturalWidth,
          height: image.naturalHeight,
          objectUrl
        });
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    }, { once: true });

    image.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('無法讀取圖片，請改用 JPG、PNG 或 WebP。'));
    }, { once: true });

    image.src = objectUrl;
  });
}

function renderPromptResult(result, successMessage) {
  if (!result.ok || !result.screened) {
    confirmationPrompt.value = result.suggestedFix
      ? `修正建議：${result.suggestedFix.zh}\nSuggested fix: ${result.suggestedFix.en}`
      : '';
    resultPrompt.value = '';
    setResultVisibility(Boolean(result.suggestedFix));
    resultPrompt.hidden = true;
    copyButton.hidden = true;
    if (outputLabels[1]) {
      outputLabels[1].hidden = true;
    }
    setStatus(result.reason || '提示詞未通過安全篩選。', 'error');
    return;
  }

  confirmationPrompt.value = result.chineseConfirmation;
  resultPrompt.value = result.englishPrompt;
  setResultVisibility(true);
  setStatus(successMessage, 'success');
}

function setupCustomizationControls() {
  populateSelect(lighting, LIGHTING_DESCRIPTIONS);
  populateSelect(camera, CAMERA_ANGLES);
  populateSelect(artStyle, ART_STYLES);
  populateSelect(gender, CUSTOMIZATION_OPTIONS.genders);
  populateSelect(race, RACE_OPTIONS);
  populateSelect(emotion, EMOTION_OPTIONS);
  populateSelect(timePoint, TIME_POINTS);
  populateSelect(face, CUSTOMIZATION_OPTIONS.faces);
  populateSelect(outfit, CUSTOMIZATION_OPTIONS.outfits);
  populateSelect(outfitColor, CUSTOMIZATION_OPTIONS.outfitColors);
  populateSelect(bodyFeature, CUSTOMIZATION_OPTIONS.bodyFeatures);
  populateSelect(outfitIntegrity, CUSTOMIZATION_OPTIONS.outfitIntegrity);
  populateSelect(count, CUSTOMIZATION_OPTIONS.counts);
  populateSelect(scene, CUSTOMIZATION_OPTIONS.scenes);
  populateSelect(action, CUSTOMIZATION_OPTIONS.actions);
  populateSelect(pose, CUSTOMIZATION_OPTIONS.poses);
}

setupCustomizationControls();
setResultVisibility(false);


function setImageVideoChoiceVisibility(isVisible) {
  imageVideoChoiceField.hidden = !isVisible;
}

function renderImageVideoChoice(result, selectedScore = result.explicitnessScore) {
  imageVideoPromptChoice.replaceChildren();

  for (const choice of result.promptChoices || []) {
    const option = document.createElement('option');
    option.value = String(choice.score);
    option.textContent = `${choice.score}/10：${choice.zh}`;
    imageVideoPromptChoice.append(option);
  }

  imageVideoPromptChoice.value = String(selectedScore);
  setImageVideoChoiceVisibility(Boolean(result.promptChoices?.length));
}

function applyImageVideoChoice(score) {
  if (!lastImageVideoResult) {
    return;
  }

  const choice = lastImageVideoResult.promptChoices.find((candidate) => String(candidate.score) === String(score));
  if (!choice) {
    return;
  }

  confirmationPrompt.value = lastImageVideoResult.chineseConfirmation.replace(/中文對照詞意：[^，]+/, `中文對照詞意：${choice.zh}`);
  resultPrompt.value = lastImageVideoResult.englishPrompt.replace(/adult-only explicitness rating: \d+\/10, [^,]+/, `adult-only explicitness rating: ${choice.score}/10, ${choice.en}`);
  setResultVisibility(true);
}

imageInput.addEventListener('change', async () => {
  const [file] = imageInput.files;

  uploadedImageAnalysis = null;
  lastImageVideoResult = null;
  setImageVideoChoiceVisibility(false);

  if (!file) {
    imagePreview.hidden = true;
    imagePreview.removeAttribute('src');
    setImageVideoStatus('尚未上傳圖片；圖片分析只在本機瀏覽器進行。');
    return;
  }

  if (!file.type.startsWith('image/')) {
    imagePreview.hidden = true;
    setImageVideoStatus('請上傳圖片檔案。', 'error');
    return;
  }

  try {
    uploadedImageAnalysis = await loadImageAnalysis(file);
    const roughScore = estimateExplicitnessScore({
      fileName: uploadedImageAnalysis.fileName,
      skinToneRatio: uploadedImageAnalysis.skinToneRatio,
      imageDescription: imageDescription.value,
      desiredMotion: desiredMotion.value
    });
    setImageVideoStatus(`已讀取圖片，初步色情程度約 ${roughScore}/10；可補充描述或希望動態後產生提示詞。`, 'success');
  } catch (error) {
    setImageVideoStatus(error.message, 'error');
  }
});

rewriteButton.addEventListener('click', () => {
  const result = rewritePrompt(sourcePrompt.value, {
    intensity: intensity.value,
    lighting: lighting.value,
    camera: camera.value,
    artStyle: artStyle.value,
    gender: gender.value,
    race: race.value,
    emotion: emotion.value,
    timePoint: timePoint.value,
    face: face.value,
    outfit: outfit.value,
    outfitColor: outfitColor.value,
    bodyFeature: bodyFeature.value,
    outfitIntegrity: outfitIntegrity.value,
    count: count.value,
    scene: scene.value,
    action: action.value,
    pose: pose.value,
    customConditions: customConditions.value
  });

  renderPromptResult(result, '已通過安全篩選：中文僅供確認，下方可複製區只包含英文提示詞。');
});

imageVideoButton.addEventListener('click', () => {
  if (!uploadedImageAnalysis) {
    setImageVideoStatus('請先上傳圖片。', 'error');
    return;
  }

  const result = createImageToVideoPrompt({
    fileName: uploadedImageAnalysis.fileName,
    skinToneRatio: uploadedImageAnalysis.skinToneRatio,
    imageDescription: imageDescription.value,
    desiredMotion: desiredMotion.value,
    durationSeconds: videoDuration.value,
    motionStrength: motionStrength.value
  });

  if (!result.ok) {
    setImageVideoStatus(`未通過安全篩選，色情程度估計 ${result.explicitnessScore}/10；請查看修正建議。`, 'error');
    lastImageVideoResult = null;
    setImageVideoChoiceVisibility(false);
    renderPromptResult(result, result.reason);
    return;
  }

  lastImageVideoResult = result;
  renderImageVideoChoice(result);
  renderPromptResult(result, `圖轉影提示詞已產生，AI 估計色情程度 ${result.explicitnessScore}/10；可挑選相鄰程度，中文僅供對照，下方可複製英文。`);
  setImageVideoStatus('圖轉影提示詞已通過安全篩選。', 'success');
});

imageVideoPromptChoice.addEventListener('change', () => {
  applyImageVideoChoice(imageVideoPromptChoice.value);
  setStatus(`已切換為 ${imageVideoPromptChoice.value}/10 圖轉影英文提示詞，可複製貼上。`, 'success');
});

copyButton.addEventListener('click', async () => {
  if (!resultPrompt.value) {
    setStatus('沒有可複製的英文提示詞。', 'error');
    return;
  }

  await navigator.clipboard.writeText(resultPrompt.value);
  setStatus('已複製英文提示詞到剪貼簿。', 'success');
});

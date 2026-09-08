import { generateBatch, PRESETS } from './generator.js';

const $ = (sel) => document.querySelector(sel);
const passwordsEl = $('#passwords');
const moreBtn = $('#moreBtn');
const toast = $('#toast');
const optionsPanel = $('#optionsPanel');
const toggleOptions = $('#toggleOptions');
const presetInputs = document.querySelectorAll('input[name="preset"]');
const customFields = $('#customFields');

const BATCH_SIZE = 10;

function getOptions() {
  const preset = document.querySelector('input[name="preset"]:checked')?.value || 'strong';
  const opts = { preset };

  if (preset === 'custom') {
    opts.words = parseInt($('#wordCount').value, 10);
    opts.digits = parseInt($('#digitCount').value, 10);
    opts.symbols = parseInt($('#symbolCount').value, 10);
    opts.wordLength = $('#wordLength').value;
    opts.capMode = $('#capMode').value;
    opts.separator = $('#separator').value;
  }

  return opts;
}

function renderPasswords(list) {
  passwordsEl.innerHTML = list.map(({ password, strength }) => {
    const { label, class: cls } = strength;
    return `
      <li class="password-item" data-password="${escapeAttr(password)}" tabindex="0" role="button" aria-label="Copy password ${password}">
        <span class="password-text">${escapeHtml(password)}</span>
        <span class="password-meta">
          <span class="strength ${cls}">${label}</span>
          <span class="copy-hint">click to copy</span>
        </span>
      </li>`;
  }).join('');

  passwordsEl.querySelectorAll('.password-item').forEach(item => {
    item.addEventListener('click', () => copyPassword(item.dataset.password));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyPassword(item.dataset.password);
      }
    });
  });
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s) {
  return s.replace(/"/g, '&quot;');
}

async function copyPassword(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied: ${text}`);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`Copied: ${text}`);
  }
}

let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

function refresh() {
  renderPasswords(generateBatch(BATCH_SIZE, getOptions()));
}

function updateCustomVisibility() {
  const isCustom = document.querySelector('input[name="preset"]:checked')?.value === 'custom';
  customFields.hidden = !isCustom;
  customFields.style.display = isCustom ? 'grid' : 'none';
}

function updatePresetDesc() {
  const preset = document.querySelector('input[name="preset"]:checked')?.value || 'strong';
  const desc = PRESETS[preset]?.desc || 'Fine-tune every part of your password';
  $('#presetDesc').textContent = desc;
}

// Init
presetInputs.forEach(input => {
  input.addEventListener('change', () => {
    updateCustomVisibility();
    updatePresetDesc();
    refresh();
  });
});

['wordCount', 'digitCount', 'symbolCount', 'wordLength', 'capMode', 'separator'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', refresh);
});

toggleOptions.addEventListener('click', () => {
  const open = optionsPanel.classList.toggle('open');
  toggleOptions.setAttribute('aria-expanded', open);
});

moreBtn.addEventListener('click', (e) => {
  e.preventDefault();
  refresh();
});

updateCustomVisibility();
updatePresetDesc();
refresh();

import { WORDS, SYMBOLS } from './words.js';

const rand = (max) => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
};

const pick = (arr) => arr[rand(arr.length)];

const capitalize = (word, mode) => {
  if (mode === 'lower') return word;
  if (mode === 'title') return word.charAt(0).toUpperCase() + word.slice(1);
  if (mode === 'random') {
    return word.split('').map((c, i) =>
      rand(2) === 0 ? c.toUpperCase() : c
    ).join('');
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const filterWords = (opts) => {
  let pool = [...WORDS];
  if (opts.wordLength === 'short') pool = pool.filter(w => w.length <= 5);
  else if (opts.wordLength === 'medium') pool = pool.filter(w => w.length >= 5 && w.length <= 7);
  else if (opts.wordLength === 'long') pool = pool.filter(w => w.length >= 8);
  return pool.length ? pool : WORDS;
};

const randomDigits = (count) => {
  let n = '';
  for (let i = 0; i < count; i++) n += rand(10);
  if (n[0] === '0' && count > 1) n = String(rand(9) + 1) + n.slice(1);
  return n;
};

const randomSymbols = (count, set) => {
  let s = '';
  for (let i = 0; i < count; i++) s += pick(set);
  return s;
};

export const PRESETS = {
  fair: {
    label: 'Fair',
    strengthClass: 'fair',
    desc: '1 word, 1 digit, 1 symbol — fine for low-risk accounts',
    words: 1, digits: 1, symbols: 1, wordLength: 'any', capMode: 'title', separator: ''
  },
  strong: {
    label: 'Strong',
    strengthClass: 'strong',
    desc: '3 words, 1 digit, 1 symbol — recommended default for everyday use',
    words: 3, digits: 1, symbols: 1, wordLength: 'any', capMode: 'title', separator: ''
  },
  maximum: {
    label: 'Maximum',
    strengthClass: 'maximum',
    desc: '3 words, 2 digits, 2 symbols — for email, banking, and work',
    words: 3, digits: 2, symbols: 2, wordLength: 'any', capMode: 'title', separator: '-'
  }
};

export function resolveStrength(opts, counts) {
  const preset = PRESETS[opts.preset];
  if (preset) {
    return { label: preset.label, class: preset.strengthClass };
  }

  const { words, digits, symbols } = counts;
  if (words >= 3 && digits >= 2 && symbols >= 2) {
    return { label: 'Maximum', class: 'maximum' };
  }
  if (words >= 3 || (words >= 2 && digits + symbols >= 2)) {
    return { label: 'Strong', class: 'strong' };
  }
  return { label: 'Fair', class: 'fair' };
}

export function generatePassword(opts = {}) {
  const preset = PRESETS[opts.preset] || PRESETS.strong;
  const words = opts.words ?? preset.words;
  const digits = opts.digits ?? preset.digits;
  const symbols = opts.symbols ?? preset.symbols;
  const wordLength = opts.wordLength ?? preset.wordLength;
  const capMode = opts.capMode ?? preset.capMode;
  const separator = opts.separator ?? preset.separator;
  const symbolSet = opts.symbolSet ?? SYMBOLS;

  const pool = filterWords({ wordLength });
  const chosen = [];
  const used = new Set();

  for (let i = 0; i < words; i++) {
    let w;
    let attempts = 0;
    do {
      w = pool[rand(pool.length)];
      attempts++;
    } while (used.has(w) && attempts < 30);
    used.add(w);
    chosen.push(capitalize(w, capMode));
  }

  const wordPart = chosen.join(separator);
  const numPart = randomDigits(digits);
  const symPart = randomSymbols(symbols, symbolSet);

  // Interleave: word + digits + symbols (classic memorable pattern)
  const password = `${wordPart}${numPart}${symPart}`;
  const counts = { words, digits, symbols };

  return {
    password,
    strength: resolveStrength(opts, counts)
  };
}

export function generateBatch(count, opts) {
  const results = [];
  const seen = new Set();
  let attempts = 0;
  while (results.length < count && attempts < count * 20) {
    attempts++;
    const { password, strength } = generatePassword(opts);
    if (!seen.has(password)) {
      seen.add(password);
      results.push({ password, strength });
    }
  }
  return results;
}

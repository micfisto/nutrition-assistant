const MIN_STEM = 3;

export function normalizeFood(text) {
  return String(text ?? "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ");
}

// грубая основа слова: без окончания «яйца» находит «Яйцо»
export function foodStem(word) {
  const w = normalizeFood(word);
  if (w.length >= 7) return w.slice(0, -2);
  if (w.length >= 4) return w.slice(0, -1);
  return w;
}

export function matchesExcluded(ingredientName, excludedWords = []) {
  const name = normalizeFood(ingredientName);
  return excludedWords.some((word) => {
    const stem = foodStem(word);
    return stem.length >= MIN_STEM && name.includes(stem);
  });
}
import fs from "fs";

const p = "data/recipes.csv";
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);

const fill = {
  "rec-breakfast-cottage": "Смешивание",
  "rec-snack-yogurt": "Смешивание",
  "rec-snack-apple-nuts": "Нарезка",
  "rec-snack-cheese-bread": "Запекание",
  "rec-snack-cottage-smoothie": "Взбивание",
  "rec-snack-nut-fruit-bar": "Смешивание",
};

// корректная строка заканчивается типами приёма пищи и способом приготовления
const complete = /,"[a-z,]+",[^",]*$/;

const seen = new Set();
const out = [lines[0]];
let dropped = 0;

for (const raw of lines.slice(1)) {
  let l = raw.trimEnd();
  if (!l.trim()) continue;
  const id = l.split(",")[0];
  if (!l.startsWith("rec-") || !complete.test(l) || seen.has(id)) {
    console.log("Удалена строка:", l.slice(0, 60));
    dropped++;
    continue;
  }
  seen.add(id);
  if (fill[id] && l.endsWith(",")) l += fill[id];
  l = l
    .replace("Торт с курицей", "Лепёшка с курицей")
    .replace("Кезядилья", "Кесадилья");
  out.push(l);
}

fs.writeFileSync(p, out.join("\n") + "\n");
console.log(`Готово: рецептов ${out.length - 1}, удалено строк ${dropped}`);

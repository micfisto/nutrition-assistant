function closeAll(except) {
  document.querySelectorAll(".cselect.open").forEach((el) => {
    if (el !== except) el.classList.remove("open");
  });
}

function enhance(select) {
  if (select.dataset.enhanced) return;
  select.dataset.enhanced = "1";
  select.classList.add("native-hidden");

  const wrap = document.createElement("div");
  wrap.className = "cselect";
  if (select.className.includes("datepicker__select")) {
    wrap.classList.add("cselect--compact");
  }

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cselect__btn";

  const list = document.createElement("ul");
  list.className = "cselect__list";

  function sync() {
    const opt = select.options[select.selectedIndex];
    btn.textContent = opt ? opt.textContent : "";
    list.querySelectorAll("li").forEach((li, i) => {
      li.classList.toggle("selected", i === select.selectedIndex);
    });
  }

  function build() {
    list.innerHTML = "";
    [...select.options].forEach((opt, i) => {
      const li = document.createElement("li");
      li.textContent = opt.textContent;
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        select.selectedIndex = i;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        sync();
        wrap.classList.remove("open");
      });
      list.appendChild(li);
    });
    sync();
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAll(wrap);
    wrap.classList.toggle("open");
    const selected = list.querySelector("li.selected");
    if (selected) selected.scrollIntoView({ block: "nearest" });
  });

  // если код меняет значение или варианты списка, обновляем вид
  select.addEventListener("change", sync);
  new MutationObserver(build).observe(select, { childList: true });

  wrap.append(btn, list);
  select.after(wrap);
  build();
}

function enhanceAll() {
  document
    .querySelectorAll(
      ".catalog-toolbar select, .field select, .datepicker__select",
    )
    .forEach(enhance);
}

document.addEventListener("click", () => closeAll());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});

new MutationObserver(enhanceAll).observe(document.body, {
  childList: true,
  subtree: true,
});
enhanceAll();

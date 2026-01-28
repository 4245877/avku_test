(function () {
  const storageKey = "avku_lang";
  const defaultLang = document.documentElement.lang || "uk";

  function setNavHandlers() {
    const btn = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
      const isOpen = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!isOpen));
    });

    // Закрывать меню при клике по ссылке (мобилки)
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) nav.setAttribute("data-open", "false");
    });
  }

  async function loadDict(lang) {
    try {
      const res = await fetch(`/lang/${lang}.json`, { cache: "no-cache" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function applyDict(dict) {
    if (!dict) return;

    document.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.getAttribute("data-translate");
      if (!key) return;
      const value = dict[key];
      if (typeof value === "string" && value.length) {
        el.textContent = value;
      }
    });
  }

  async function setLanguage(lang) {
    localStorage.setItem(storageKey, lang);
    document.documentElement.lang = lang;

    const dict = await loadDict(lang);
    applyDict(dict);

    // подсветка кнопок языка (минимально)
    document.querySelectorAll("[data-lang]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
  }

  function setLangHandlers() {
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => setLanguage(btn.getAttribute("data-lang")));
    });
  }

  // init
  setNavHandlers();
  setLangHandlers();

  const saved = localStorage.getItem(storageKey);
  setLanguage(saved || defaultLang);
})();

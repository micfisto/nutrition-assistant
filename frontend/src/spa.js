import loginHtml from "./pages/login.html?raw";
import registerHtml from "./pages/register.html?raw";
import accountHtml from "./pages/account.html?raw";
import aboutHtml from "./pages/about.html?raw";
import page404Html from "./pages/404.html?raw";
import { isAuthenticated, logout } from "./services/authApi.js";

const home = document.getElementById("view-home");
const auth = document.getElementById("view-auth");

const PAGES = {
  "#/login": { html: loginHtml, script: "/src/pages/login.js" },
  "#/register": { html: registerHtml, script: "/src/pages/register.js" },
  "#/account": { html: accountHtml, script: "/src/pages/account.js" },
  "#/about": { html: aboutHtml, script: null },
};

const LINK_MAP = {
  "/login.html": "#/login",
  "/register.html": "#/register",
  "login.html": "#/login",
  "register.html": "#/register",
};

function showHome(hash) {
  auth.hidden = true;
  auth.innerHTML = "";
  home.hidden = false;
  window.dispatchEvent(new Event("resize"));

  const isAnchor = hash && !hash.startsWith("#/") && hash.length > 1;
  const target = isAnchor ? document.querySelector(hash) : null;
  if (target) target.scrollIntoView({ behavior: "smooth" });
  else window.scrollTo({ top: 0 });
}

async function showAuth(page) {
  home.hidden = true;
  auth.hidden = false;
  auth.innerHTML = page.html;

  auth.querySelectorAll("a[href]").forEach((a) => {
    const mapped = LINK_MAP[a.getAttribute("href")];
    if (mapped) a.setAttribute("href", mapped);
  });

  window.scrollTo({ top: 0 });
  if (page.script) {
    await import(/* @vite-ignore */ `${page.script}?v=${Date.now()}`);
  }
}

function showNotFound() {
  home.hidden = true;
  auth.hidden = false;
  auth.innerHTML = page404Html;
}

function route() {
  const hash = window.location.hash;
  const page = PAGES[hash];
  if (page) showAuth(page);
  else if (hash && hash.startsWith("#/")) showNotFound();
  else showHome(hash);
}

function setupAuthLinks() {
  const navLogin = document.getElementById("nav-login");
  if (navLogin && isAuthenticated()) {
    const accountLink = document.createElement("a");
    accountLink.href = "#/account";
    accountLink.textContent = "Личный кабинет";
    navLogin.before(accountLink);
  }

  ["nav-login", "footer-login"].forEach((id) => {
    const link = document.getElementById(id);
    if (!link || !isAuthenticated()) return;
    link.textContent = "Выйти";
    link.setAttribute("href", "#");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
      window.location.href = "/";
    });
  });
}

window.addEventListener("hashchange", route);
setupAuthLinks();
route();
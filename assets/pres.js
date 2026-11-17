// Keuzemenu met hash-routes: #/ (omslag), #/website, #/social, #/app, #/vervolg.
// Eén scherm tegelijk; View Transitions als de browser die kent en beweging mag, anders direct wisselen.
const views = [...document.querySelectorAll(".view")];
const routes = views.map((v) => v.dataset.route);
const back = document.querySelector("[data-back]");
const navLinks = [...document.querySelectorAll(".bar__nav a")];
const main = document.getElementById("inhoud");
const calm = matchMedia("(prefers-reduced-motion: reduce)");
let current = null;

const routeOf = () => {
  const r = location.hash.replace(/^#/, "") || "/";
  return routes.includes(r) ? r : "/";
};

function paint(route, { focus }) {
  for (const v of views) v.hidden = v.dataset.route !== route;
  const view = views.find((v) => v.dataset.route === route);
  document.title = route === "/" ? "De Gouden Kurk: een voorproefje" : `${view.dataset.title} · De Gouden Kurk`;
  back.hidden = route === "/";
  for (const a of navLinks) (a.getAttribute("href") === `#${route}` ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  document.body.dataset.route = route.slice(1) || "home";
  window.scrollTo(0, 0);
  if (focus) (view.querySelector("h1, h2") ?? main).focus({ preventScroll: true });
}

function show({ focus = true } = {}) {
  const route = routeOf();
  if (route === current) return;
  const first = current === null;
  current = route;
  if (!first && document.startViewTransition && !calm.matches) document.startViewTransition(() => paint(route, { focus }));
  else paint(route, { focus: focus && !first });
}

addEventListener("hashchange", () => show());
show({ focus: false });

// Toetsen: Escape terug naar het overzicht, pijltjes langs de onderdelen (niet als er in een veld getypt wordt).
document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest?.("input, textarea, select")) return;
  const i = routes.indexOf(current);
  const to = { Escape: "/", ArrowRight: routes[Math.min(routes.length - 1, i + 1)], ArrowLeft: routes[Math.max(0, i - 1)] }[event.key];
  if (!to || to === current) return;
  event.preventDefault();
  location.hash = to;
});

// Als een afbeelding ontbreekt, toon dan de illustratie.
for (const img of document.querySelectorAll("img")) {
  img.addEventListener("error", () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = "1";
    img.src = "assets/img/placeholder.svg";
    img.alt = "Deze afbeelding is nog niet toegevoegd.";
  });
}

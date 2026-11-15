// Presentatiebediening: pijltjestoetsen, teller, voortgang en kleur van de balk.
const slides = [...document.querySelectorAll('.slide')];
const nr = document.getElementById('nr');
const tot = document.getElementById('tot');
const where = document.getElementById('where');
const progress = document.getElementById('progress');

let current = 0;
tot.textContent = String(slides.length);

function setActive(index) {
  current = index;
  nr.textContent = String(index + 1);
  where.textContent = slides[index].dataset.title;
  document.body.dataset.theme = slides[index].dataset.theme;
  progress.style.transform = `scaleX(${(index + 1) / slides.length})`;
}

function go(index) {
  const next = Math.min(slides.length - 1, Math.max(0, index));
  slides[next].scrollIntoView({ block: 'start' });
}

const watcher = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(slides.indexOf(entry.target));
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);
slides.forEach((slide) => watcher.observe(slide));

const reveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      reveal.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

document.getElementById('vorige').addEventListener('click', () => go(current - 1));
document.getElementById('volgende').addEventListener('click', () => go(current + 1));

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const keys = {
    ArrowRight: () => go(current + 1),
    PageDown: () => go(current + 1),
    ArrowLeft: () => go(current - 1),
    PageUp: () => go(current - 1),
    Home: () => go(0),
    End: () => go(slides.length - 1),
  };
  if (!keys[event.key]) return;
  event.preventDefault();
  keys[event.key]();
});

// Als een afbeelding ontbreekt, toon dan de illustratie.
document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = '1';
    img.src = 'assets/img/placeholder.svg';
    img.alt = 'Deze afbeelding is nog niet toegevoegd.';
  });
});

setActive(0);

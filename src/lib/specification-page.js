// Filter chips + scroll-spy + progress bar for src/content/docs/specification.mdx.
// Loaded via `?raw` import + <script set:html> in the MDX so MDX does not
// try to parse the JS body as JSX.

const $$ = (s) => Array.from(document.querySelectorAll(s));

const LEVEL_RANK = (l) => {
  const m = /^L(\d+)$/.exec(l);
  return m ? parseInt(m[1], 10) : 99;
};

const state = {
  level: 'ALL',
  weights: new Set(['MUST', 'MUST_WHEN', 'SHOULD', 'MAY']),
  pillars: new Set($$('[data-toc-pillar]').map((el) => el.dataset.tocPillar)),
};

const hint = document.getElementById('toc-hint');

function applyFilter() {
  const limit = state.level === 'ALL' ? 99 : LEVEL_RANK(state.level);

  $$('article.clause').forEach((art) => {
    const lvl = art.dataset.clauseLevel ?? '';
    const pillar = art.dataset.clausePillar ?? '';
    const inLevel = limit === 99 || LEVEL_RANK(lvl) <= limit;
    const inPillar = state.pillars.has(pillar);
    const rules = Array.from(art.querySelectorAll('li.rule'));
    let anyRule = false;
    for (const li of rules) {
      const w = li.dataset.weight ?? '';
      const visible = state.weights.has(w);
      li.classList.toggle('is-hidden', !visible);
      if (visible) anyRule = true;
    }
    art.classList.toggle('is-hidden', !(inLevel && inPillar && anyRule));
  });

  $$('section.pillar-div').forEach((div) => {
    const pid = div.dataset.pillar ?? '';
    const visibleClauses = $$('article.clause[data-clause-pillar="' + pid + '"]:not(.is-hidden)');
    div.classList.toggle('is-hidden', visibleClauses.length === 0 || !state.pillars.has(pid));
  });

  $$('[data-toc-clause]').forEach((li) => {
    const num = li.dataset.tocClause;
    const art = document.getElementById('c' + num);
    const visible = !!art && !art.classList.contains('is-hidden');
    li.classList.toggle('is-hidden', !visible);
  });
  $$('[data-toc-pillar]').forEach((div) => {
    const pid = div.dataset.tocPillar ?? '';
    const visible =
      $$('[data-toc-clause][data-clause-pillar="' + pid + '"]:not(.is-hidden)').length > 0;
    div.classList.toggle('is-hidden', !visible);
  });

  if (hint) {
    hint.textContent =
      state.level === 'ALL'
        ? 'Showing every clause.'
        : 'Cumulative — clauses required at ' + state.level + ' or below.';
  }
}

$$('[data-filter-group="level"] .chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.level = btn.dataset.level;
    $$('[data-filter-group="level"] .chip').forEach((b) => b.classList.toggle('is-on', b === btn));
    applyFilter();
  });
});

$$('[data-filter-group="weight"] .chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    const w = btn.dataset.weight;
    if (state.weights.has(w)) state.weights.delete(w);
    else state.weights.add(w);
    if (state.weights.size === 0)
      ['MUST', 'MUST_WHEN', 'SHOULD', 'MAY'].forEach((x) => state.weights.add(x));
    $$('[data-filter-group="weight"] .chip').forEach((b) => {
      const on = state.weights.has(b.dataset.weight);
      b.classList.toggle('is-off', !on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    applyFilter();
  });
});

// Pillar chip behaviour:
//
//   - All pillars enabled (the default) + click a chip → focus mode:
//     only the clicked pillar stays on, the rest go off. One-click
//     way to drill into a single pillar.
//   - Only one pillar enabled + click that same chip → re-enable
//     every pillar. One-click way to broaden back out.
//   - Otherwise (some on, some off) → standard toggle: clicking a
//     chip flips that one pillar's on/off state. Falling back to
//     "all on" if the user toggles every pillar off.
const allPillarIds = $$('[data-toc-pillar]').map((p) => p.dataset.tocPillar);
$$('[data-filter-group="pillar"] .chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.pillar;
    const allEnabled = state.pillars.size === allPillarIds.length;
    const onlyThisEnabled = state.pillars.size === 1 && state.pillars.has(id);

    if (allEnabled) {
      state.pillars.clear();
      state.pillars.add(id);
    } else if (onlyThisEnabled) {
      allPillarIds.forEach((p) => state.pillars.add(p));
    } else {
      if (state.pillars.has(id)) state.pillars.delete(id);
      else state.pillars.add(id);
      if (state.pillars.size === 0) allPillarIds.forEach((p) => state.pillars.add(p));
    }

    $$('[data-filter-group="pillar"] .chip').forEach((b) => {
      const on = state.pillars.has(b.dataset.pillar);
      b.classList.toggle('is-off', !on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    applyFilter();
  });
});

// Smooth scroll for hash-link clicks is handled in spec.css via
// `html { scroll-behavior: smooth }` plus `scroll-margin-top` on
// the clause / pillar anchors. Native CSS is more reliable than
// window.scrollTo({ behavior: 'smooth' }), which some browsers
// silently fall back to instant.

const clauseEls = $$('article.clause');
const total = clauseEls.length;
const bar = document.querySelector('#spec-progress-bar > span');
const tocLinks = $$('aside.toc [data-toc-clause] a');
const tocPillars = $$('aside.toc [data-toc-pillar]');

// Highlight the TOC entry matching the clause currently in view, plus
// the pillar that contains it. Each <article.clause> has the long
// `data-clause-num` (e.g. 1) and `data-clause-pillar` (e.g.
// "engineering") attributes; the TOC links target `#c<num>` and the
// pillar wrappers carry `data-toc-pillar="<pillar id>"`.
const setActive = (num, pillarId) => {
  tocLinks.forEach((a) => {
    a.classList.toggle('is-active', a.getAttribute('href') === '#c' + num);
  });
  tocPillars.forEach((p) => {
    p.classList.toggle('is-active', p.dataset.tocPillar === pillarId);
  });
  const n = parseInt(num, 10);
  if (bar && Number.isFinite(n) && total) bar.style.width = (n / total) * 100 + '%';
};
if (clauseEls.length) {
  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top,
        );
      if (visible[0]) {
        const t = visible[0].target;
        setActive(t.dataset.clauseNum, t.dataset.clausePillar);
      }
    },
    { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
  );
  clauseEls.forEach((el) => obs.observe(el));
}

applyFilter();

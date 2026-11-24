const pageviewCounter = document.getElementById('pageview-total');
const allowCounting = navigator.globalPrivacyControl !== true && navigator.doNotTrack !== '1';

if (pageviewCounter) {
  loadVisitorMap(updatePageviewCount());
} else if (allowCounting) {
  updatePageviewCount();
}

async function updatePageviewCount() {
  if (pageviewCounter) pageviewCounter.textContent = '加载中…';
  try {
    const response = await fetch('https://grant-visitor-map.bowgneo-github-io.workers.dev/pageviews', {
      method: allowCounting ? 'POST' : 'GET',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      keepalive: true,
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error('Pageview count unavailable');
    if (pageviewCounter) {
      const { total, countries } = await response.json();
      if (!Number.isSafeInteger(total)) throw new Error('Invalid pageview count');
      pageviewCounter.textContent = `${total.toLocaleString('zh-CN')} 次`;
      pageviewCounter.dataset.loaded = '';
      return countries;
    }
  } catch {
    if (pageviewCounter) pageviewCounter.textContent = '暂不可用';
  }
}

async function loadVisitorMap(stats) {
  const plot = document.querySelector('.visitor-map');
  const tooltip = plot.querySelector('.visitor-tooltip');
  try {
    const response = await fetch('assets/visitor-countries.json');
    if (!response.ok) throw new Error('Map unavailable');
    const atlas = await response.json();
    const counts = await stats;
    const regionNames = new Intl.DisplayNames(['zh-CN'], { type: 'region' });
    const max = Math.max(1, ...Object.values(counts ?? {}));
    const ns = 'http://www.w3.org/2000/svg';
    const map = document.createElementNS(ns, 'svg');
    map.setAttribute('viewBox', atlas.viewBox);
    map.setAttribute('role', 'group');
    map.setAttribute('aria-label', '访客地图，悬停或点按地区查看浏览量');

    for (const [code, outline] of Object.entries(atlas.regions)) {
      const count = counts?.[code] ?? 0;
      const region = document.createElementNS(ns, 'path');
      const value = counts ? `${count.toLocaleString('zh-CN')} 次浏览` : '浏览量暂不可用';
      region.setAttribute('aria-label', `${regionNames.of(code)} · ${value}`);
      region.setAttribute('role', 'img');
      region.setAttribute('d', outline);
      if (count > 0) {
        region.setAttribute('tabindex', '0');
        region.style.setProperty('--country-fill', `rgb(38 95 147 / ${0.35 + 0.65 * Math.sqrt(count / max)})`);
      }
      map.append(region);
    }

    function show(event) {
      const caption = event.target.closest('path')?.getAttribute('aria-label');
      tooltip.hidden = !caption;
      if (caption) tooltip.textContent = caption;
    }

    map.addEventListener('pointerover', show);
    map.addEventListener('click', show);
    map.addEventListener('focusin', show);
    map.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'touch') tooltip.hidden = true;
    });
    map.addEventListener('focusout', () => { tooltip.hidden = true; });
    map.addEventListener('keydown', event => {
      if (event.key === 'Escape') tooltip.hidden = true;
    });
    plot.querySelector('img').replaceWith(map);
  } catch {
    tooltip.textContent = '互动地图暂不可用';
    tooltip.hidden = false;
  }
}

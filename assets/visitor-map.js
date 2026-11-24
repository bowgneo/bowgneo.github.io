const visitorSection = document.querySelector('[data-visitor-endpoint]');
const endpoint = visitorSection?.dataset.visitorEndpoint;
const sessionKey = 'grant-homepage-counted';
const regionNames = new Intl.DisplayNames(['zh-CN'], { type: 'region' });

if (endpoint) loadVisitorMap(visitorSection, endpoint);

async function loadVisitorMap(section, endpointUrl) {
  const status = section.querySelector('#visitor-status');
  status.textContent = '正在加载访问统计…';

  try {
    const shouldCount = navigator.globalPrivacyControl !== true &&
      navigator.doNotTrack !== '1' && !alreadyCounted();
    const response = await fetch(endpointUrl, {
      method: shouldCount ? 'POST' : 'GET',
      credentials: 'omit',
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error('Visitor statistics unavailable');
    if (shouldCount) {
      try { sessionStorage.setItem(sessionKey, '1'); } catch { /* Storage can be disabled. */ }
    }

    const stats = await response.json();
    const atlas = await fetch('assets/visitor-countries.json', { signal: AbortSignal.timeout(6000) });
    if (!atlas.ok) throw new Error('Map data unavailable');
    drawVisitorMap(section.querySelector('.visitor-map'), await atlas.json(), stats.countries);
    showBreakdown(section.querySelector('.visitor-breakdown'), stats);
    status.textContent = `首页累计访问 ${stats.total.toLocaleString('zh-CN')} 次`;
  } catch {
    status.textContent = '访问统计暂不可用';
  }
}

function alreadyCounted() {
  try { return sessionStorage.getItem(sessionKey) === '1'; } catch { return false; }
}

function showBreakdown(details, { countries, total }) {
  const counts = Object.entries(countries);
  const unknown = total - counts.reduce((sum, [, count]) => sum + count, 0);
  if (unknown) counts.push(['XX', unknown]);
  for (const [code, count] of counts.sort((a, b) => b[1] - a[1])) {
    const item = document.createElement('li');
    const place = code === 'XX' ? '未知地区' : regionNames.of(code);
    item.textContent = `${place} · ${count.toLocaleString('zh-CN')} 次访问`;
    details.querySelector('ul').append(item);
  }
  details.hidden = !counts.length;
}

function drawVisitorMap(plot, atlas, counts) {
  const namespace = 'http://www.w3.org/2000/svg';
  const tooltip = plot.querySelector('.visitor-tooltip');
  const map = document.createElementNS(namespace, 'svg');
  map.setAttribute('viewBox', atlas.viewBox);
  map.setAttribute('role', 'group');
  map.setAttribute('aria-label', '各国家或地区的访问次数');
  const max = Math.max(1, ...Object.values(counts));

  for (const [code, outline] of Object.entries(atlas.regions)) {
    const count = counts[code] ?? 0;
    const region = document.createElementNS(namespace, 'path');
    region.setAttribute('d', outline);
    region.dataset.caption = `${regionNames.of(code)} · ${count.toLocaleString('zh-CN')} 次访问`;
    region.setAttribute('aria-label', region.dataset.caption);
    if (count > 0) {
      region.classList.add('has-visits');
      region.setAttribute('tabindex', '0');
      region.style.setProperty('--country-fill', `rgb(38 95 147 / ${0.35 + 0.65 * Math.sqrt(count / max)})`);
    }
    map.append(region);
  }

  function show(event) {
    const caption = event.target.dataset.caption;
    if (!caption) return;
    tooltip.textContent = caption;
    tooltip.hidden = false;
  }

  map.addEventListener('pointerover', show);
  map.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') tooltip.hidden = true;
  });
  map.addEventListener('focusin', show);
  map.addEventListener('focusout', () => { tooltip.hidden = true; });
  map.addEventListener('click', show);
  plot.querySelector('img').replaceWith(map);
}

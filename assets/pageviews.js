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
    const response = await fetch('assets/visitor-countries.json?v=region-points');
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

    for (const [code, geometry] of Object.entries({ ...atlas.regions, ...atlas.points })) {
      const count = counts?.[code] ?? 0;
      const point = Array.isArray(geometry);
      if (point && !count) continue;
      const region = document.createElementNS(ns, point ? 'circle' : 'path');
      const value = counts ? `${count.toLocaleString('zh-CN')} 次浏览` : '浏览量暂不可用';
      region.setAttribute('aria-label', `${regionNames.of(code)} · ${value}`);
      region.setAttribute('role', 'img');
      if (point) {
        region.setAttribute('cx', geometry[0]);
        region.setAttribute('cy', geometry[1]);
      } else {
        region.setAttribute('d', geometry);
      }
      if (count > 0) {
        region.setAttribute('tabindex', '0');
        region.style.setProperty('--country-fill', `rgb(38 95 147 / ${0.35 + 0.65 * Math.sqrt(count / max)})`);
      }
      map.append(region);
    }

    function show(event) {
      const caption = event.target.closest('path, circle')?.getAttribute('aria-label');
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
    enableMapNavigation(plot, map, tooltip);
  } catch {
    tooltip.textContent = '互动地图暂不可用';
    tooltip.hidden = false;
  }
}

function enableMapNavigation(plot, map, tooltip) {
  const viewport = map.parentElement;
  const controls = plot.nextElementSibling;
  const zoomIn = controls.querySelector('.zoom-in');
  const zoomOut = controls.querySelector('.zoom-out');
  const reset = controls.querySelector('.zoom-reset');
  const scaleLabel = controls.querySelector('.map-scale');
  let scale = 1;

  function zoom(next, x = viewport.clientWidth / 2, y = viewport.clientHeight / 2) {
    next = Math.max(1, Math.min(8, next));
    if (next === scale) return;
    const ratio = next / scale;
    const left = (viewport.scrollLeft + x) * ratio - x;
    const top = (viewport.scrollTop + y) * ratio - y;
    scale = next;
    map.style.width = `${scale * 100}%`;
    map.style.setProperty('--map-scale', scale);
    viewport.scrollTo(left, top);
    viewport.toggleAttribute('data-zoomed', scale > 1);
    viewport.tabIndex = scale > 1 ? 0 : -1;
    zoomOut.disabled = reset.disabled = scale === 1;
    zoomIn.disabled = scale === 8;
    scaleLabel.textContent = `${scale}×`;
    tooltip.hidden = true;
  }

  zoomIn.addEventListener('click', () => zoom(scale * 2));
  zoomOut.addEventListener('click', () => zoom(scale / 2));
  reset.addEventListener('click', () => zoom(1));
  viewport.addEventListener('dblclick', event => {
    const bounds = viewport.getBoundingClientRect();
    zoom(scale * 2, event.clientX - bounds.left, event.clientY - bounds.top);
  });
  viewport.addEventListener('scroll', () => { tooltip.hidden = true; });
  controls.hidden = false;

  // Touch and trackpad panning use the viewport's native scrolling.
  let drag;
  let moved = false;
  viewport.addEventListener('pointerdown', event => {
    moved = false;
    if (scale === 1 || event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    event.target.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag || event.pointerType !== 'mouse') return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!moved && Math.hypot(dx, dy) < 4) return;
    moved = true;
    viewport.setAttribute('data-dragging', '');
    viewport.scrollTo(drag.left - dx, drag.top - dy);
    tooltip.hidden = true;
  });
  viewport.addEventListener('lostpointercapture', () => {
    drag = null;
    viewport.removeAttribute('data-dragging');
  });
  viewport.addEventListener('click', event => {
    if (moved) event.stopPropagation();
  }, true);
}

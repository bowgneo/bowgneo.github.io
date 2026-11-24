const pageviewCounter = document.getElementById('pageview-total');
const allowCounting = navigator.globalPrivacyControl !== true && navigator.doNotTrack !== '1';

if (allowCounting || pageviewCounter) updatePageviewCount();

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
      const { total } = await response.json();
      if (!Number.isSafeInteger(total)) throw new Error('Invalid pageview count');
      pageviewCounter.textContent = `${total.toLocaleString('zh-CN')} 次`;
      pageviewCounter.dataset.loaded = '';
    }
  } catch {
    if (pageviewCounter) pageviewCounter.textContent = '暂时无法获取浏览量';
  }
}

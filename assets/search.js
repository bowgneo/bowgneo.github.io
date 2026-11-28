(() => {
  const input = document.getElementById('article-query');
  const catalog = document.querySelector('.series-list');
  const results = document.getElementById('search-results');
  const status = results.querySelector('.search-status');
  const list = results.querySelector('ul');
  const entries = new Map();
  const normalize = text => text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
  let loading = false;
  let complete = false;
  let partial = false;

  function add(link, base, series, summary = '') {
    const url = new URL(link.getAttribute('href'), base);
    if (url.origin !== location.origin || url.hash) return;
    const entry = entries.get(url.href) ?? { title: link.textContent.trim(), url: url.href, series, body: '' };
    if (summary) entry.summary = summary;
    entries.set(url.href, entry);
    return entry;
  }

  const series = Array.from(catalog.querySelectorAll('.series-card'), card => {
    const directory = add(card.querySelector('h3 a'), location.href, '', card.querySelector('p')?.textContent);
    for (const link of card.querySelectorAll('.series-chapters a')) add(link, location.href, directory.title);
    return directory;
  });

  async function read(url) {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Search source unavailable');
    const template = document.createElement('template');
    template.innerHTML = await response.text();
    return template.content;
  }

  async function indexContent() {
    loading = true;
    partial = false;
    const directories = await Promise.allSettled(series.map(async directory => {
      const doc = await read(directory.url);
      for (const card of doc.querySelectorAll('.cards li')) {
        const link = card.querySelector('h2 a, h3 a');
        if (link) add(link, directory.url, directory.title, card.querySelector('p')?.textContent);
      }
    }));
    const articles = await Promise.allSettled([...entries.values()].filter(e => e.series && !e.body).map(async entry => {
      const doc = await read(entry.url);
      const article = doc.querySelector('main article') ?? doc.querySelector('main');
      if (!article) throw new Error('Missing article');
      article.querySelectorAll('nav, aside, .downloads, script, style').forEach(node => node.remove());
      entry.body = article.textContent.replace(/\s+/g, ' ').trim();
    }));
    partial = [...directories, ...articles].some(result => result.status === 'rejected');
    complete = !partial;
    loading = false;
    render();
  }

  function render() {
    const query = normalize(input.value);
    results.hidden = !query;
    catalog.hidden = !!query;
    list.replaceChildren();
    if (!query) return;
    const terms = query.split(' ');
    const hits = [];
    for (const entry of entries.values()) {
      const title = normalize(entry.title);
      const summary = normalize([entry.series, entry.summary].join(' '));
      const body = normalize(entry.body);
      const scores = terms.map(term => title.includes(term) ? 3 : summary.includes(term) ? 2 : body.includes(term) ? 1 : 0);
      if (scores.includes(0)) continue;
      const row = document.createElement('li');
      const link = document.createElement('a');
      link.href = entry.url;
      link.textContent = entry.title;
      const detail = document.createElement('p');
      detail.textContent = entry.summary || entry.series;
      if (scores.includes(1)) {
        const start = Math.max(0, body.indexOf(terms[scores.indexOf(1)]) - 22);
        detail.textContent = (start ? '…' : '') + entry.body.slice(start, start + 96) + (start + 96 < entry.body.length ? '…' : '');
      }
      row.append(link, detail);
      hits.push({ row, score: scores.reduce((a, b) => a + b, 0) });
    }
    hits.sort((a, b) => b.score - a.score);
    list.append(...hits.map(hit => hit.row));
    const count = hits.length ? `找到 ${hits.length} 项结果` : '没有找到匹配的文章或系列';
    status.textContent = loading ? '搜索中…' : count + (partial ? '（部分内容暂不可用）' : '');
  }

  input.closest('label').hidden = false;
  input.addEventListener('input', () => {
    if (input.value.trim() && !complete && !loading) indexContent();
    render();
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      input.value = '';
      render();
    }
  });
})();

(() => {
  const key = 'grant-theme';
  const system = matchMedia('(prefers-color-scheme: dark)');
  let override;
  let button;
  const meta = document.querySelector('meta[name="theme-color"]');
  const lightColor = meta?.content;

  function sync() {
    try { override = localStorage.getItem(key); } catch { /* Keep the current choice for this page. */ }
    apply();
  }

  function apply() {
    const dark = override === 'dark' || (override !== 'light' && system.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    if (meta) meta.content = dark ? '#151b22' : lightColor;
    if (button) {
      button.title = button.ariaLabel = dark ? '切换到浅色模式' : '切换到深色模式';
    }
  }

  sync();
  system.addEventListener('change', apply);
  window.addEventListener('pageshow', sync);
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) sync();
  });

  document.addEventListener('DOMContentLoaded', () => {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-switch';
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path class="moon" d="M20 14a8.3 8.3 0 0 1-10-10A8.4 8.4 0 1 0 20 14Z"/>
      <g class="sun"><circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>
      </g></svg>`;
    apply();
    button.addEventListener('click', () => {
      override = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, override); } catch { /* Storage is optional. */ }
      apply();
    });
    const header = document.querySelector('header');
    (header.querySelector('.main-nav') ?? header).append(button);
  });
})();

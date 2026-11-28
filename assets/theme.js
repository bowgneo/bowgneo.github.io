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
      button.textContent = dark ? '浅色' : '深色';
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
    apply();
    button.addEventListener('click', () => {
      override = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, override); } catch { /* Storage is optional. */ }
      apply();
    });
    document.querySelector('header nav').append(button);
  });
})();

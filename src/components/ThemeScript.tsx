export function ThemeScript() {
  const source = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark') document.documentElement.classList.add('dark');
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}

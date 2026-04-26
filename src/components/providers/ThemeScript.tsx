/**
 * Inline script injected before hydration so the correct theme is applied
 * on first paint (no white flash for dark users). Reads localStorage and
 * falls back to system preference.
 */
const SCRIPT = `(() => {
  try {
    const saved = localStorage.getItem("lenscan-theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (!saved && systemDark);
    if (dark) document.documentElement.classList.add("dark");
  } catch (_) {}
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}

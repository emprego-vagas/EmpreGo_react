export let isThemeLocked = true;
export let forcedTheme = 'dark';

export function lockTheme() {
  isThemeLocked = true;
  forcedTheme = 'dark';

  document.documentElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');

  window.dispatchEvent(new Event('theme-lock-change'));
  window.dispatchEvent(new Event('theme-force-dark'));
}

export function unlockTheme() {
  isThemeLocked = false;

  window.dispatchEvent(new Event('theme-lock-change'));
}

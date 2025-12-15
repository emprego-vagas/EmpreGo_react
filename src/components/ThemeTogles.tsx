import 'boxicons/css/boxicons.min.css';
import { useEffect, useState } from 'react';
import '../App.css';
import { isThemeLocked } from '../components/ThemeTogleLock';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [locked, setLocked] = useState(isThemeLocked);

  useEffect(() => {
  const forceDark = () => {
    setIsDark(true);
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  };

  const syncLock = () => {
    setLocked(isThemeLocked);
  };

  window.addEventListener('theme-lock-change', syncLock);
  window.addEventListener('theme-force-dark', forceDark);

  return () => {
    window.removeEventListener('theme-lock-change', syncLock);
    window.removeEventListener('theme-force-dark', forceDark);
  };
}, []);


  const toggleTheme = () => {
    if (locked) return;

    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <button
      className={`fixed top-24 right-8 z-20 w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-all
        ${locked ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'}
      `}
      onClick={toggleTheme}
      disabled={locked}
    >
      {isDark ? (
        <i className="bx bx-sun text-xl text-primary-500"></i>
      ) : (
        <i className="bx bx-moon text-xl text-primary-500"></i>
      )}
    </button>
  );
}

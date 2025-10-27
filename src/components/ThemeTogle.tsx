import 'boxicons/css/boxicons.min.css';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const dark = savedTheme === 'dark';

    document.documentElement.classList.toggle('dark', dark);
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <button
      id="theme-toggle"
      className="fixed top-24 right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-light-300 dark:bg-dark-700 shadow-md hover:shadow-lg transition-all duration-300"
      onClick={toggleTheme}
    >
      {isDark ? (
        <i className="bx bx-sun text-xl text-primary-500"></i>
      ) : (
        <i className="bx bx-moon text-xl text-primary-500"></i>
      )}
    </button>
  );
}

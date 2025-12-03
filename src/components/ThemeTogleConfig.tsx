import 'boxicons/css/boxicons.min.css';
import { useEffect, useState } from 'react';
import '../App.css';

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
    // <button 
    //   id="theme-toggle"
    //   className="fixed top-24 right-8 z-20 w-12 h-12 flex items-center justify-center rounded-full dark: shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
    //   onClick={toggleTheme}
    // >
    //   {isDark ? (
    //     <i className="bx bx-sun text-xl text-primary-500"></i>
    //   ) : (
    //     <i className="bx bx-moon text-xl text-primary-500"></i>
    //   )}
    // </button>
    <button 
        id="theme-toggle"
        className="bg-transparent border-none text-left p-2 text-sm cursor-pointer  hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        onClick={toggleTheme}
        >
        {isDark ? ('Modo: Escuro') : ('Modo: Claro')}           
    </button>
    );
}

import { useState, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import defaulAvatar from '../assets/images/default.jpg';

const Headerbar = ({ user, isToggle, toggle }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check for saved theme preference or system preference
        const isDark = localStorage.theme === 'dark' || 
                      (!('theme' in localStorage) && 
                       window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        setDarkMode(isDark);
        updateThemeClass(isDark);
    }, []);

    const updateThemeClass = (isDark) => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.removeItem('theme');
        }
    };

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        updateThemeClass(newDarkMode);
    };

    return (
        <header className="fixed z-30 top-0 left-0 right-0 md:left-56 py-3 px-4 bg-white dark:bg-slate-900 shadow-sm h-[65px]">
            <div className="flex items-center justify-between">
                {/* Toggle Button (Mobile Only) */}
                <button
                    onClick={() => toggle((prev) => !prev)}
                    className="text-slate-500 p-2 rounded-md md:hidden"
                >
                    {isToggle ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                </button>

                {/* Search Input */}
                <div className="grow max-w-2xl mx-4">
                    <div className="relative ">
                        <input
                            type="search"
                            name="search"
                            placeholder="Search dashboard..."
                            className="w-full py-2 pl-10 pr-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:shadow-lg"
                        />
                       <div className='hidden lg:block'>
                            <svg
                                className="absolute hidden lg:inline-block left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                       </div>
                    </div>
                </div>

                {/* Notification and Profile */}
                <div className="flex items-center gap-4">
                    {/* Dark Mode Toggle Button */}
                    <button 
                        onClick={toggleDarkMode}
                        className="text-slate-800 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors p-2 rounded-full"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <FaSun className="h-5 w-5" />
                        ) : (
                            <FaMoon className="h-5 w-5" />
                        )}
                    </button>
                    
                    <span className="relative block">
                        <IoNotificationsOutline className="h-6 w-6 text-slate-800 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors" />
                    </span>
                    <span className="flex-shrink-0">
                        <img
                            src={user?.photo && user?.photo !== 'default.png' ? user?.photo : defaulAvatar}
                            alt="Profile"
                            className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700 object-cover"
                        />
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Headerbar;
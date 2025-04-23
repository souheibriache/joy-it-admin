"use client";

import { Bell, ChevronDown, Moon, Search, Sun, UserCircle } from "lucide-react";
import HeaderLogo from "../assets/header-logo.png";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTheme } from "next-themes";

const TopBar = () => {
  const { currentUser } = useSelector((state: any) => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="h-[60px] w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-4 md:px-10 shadow-sm">
      <div className="flex items-center">
        <img
          src={HeaderLogo || "/placeholder.svg"}
          className="!h-8  md:h-1/2"
          alt="Joy-IT Logo"
        />
      </div>

      <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200 cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <UserCircle className="h-6 w-6" />
            <span className="hidden md:block font-medium">
              {currentUser?.userName}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <a
                href="/account"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Mon profil
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Paramètres
              </a>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <a
                href="/login"
                className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Déconnexion
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;

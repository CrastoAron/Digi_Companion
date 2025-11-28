import { Link } from "react-router-dom";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useTheme } from "./ThemeContext.jsx";

const NavItem = ({ to, children }) => (
  <Link
    to={to}
    className="px-4 py-2 rounded-lg text-sm font-medium transition-all
               text-gray-700 dark:text-gray-300
               hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500"
  >
    {children}
  </Link>
);

export default function Navbar({ user, onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80
                 shadow-lg border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between h-16 items-center">

        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center font-extrabold text-2xl 
                       bg-gradient-to-r from-indigo-600 to-pink-600 
                       bg-clip-text text-transparent"
          >
            <HeartIcon className="h-7 w-7 mr-2 text-red-500 animate-pulse" />
            Lifespan
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/reminders">Reminders</NavItem>
            <NavItem to="/health">Health</NavItem>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center space-x-3">

          {/* User Section */}
          {user ? (
            <>
              <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                Hi, {user.name || user.email}
              </span>

              <button
                onClick={onLogout}
                className="px-4 py-1.5 rounded-full text-sm font-medium
                           bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full text-sm font-medium
                           bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all
                       hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {isDarkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

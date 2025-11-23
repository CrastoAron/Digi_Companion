import { Link } from "react-router-dom";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useTheme } from "./ThemeContext.jsx";

const NavItem = ({ to, children }) => (
  <Link to={to} className="px-3 py-2 rounded-md text-sm font-medium hover:text-indigo-600">
    {children}
  </Link>
);

export default function Navbar({ user, onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-900 shadow z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">

        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center text-2xl font-extrabold text-indigo-600">
            <HeartIcon className="h-6 w-6 mr-2 text-red-500" />
            Lifespan
          </Link>

          <div className="hidden md:flex items-center">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/reminders">Reminders</NavItem>
            <NavItem to="/health">Health</NavItem>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="text-sm hidden sm:inline">Hi, {user.name || user.email}</span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-red-500 text-white rounded-full text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline text-sm">Login</Link>
              <Link
                to="/register"
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm"
              >
                Sign Up
              </Link>
            </>
          )}

          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            {isDarkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

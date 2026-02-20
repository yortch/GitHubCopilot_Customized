import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";

export default function Navigation() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? darkMode
            ? "glass shadow-lg shadow-black/20"
            : "glass-light shadow-lg shadow-gray-300/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:bg-primary/40 transition-all duration-500" />
              <img
                src="/copilot.png"
                alt="OctoCAT Supply"
                className="h-9 w-auto relative z-10 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="ml-3">
              <span
                className={`font-display text-xl font-bold tracking-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                OctoCAT
              </span>
              <span className="font-display text-xl font-bold text-primary ml-1">
                Supply
              </span>
              <span
                className={`block text-[10px] font-body uppercase tracking-[0.2em] ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Version 2.0
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 font-body text-sm font-medium transition-colors duration-300 group ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-primary to-lavender group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className={`flex items-center gap-1 px-4 py-2 font-body text-sm font-medium transition-colors duration-300 ${
                    darkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Admin
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      adminMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {adminMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-52 rounded-xl overflow-hidden ${
                      darkMode ? "glass" : "glass-light"
                    } shadow-xl`}
                  >
                    <Link
                      to="/admin/products"
                      className={`block px-4 py-3 text-sm font-body transition-all duration-200 ${
                        darkMode
                          ? "text-gray-300 hover:bg-primary/10 hover:text-primary"
                          : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                      }`}
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      Manage Products
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`relative p-2.5 rounded-xl transition-all duration-300 group ${
                darkMode
                  ? "hover:bg-white/5"
                  : "hover:bg-gray-900/5"
              }`}
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                {darkMode ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform duration-500"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      fill="currentColor"
                    />
                    <path
                      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-gray-700 group-hover:-rotate-12 transition-transform duration-500"
                  >
                    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </div>
            </button>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <span className="text-[10px] font-display uppercase tracking-[0.15em] text-primary bg-primary/10 px-2 py-1 rounded-md">
                    Admin
                  </span>
                )}
                <button
                  onClick={logout}
                  className={`font-body text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 ${
                    darkMode
                      ? "text-gray-400 hover:text-white hover:bg-white/5"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="relative font-body text-sm font-semibold text-dark bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-xl btn-lift overflow-hidden group"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-mint-300 to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shift" />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className={`md:hidden pb-6 border-t ${darkMode ? "border-white/5" : "border-gray-200/50"}`}>
            <div className="pt-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-body text-sm font-medium transition-colors ${
                    darkMode
                      ? "text-gray-300 hover:bg-white/5 hover:text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
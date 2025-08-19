import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPieChart,
  FiDollarSign,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { MdOutlineSavings } from "react-icons/md";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || null;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { path: "/", name: "Home", icon: <FiHome /> },
    { path: "/dashboard", name: "Dashboard", icon: <FiPieChart /> },
    { path: "/transaction", name: "Transactions", icon: <FiDollarSign /> },
    { path: "/budget", name: "Budgets", icon: <MdOutlineSavings /> },
    { path: "/profile", name: "Profile", icon: <FiUser /> },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900 shadow-xl py-2"
          : "bg-gray-900 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar Header */}
        <div className="flex items-center justify-between h-10">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              FinanceTrack
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
                <span
                  className={`block mt-1 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300 ${
                    location.pathname === item.path ? "w-full" : ""
                  }`}
                ></span>
              </Link>
            ))}

            {/* User Section - Desktop */}
            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 ml-6"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-medium text-sm">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                </div>
                <span className="text-white text-sm hidden lg:inline">
                  {user.username}
                </span>
              </Link>
            ) : (
              <div className="flex items-center space-x-4 ml-6">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-md hover:from-cyan-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-20">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 shadow-xl animate-fadeIn">
            <div className="px-4 py-6 space-y-4">
              {/* Nav Links */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="p-2 rounded-md bg-gray-700 text-lg mr-3">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}

              {/* User Section - Mobile */}
              {user ? (
                <div className="pt-4 border-t border-gray-700 space-y-3">
                  <div className="flex items-center px-4">
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-xs text-gray-400">Online</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-700 flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="w-full px-6 py-3 text-center text-sm font-medium text-cyan-400 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full px-6 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:from-cyan-600 hover:to-purple-700 shadow transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Optional: Add fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
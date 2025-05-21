// src/components/Navbar.jsx
import React from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle.jsx';

const Navbar = ({ toggleSidebar }) => {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-primary text-white flex items-center justify-between px-4 shadow-md z-50"
      role="banner"
    >
      {/* Hamburger for mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Toggle menu"
      >
        <FaBars className="text-2xl" />
      </button>

      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      {/* Right-side controls */}
      <div className="flex items-center gap-4">
        <DarkModeToggle />
        <Link
          to="/logout"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <FaSignOutAlt /> Logout
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <span className="text-xl">Admin Dashboard</span>
      <Link to="/logout" className="bg-red-500 py-2 px-4 rounded text-white">Logout</Link>
    </div>
  );
};

export default Navbar;

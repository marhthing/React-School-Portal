// src/components/Sidebar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the sidebar on small screens
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger icon for mobile */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-gray-800 text-white">
        <FaBars className="text-2xl" onClick={toggleSidebar} />
        <span className="text-lg">Admin Dashboard</span>
      </div>

      {/* Sidebar */}
      <div
        className={`lg:flex lg:w-64 bg-gray-800 text-white fixed top-0 left-0 h-full transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}
      >
        <div className="lg:w-64 bg-gray-800 p-4">
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <FaTimes className="text-2xl" onClick={toggleSidebar} />
          </div>

          <ul className="space-y-4">
            <li><Link to="/dashboard" className="text-white">Dashboard</Link></li>
            <li><Link to="/register-student" className="text-white">Register New Student</Link></li>
            <li><Link to="/register-teacher" className="text-white">Register New Teacher</Link></li>
            <li><Link to="/my-students" className="text-white">My Students</Link></li>
            <li><Link to="/my-teachers" className="text-white">My Teachers</Link></li>
            <li><Link to="/print-slip" className="text-white">Print Student Slip</Link></li>
            <li><Link to="/manage-students" className="text-white">Register/Deregister Students</Link></li>
            <li><Link to="/manage-subjects" className="text-white">Manage Subjects</Link></li>
            <li><Link to="/result-upload" className="text-white">Result Upload</Link></li>
            <li><Link to="/publish-result" className="text-white">Publish Result</Link></li>
            <li><Link to="/promote-students" className="text-white">Promote Students</Link></li>
            <li><Link to="/check-result" className="text-white">Check Student Result</Link></li>
            <li><Link to="/register-admin" className="text-white">Register New Admin</Link></li>
            <li><Link to="/reports" className="text-white">Analysis & Reports</Link></li>
            <li><Link to="/contact-messages" className="text-white">Contact Us Messages</Link></li>
            <li><Link to="/website" className="text-white">Back to Website</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

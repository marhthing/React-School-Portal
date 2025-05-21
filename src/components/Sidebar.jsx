// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserPlus,
  FaUsers,
  FaFileAlt,
  FaUpload,
  FaCheckCircle,
  FaChartBar,
  FaEnvelope,
  FaArrowLeft,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/register-student', label: 'Register Student', icon: <FaUserPlus /> },
    { path: '/register-teacher', label: 'Register Teacher', icon: <FaUserPlus /> },
    { path: '/my-students', label: 'My Students', icon: <FaUsers /> },
    { path: '/my-teachers', label: 'My Teachers', icon: <FaUsers /> },
    { path: '/print-slip', label: 'Print Slip', icon: <FaFileAlt /> },
    { path: '/manage-students', label: 'Manage Students', icon: <FaUsers /> },
    { path: '/manage-subjects', label: 'Manage Subjects', icon: <FaFileAlt /> },
    { path: '/result-upload', label: 'Result Upload', icon: <FaUpload /> },
    { path: '/publish-result', label: 'Publish Result', icon: <FaCheckCircle /> },
    { path: '/promote-students', label: 'Promote Students', icon: <FaCheckCircle /> },
    { path: '/check-result', label: 'Check Result', icon: <FaFileAlt /> },
    { path: '/register-admin', label: 'Register Admin', icon: <FaUserPlus /> },
    { path: '/reports', label: 'Reports', icon: <FaChartBar /> },
    { path: '/contact-messages', label: 'Contact Messages', icon: <FaEnvelope /> },
    { path: '/website', label: 'Back to Website', icon: <FaArrowLeft /> },
  ];

  return (
    <nav
      aria-label="Main navigation"
      className={`bg-primary text-white lg:w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-lg`}
    >
      <div className="p-4 space-y-2 overflow-y-auto h-full focus:outline-none" tabIndex={-1}>
        {links.map(({ path, label, icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-white text-primary font-semibold shadow'
                  : 'hover:bg-secondary hover:text-white focus:bg-secondary focus:text-white focus:outline-none'}
              `}
              onClick={() => setIsOpen(false)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;

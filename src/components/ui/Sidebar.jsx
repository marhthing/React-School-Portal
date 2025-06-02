// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBook,
  FaUserCheck,
  FaCloudUploadAlt,
  FaGlobe,
  FaFileAlt,
  FaUsersCog,
  FaChartLine,
  FaCog,
  FaArrowLeft,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const links = [
    { path: '/adminDashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/student', label: 'Student', icon: <FaUserGraduate /> },
    { path: '/teacher', label: 'Teacher', icon: <FaChalkboardTeacher /> },
    { path: '/session', label: 'Session', icon: <FaCalendarAlt /> },
    { path: '/subject', label: 'Subjects', icon: <FaBook /> },
    { path: '/register', label: 'Register/Deregister', icon: <FaUserCheck /> },
    { path: '/upload', label: 'Result Upload', icon: <FaCloudUploadAlt /> },
    { path: '/publish', label: 'Publish Result', icon: <FaGlobe /> },
    // { path: '/promote-students', label: 'Promote Students', icon: <FaCheckCircle /> },
    // { path: '/check-result', label: 'Check Result', icon: <FaFileAlt /> },
    { path: '/slip', label: 'Check Student Slip', icon: <FaFileAlt /> },
    { path: '/user-manage', label: 'User Management', icon: <FaUsersCog /> },
    { path: '/report', label: 'Reports', icon: <FaChartLine /> },
    { path: '/setting', label: 'Settings', icon: <FaCog /> },
    // { path: '/contact-messages', label: 'Contact Messages', icon: <FaEnvelope /> },
    { path: '/website', label: 'Back to Website', icon: <FaArrowLeft /> },
  ];

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

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
                onClick={() => setIsOpen(false)} // Close sidebar on mobile after clicking
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navbar fixed at top */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar with toggle for mobile */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content - padding top to avoid navbar overlay */}
      <main className="pt-16 lg:pl-64 p-6 transition-all duration-300">
        <h1 className="text-3xl font-semibold mb-6">Welcome to the Admin Dashboard</h1>
        {/* Your dashboard content here */}
      </main>
    </div>
  );
};

export default AdminDashboard;

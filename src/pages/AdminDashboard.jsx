// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TopStats from '../components/TopStats';
import GenderPieChart from '../components/GenderPieChart';
import SubjectSummary from '../components/SubjectSummary';
import PassFailChart from '../components/PassFailChart';
import TopStudentsTable from '../components/TopStudentsTable';

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`${darkMode ? 'dark' : ''} flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-semibold mb-6">Dashboard Insights</h1>

          {/* Top Statistics */}
          <TopStats />

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 my-6">
            <GenderPieChart />
            <SubjectSummary />
          </div>

          {/* Pass vs Fail Bar Chart */}
          <PassFailChart />

          {/* Top 3 Students Table */}
          <TopStudentsTable />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

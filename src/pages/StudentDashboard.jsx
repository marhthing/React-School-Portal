// src/pages/StudentDashboard.jsx
import Sidebar from '../components/ui/Sidebar';
import Navbar from '../components/ui/Navbar';

const StudentDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="lg:ml-64 flex-1">
        {/* Navbar (top bar) */}
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-semibold">Welcome to the Admin Dashboard</h1>
          {/* Content goes here */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

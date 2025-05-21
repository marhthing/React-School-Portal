// src/pages/TeacherDashboard.jsx
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const TeacherDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="lg:ml-64 flex-1">
        {/* Navbar (top bar) */}
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-semibold">Welcome to the Teacher Dashboard</h1>
          {/* Content goes here */}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

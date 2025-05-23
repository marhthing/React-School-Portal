// pages/AdminDashboard.jsx
import AdminLayout from "../components/AdminLayout";
import Cards from "../components/Admin UI/Cards";
import RecentActivities from "../components/Admin UI/RecentActivities";
import GenderPieChart from "../components/Admin UI/GenderPieChart";
import ClassPerformanceChart from "../components/Admin UI/ClassPerformanceChart";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClock,
  FaCalendarAlt,
  FaFileUpload,
  FaCheckCircle,
  FaUsers
} from "react-icons/fa";

export default function AdminDashboard() {
  const summaryData = [
    { title: "Total Students", value: 520, icon: <FaUserGraduate /> },
    { title: "Total Teachers", value: 35, icon: <FaChalkboardTeacher /> },
    { title: "Current Term", value: "2nd Term", icon: <FaClock /> },
    { title: "Current Session", value: "2024/2025", icon: <FaCalendarAlt /> },
    { title: "Results Uploaded", value: 400, icon: <FaFileUpload /> },
    { title: "Results Published", value: 320, icon: <FaCheckCircle /> },
    { title: "Active Users", value: 18, icon: <FaUsers /> },
  ];

  return (
    <AdminLayout >
      <div className="space-y-6 p-4 mt-20">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryData.map((item, index) => (
            <Cards key={index} {...item} />
          ))}
        </div>

        {/* Recent Activities */}
        <RecentActivities />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GenderPieChart />
          <ClassPerformanceChart />
        </div>
      </div>
    </AdminLayout>
  );
}

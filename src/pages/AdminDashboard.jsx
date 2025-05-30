import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Cards from "../components/Admin UI/Cards";
import RecentActivities from "../components/Admin UI/RecentActivities";
import GenderPieChart from "../components/Admin UI/GenderPieChart";
import ClassPerformanceChart from "../components/Admin UI/ClassPerformanceChart";
import Spinner from '../components/Spinner'
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClock,
  FaCalendarAlt,
  FaFileUpload,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/sfgs_api/api/dashboard.php", {
      credentials: "include", // for cookie/session support
    })
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 mt-20"><Spinner /></div>;

  if (!dashboardData)
    return (
      <div className="p-4 mt-20 text-red-500">Failed to load dashboard data.</div>
    );

  const {
    total_students,
    total_teachers,
    current_term,
    current_session,
    results_uploaded,
    results_published,
    active_users,
    boys,
    girls,
    recent_activities,
    class_performance,
  } = dashboardData;

  // Transform recent_activities to fit RecentActivities component's expected props
  const formattedActivities = recent_activities.map((act) => ({
    id: act.id, // if your backend includes this, else undefined
    type: act.activity.toLowerCase().includes("login") ? "login" : "user",
    message: `${act.user_name} (${act.role}) ${act.activity}`,
    time: act.created_at,
  }));

  const summaryData = [
    { title: "Total Students", value: total_students, icon: <FaUserGraduate /> },
    { title: "Total Teachers", value: total_teachers, icon: <FaChalkboardTeacher /> },
    { title: "Current Term", value: current_term, icon: <FaClock /> },
    { title: "Current Session", value: current_session, icon: <FaCalendarAlt /> },
    { title: "Results Uploaded", value: results_uploaded, icon: <FaFileUpload /> },
    { title: "Results Published", value: results_published, icon: <FaCheckCircle /> },
    { title: "Active Users", value: active_users, icon: <FaUsers /> },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 mt-20">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryData.map((item, index) => (
            <Cards key={index} {...item} />
          ))}
        </div>

        {/* Recent Activities */}
        <RecentActivities activities={formattedActivities} />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GenderPieChart boys={boys} girls={girls} />
          <ClassPerformanceChart data={class_performance} />
        </div>
      </div>
    </AdminLayout>
  );
}

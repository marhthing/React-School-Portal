import { useEffect, useState } from "react";
import AdminLayout from "../components/ui/AdminLayout";
import Cards from "../components/Admin UI/Dashboard/Cards";
import RecentActivities from "../components/Admin UI/Dashboard/RecentActivities";
import GenderPieChart from "../components/Admin UI/Dashboard/GenderPieChart";
import ClassPerformanceChart from "../components/Admin UI/Dashboard/ClassPerformanceChart";
import Spinner from '../components/ui/Spinner'
import { useActiveUsers } from "../components/Admin UI/Dashboard/ActiveUsersContext";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClock,
  FaCalendarAlt,
  FaFileUpload,
  FaCheckCircle,
  FaUsers,
  FaSync,
} from "react-icons/fa";

export default function AdminDashboard() {
  const { activeUsers, refreshActiveUsers, isActive } = useActiveUsers();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost/sfgs_api/api/dashboard.php", {
          credentials: "include", // for cookie/session support
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDashboardData(data);
        setLastRefresh(new Date());
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        // You might want to show a toast or error message here
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh dashboard data every 10 minutes instead of 5
    const refreshInterval = setInterval(fetchDashboardData, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Refresh active users count periodically (reduced frequency)
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshActiveUsers();
    }, 60000); // Every 60 seconds instead of 30

    return () => clearInterval(refreshInterval);
  }, [refreshActiveUsers]);

  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      const [dashboardResponse] = await Promise.all([
        fetch("http://localhost/sfgs_api/api/dashboard.php", {
          credentials: "include",
        }),
        refreshActiveUsers()
      ]);
      
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
        setLastRefresh(new Date());
      }
    } catch (err) {
      console.error("Failed to refresh dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <AdminLayout>
        <div className="p-4 mt-20">
          <Spinner />
        </div>
      </AdminLayout>
    );
  }

  if (!dashboardData) {
    return (
      <AdminLayout>
        <div className="p-4 mt-20">
          <div className="text-red-500 text-center">
            <p>Failed to load dashboard data.</p>
            <button 
              onClick={handleManualRefresh}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const {
    total_students,
    total_teachers,
    current_term,
    current_session,
    results_uploaded,
    results_published,
    boys,
    girls,
    recent_activities,
    class_performance,
  } = dashboardData;

  // Transform recent_activities to fit RecentActivities component's expected props
  const formattedActivities = recent_activities?.map((act) => ({
    id: act.id || Date.now() + Math.random(), // Ensure unique ID
    type: act.activity?.toLowerCase().includes("login") ? "login" : "user",
    message: `${act.user_name || 'Unknown'} (${act.role || 'Unknown'}) ${act.activity || 'performed an action'}`,
    time: act.created_at,
  })) || [];

  const summaryData = [
    { 
      title: "Total Students", 
      value: total_students || 0, 
      icon: <FaUserGraduate />,
      color: "text-blue-600"
    },
    { 
      title: "Total Teachers", 
      value: total_teachers || 0, 
      icon: <FaChalkboardTeacher />,
      color: "text-green-600"
    },
    { 
      title: "Current Term", 
      value: current_term || "N/A", 
      icon: <FaClock />,
      color: "text-purple-600"
    },
    { 
      title: "Current Session", 
      value: current_session || "N/A", 
      icon: <FaCalendarAlt />,
      color: "text-orange-600"
    },
    { 
      title: "Results Uploaded", 
      value: results_uploaded || 0, 
      icon: <FaFileUpload />,
      color: "text-indigo-600"
    },
    { 
      title: "Results Published", 
      value: results_published || 0, 
      icon: <FaCheckCircle />,
      color: "text-emerald-600"
    },
    { 
      title: "Active Users", 
      value: activeUsers, 
      icon: <FaUsers />,
      color: isActive ? "text-green-500" : "text-orange-500",
      subtitle: isActive ? "You are active" : "You are idle"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 mt-20">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {summaryData.map((item, index) => (
            <Cards key={index} {...item} />
          ))}
        </div>

        {/* Recent Activities */}
        <RecentActivities activities={formattedActivities} />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GenderPieChart boys={boys || 0} girls={girls || 0} />
          <ClassPerformanceChart data={class_performance || []} />
        </div>

        {/* Active Users Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Your Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {isActive ? 'Active' : 'Idle'}
              </span>
            </div>
            <div>
              <span className="font-medium">Active Users:</span>
              <span className="ml-2 font-bold text-blue-600">{activeUsers}</span>
            </div>
            <div>
              <span className="font-medium">Server Time:</span>
              <span className="ml-2">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
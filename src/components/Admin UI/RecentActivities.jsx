// components/RecentActivities.jsx
import { Card, CardContent } from "../ui/card";
import { FaUser, FaUpload, FaSignInAlt, FaEdit } from "react-icons/fa";

const activities = [
  { id: 1, type: "login", message: "Admin logged in", time: "2 mins ago", icon: <FaSignInAlt /> },
  { id: 2, type: "upload", message: "Math results uploaded for SS1", time: "10 mins ago", icon: <FaUpload /> },
  { id: 3, type: "edit", message: "Teacher updated class list", time: "30 mins ago", icon: <FaEdit /> },
  { id: 4, type: "login", message: "Mr. Ade logged in", time: "1 hour ago", icon: <FaUser /> },
];

export default function RecentActivities() {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-center gap-3 border-b pb-2 last:border-b-0">
              <div className="text-blue-500 text-xl">{activity.icon}</div>
              <div>
                <p className="text-sm">{activity.message}</p>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

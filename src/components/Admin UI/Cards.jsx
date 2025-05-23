// components/Cards.jsx
import { Card, CardContent } from "../ui/card";
import { FaUserGraduate, FaChalkboardTeacher, FaClock, FaCalendarAlt, FaFileUpload, FaCheckCircle, FaUsers } from "react-icons/fa";

export default function Cards({ title, value, icon }) {
  return (
    <Card className="flex items-center gap-4 p-4 shadow-md">
      <div className="text-3xl text-blue-600">
        {icon}
      </div>
      <CardContent className="p-0">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

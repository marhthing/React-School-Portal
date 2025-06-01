import PropTypes from "prop-types";
import { Card, CardContent } from "../../ui/card";
import {
  FaUser,
  FaUpload,
  FaSignInAlt,
  FaEdit,
  FaInfoCircle,
} from "react-icons/fa";

const iconMap = {
  login: <FaSignInAlt />,
  upload: <FaUpload />,
  edit: <FaEdit />,
  user: <FaUser />,
};

export default function RecentActivities({ activities = [] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>

        {activities.length === 0 ? (
          <p className="text-sm text-gray-400">No recent activities to show.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((activity, index) => (
              <li
                key={activity.id || index}
                className="flex items-center gap-3 border-b pb-2 last:border-b-0"
              >
                <div className="text-blue-500 text-xl">
                  {iconMap[activity.type] || <FaInfoCircle />}
                </div>
                <div>
                  <p className="text-sm">{activity.message}</p>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

RecentActivities.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.string,
      message: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ),
};

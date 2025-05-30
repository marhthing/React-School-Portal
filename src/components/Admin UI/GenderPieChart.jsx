import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#FF69B4"];

export default function GenderPieChart({ boys = 0, girls = 0 }) {
  const data = [
    { name: "Boys", value: boys },
    { name: "Girls", value: girls },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Boys vs Girls</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

GenderPieChart.propTypes = {
  boys: PropTypes.number,
  girls: PropTypes.number,
};

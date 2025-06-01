import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ClassPerformanceChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Class Performance</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="class" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgScore" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

ClassPerformanceChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      class: PropTypes.string.isRequired,
      avgScore: PropTypes.number.isRequired,
    })
  ).isRequired,
};

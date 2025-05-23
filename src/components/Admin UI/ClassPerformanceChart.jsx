// components/ClassPerformanceChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { class: "JS1", avgScore: 75 },
  { class: "JS2", avgScore: 82 },
  { class: "JS3", avgScore: 68 },
  { class: "SS1", avgScore: 80 },
  { class: "SS2", avgScore: 77 },
  { class: "SS3", avgScore: 85 },
];

export default function ClassPerformanceChart() {
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

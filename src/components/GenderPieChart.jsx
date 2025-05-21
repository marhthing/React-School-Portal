// src/components/GenderPieChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const GenderPieChart = () => {
  const chartRef = useRef(null);
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const data = {
      labels: ['Male', 'Female'],
      datasets: [
        {
          data: [180, 140],
          backgroundColor: ['#3b82f6', '#ec4899'],
          hoverOffset: 30,
        },
      ],
    };

    const config = {
      type: 'pie',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true },
        },
      },
    };

    const pieChart = new Chart(ctx, config);

    return () => pieChart.destroy();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
      <canvas ref={chartRef} />
    </div>
  );
};

export default GenderPieChart;

import React, { memo } from 'react';

const Cards = memo(({ title, value, icon, color = "text-blue-600", subtitle }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`text-3xl ${color} opacity-80`}>
          {icon}
        </div>
      </div>
    </div>
  );
});

Cards.displayName = 'Cards';

export default Cards;
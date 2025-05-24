import React from 'react';

export default function SubjectCategoryBadge({ category }) {
  let bgColor = 'bg-gray-300 text-gray-800';

  if (category === 'Science') {
    bgColor = 'bg-blue-500 text-white';
  } else if (category === 'Art') {
    bgColor = 'bg-orange-400 text-white';
  } else if (category === 'General') {
    bgColor = 'bg-gray-400 text-gray-900';
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor}`}
    >
      {category}
    </span>
  );
}

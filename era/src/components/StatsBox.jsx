import React from 'react';
import { FaCalendarAlt, FaCheckCircle, FaRegClock } from 'react-icons/fa';

export default function StatsBox({ title, value, type }) {
  
  const getIcon = () => {
    switch (type) {
      case 'total':
        return <FaCalendarAlt className="text-indigo-500 text-xl" />;
      case 'active':
        return <FaRegClock className="text-green-500 text-xl" />;
      case 'completed':
        return <FaCheckCircle className="text-gray-500 text-xl" />;
      default:
        return <FaCalendarAlt className="text-indigo-500 text-xl" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow flex items-center gap-4">
      <div>{getIcon()}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-2xl font-semibold text-gray-800">{value}</span>
      </div>
    </div>
  );
}

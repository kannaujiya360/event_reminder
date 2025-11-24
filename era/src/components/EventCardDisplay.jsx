import React from 'react';
import { motion } from 'framer-motion';

export default function EventCardDisplay({ ev }) {
  const dateStr = new Date(ev.date).toLocaleString();

  const imageSrc = ev.imageUrl
    ? ev.imageUrl.startsWith('http')
      ? ev.imageUrl
      : `http://localhost:4000${ev.imageUrl}`
    : '/placeholder.png';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.04 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"
      style={{
        borderImageSlice: 1,
        borderWidth: '2px',
        borderStyle: 'solid'
      }}
    >
      <img
        src={imageSrc}
        alt={ev.title}
        className="w-full h-40 sm:h-44 md:h-48 object-cover"
      />
      <div className="p-3 sm:p-4 flex flex-col gap-1">
        <h3 className="text-lg sm:text-xl font-semibold line-clamp-1 text-gray-900">
          {ev.title}
        </h3>
        <p className="text-gray-700 text-sm line-clamp-2">
          {ev.description || 'No description'}
        </p>
        <p className="text-gray-500 text-xs">{dateStr}</p>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${
            ev.status === 'upcoming'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {ev.status}
        </span>
      </div>
    </motion.div>
  );
}

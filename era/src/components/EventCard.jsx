import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export default function EventCard({ ev, onEdit, onDelete, onImageChange }) {
  const dateStr = new Date(ev.date).toLocaleString();
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(ev._id, e.target.files[0]);
    }
  };

  const imageSrc = ev.imageUrl
    ? ev.imageUrl.startsWith('http')
      ? ev.imageUrl
      : `http://localhost:4000${ev.imageUrl}`
    : '/placeholder.png';

  const statusColors = {
    upcoming: 'bg-green-500 text-white',
    completed: 'bg-gray-400 text-white',
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/20 p-4 flex flex-col"
    >
      <img
        src={imageSrc}
        alt={ev.title}
        className="w-full h-40 object-cover rounded-xl mb-4 shadow-md"
      />
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-semibold text-lg">{ev.title}</h3>
          <p className="text-gray-200 text-sm">{dateStr}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ev.status] || 'bg-gray-300 text-gray-800'}`}>
          {ev.status}
        </span>
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onEdit(ev)}
          className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          Edit
        </button>
        <button
          onClick={handleFileClick}
          className="flex-1 px-3 py-2 bg-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/30 transition"
        >
          Image
        </button>
        <button
          onClick={() => onDelete(ev._id)}
          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </motion.div>
  );
}

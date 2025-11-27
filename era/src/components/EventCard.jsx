import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export default function EventCard({ ev, onEdit, onDelete, onImageChange }) {
  const dateStr = new Date(ev.date).toLocaleString();
  const fileInputRef = useRef(null);

  const handleFileClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) onImageChange(ev._id, e.target.files[0]);
  };

  const imageSrc = ev.imageUrl
    ? ev.imageUrl.startsWith("http")
      ? ev.imageUrl
      : `https://event-reminder-backend-p0gb.onrender.com${ev.imageUrl}`
    : "/placeholder.png";

  const statusColors = {
    upcoming: "bg-green-500 text-white",
    completed: "bg-gray-500 text-white",
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.06,
        rotateX: 5,
        rotateY: -5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
      }}
      transition={{ type: "spring", stiffness: 250 }}
      className="relative rounded-3xl p-[3px] bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 shadow-2xl"
    >
      {/* OUTER ANIMATED GRADIENT BORDER */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-xl opacity-40 animate-pulse"></div>

      {/* CARD INNER */}
      <div className="relative bg-[#0b0f19]/90 backdrop-blur-2xl rounded-3xl p-5 border border-white/10 shadow-xl">

        {/* FLOATING PARTICLES */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-5 left-5 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
          <div className="absolute top-10 right-3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>

        <img
          src={imageSrc}
          alt={ev.title}
          className="w-full h-44 object-cover rounded-2xl mb-4 shadow-lg border border-indigo-500/40"
        />

        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white font-extrabold text-xl drop-shadow-sm">
              {ev.title}
            </h3>
            <p className="text-gray-300 text-sm">{dateStr}</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ev.status]}`}
          >
            {ev.status}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="mt-auto flex gap-3">
          {/* EDIT */}
          <motion.button
            onClick={() => onEdit(ev)}
            whileHover={{ scale: 1.08, rotate: -1 }}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-indigo-400/60 transition-all duration-300"
          >
            Edit
          </motion.button>

          {/* IMAGE */}
          <motion.button
            onClick={handleFileClick}
            whileHover={{ scale: 1.08, rotate: 1 }}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-cyan-400/60 transition-all duration-300"
          >
            Image
          </motion.button>

          {/* DELETE */}
          <motion.button
            onClick={() => onDelete(ev._id)}
            whileHover={{ scale: 1.08, rotate: -1 }}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-red-400/60 transition-all duration-300"
          >
            Delete
          </motion.button>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </motion.div>
  );
}

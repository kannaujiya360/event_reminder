import React from 'react';
import { motion } from 'framer-motion';

export default function EventCardDisplay({ ev }) {
  const dateStr = new Date(ev.date).toLocaleString();

  const imageSrc = ev.imageUrl
    ? ev.imageUrl.startsWith('http')
      ? ev.imageUrl
      : `https://event-reminder-backend-p0gb.onrender.com${ev.imageUrl}`
    : '/placeholder.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -15,
        scale: 1.08,
        rotateZ: 2,
        boxShadow: '0 20px 40px rgba(124,58,237,0.6), 0 0 30px rgba(255,45,255,0.4)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15))',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.25)',
      }}
    >
      {/* Glow rings */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{ boxShadow: ['0 0 20px rgba(124,58,237,0.2)', '0 0 40px rgba(124,58,237,0.4)', '0 0 20px rgba(124,58,237,0.2)'] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      />

      {/* Event Image */}
      <img
        src={imageSrc}
        alt={ev.title}
        className="w-full h-44 sm:h-48 md:h-52 object-cover rounded-t-3xl"
      />

      {/* Event Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg sm:text-xl font-extrabold text-white line-clamp-1">
          {ev.title}
        </h3>
        <p className="text-white/80 text-sm line-clamp-2">
          {ev.description || 'No description'}
        </p>
        <p className="text-white/50 text-xs">{dateStr}</p>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold mt-2 w-max ${
            ev.status === 'upcoming'
              ? 'bg-green-500/30 text-green-300'
              : 'bg-gray-200/20 text-gray-300'
          }`}
        >
          {ev.status}
        </span>
      </div>

      {/* Neon border pulse */}
      <motion.div
        className="absolute -inset-0.5 rounded-3xl pointer-events-none"
        style={{ border: '2px solid rgba(124,58,237,0.4)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

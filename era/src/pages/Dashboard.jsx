// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/events';
import EventCard from '../components/EventCard';
import StatsBox from '../components/StatsBox';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image: null });
  const nav = useNavigate();

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents(filter);
      setEvents(res.data || []);
    } catch (err) {
      console.error('fetch events err', err);
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
        nav('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newEvent.title);
    formData.append('description', newEvent.description);
    formData.append('date', newEvent.date);
    if (newEvent.image) formData.append('image', newEvent.image);

    try {
      await createEvent(formData);
      setShowCreateForm(false);
      setNewEvent({ title: '', description: '', date: '', image: null });
      fetchEvents();
    } catch (err) {
      console.error('create error', err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewEvent(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleEdit = async (ev) => {
    const newTitle = prompt('Edit title', ev.title);
    if (!newTitle) return;
    try {
      await updateEvent(ev._id, { title: newTitle });
      fetchEvents();
    } catch (err) {
      console.error('edit error', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete event?')) return;
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error('delete error', err);
    }
  };

  const handleImageChange = async (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await updateEvent(id, formData);
      setEvents(prev => prev.map(ev => (ev._id === id ? res.data : ev)));
    } catch (err) {
      console.error('Image upload failed', err);
    }
  };

  const total = events.length;
  const active = events.filter(e => e.status === 'upcoming').length;
  const completed = events.filter(e => e.status === 'completed').length;

  // small framer variants
  const btnVariants = { hover: { y: -3, scale: 1.02 } };
  const cardVariants = { hover: { y: -6, scale: 1.02 } };

  return (
    <div className="min-h-screen relative overflow-hidden text-white" style={{ background: 'linear-gradient(180deg,#0b0f17 0%, #0c1320 40%, #0f1724 100%)' }}>
      {/* subtle vignette and gloss */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_10%_10%,rgba(255,255,255,0.02),transparent)] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_90%_90%,rgba(255,255,255,0.01),transparent)] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
      </div>

      {/* top floating soft shapes */}
      <div className="absolute -left-28 -top-28 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-800/20 to-purple-700/10 blur-3xl mix-blend-overlay animate-slow-pulse" />
      <div className="absolute -right-28 -bottom-28 w-96 h-96 rounded-full bg-gradient-to-tr from-pink-700/10 to-blue-800/10 blur-3xl mix-blend-overlay animate-slow-pulse delay-2000" />

      <div className="relative z-20 container mx-auto px-6 py-12">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-sm text-white/70 mt-1">Clean premium dark UI — overview of your events</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              variants={btnVariants}
              whileHover="hover"
              onClick={() => { localStorage.removeItem('token'); nav('/login'); }}
              className="px-4 py-2 rounded-2xl bg-white/6 backdrop-blur-sm border border-white/6 text-white hover:bg-white/8 transition"
            >
              Logout
            </motion.button>

            <motion.button
              variants={btnVariants}
              whileHover="hover"
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:brightness-105 transition text-white font-semibold"
            >
              + Create Event
            </motion.button>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsBox title="Total Events" value={total} color="bg-gradient-to-r from-gray-800 to-gray-700 text-white" />
          <StatsBox title="Active Events" value={active} color="bg-gradient-to-r from-emerald-600 to-lime-500 text-white" />
          <StatsBox title="Completed" value={completed} color="bg-gradient-to-r from-slate-600 to-slate-500 text-white" />
        </div>

        {/* filters */}
        <div className="flex items-center gap-3 flex-wrap mb-8">
          {['', 'upcoming', 'completed'].map(f => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              variants={btnVariants}
              whileHover="hover"
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/6 text-white/80 hover:bg-white/8'
              }`}
            >
              {f === '' ? 'All' : f === 'upcoming' ? 'Active' : 'Completed'}
            </motion.button>
          ))}
          <div className="ml-auto text-sm text-white/60">Showing <span className="font-semibold text-white">{filter || 'All'}</span></div>
        </div>

        {/* create form modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateForm(false)} />
            <motion.form
              onSubmit={handleCreateEvent}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18 }}
              className="relative z-60 w-full max-w-lg bg-gradient-to-b from-[#0b1220]/80 to-[#0b1220]/70 border border-white/8 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-semibold mb-3">Create Event</h3>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-3 rounded-xl bg-white/3 border border-white/6 text-white placeholder-white/50 mb-3"
                required
                value={newEvent.title}
                onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              />
              <textarea
                placeholder="Description"
                className="w-full p-3 rounded-xl bg-white/3 border border-white/6 text-white placeholder-white/50 mb-3"
                value={newEvent.description}
                onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              />
              <input
                type="datetime-local"
                className="w-full p-3 rounded-xl bg-white/3 border border-white/6 text-white placeholder-white/50 mb-3"
                required
                value={newEvent.date}
                onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
              />
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-white mb-4" />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 rounded-lg bg-white/6">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">Create</button>
              </div>
            </motion.form>
          </div>
        )}

        {/* events grid */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-16 text-white/60">Loading...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 text-white/60">No events found.</div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(ev => (
                <motion.div key={ev._id} whileHover={cardVariants.hover} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
                  <EventCard ev={ev} onEdit={handleEdit} onDelete={handleDelete} onImageChange={handleImageChange} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* small footer bar */}
      <div className="absolute left-0 right-0 bottom-6 text-center text-xs text-white/40 z-20">
        © {new Date().getFullYear()} Event Reminder — Clean Dark UI
      </div>

      {/* small styles for animations (tailwind utilities used above assume these exist) */}
      <style>{`
        /* small custom animations for soft pulses */
        @keyframes slow-pulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.06); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        .animate-slow-pulse { animation: slow-pulse 7s ease-in-out infinite; }

        /* ensure modal z index priority */
        .z-60 { z-index: 60; }
      `}</style>
    </div>
  );
}

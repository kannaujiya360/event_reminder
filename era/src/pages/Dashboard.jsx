import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/events';
import EventCard from '../components/EventCard';
import StatsBox from '../components/StatsBox';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image: null }); 
  const nav = useNavigate();

  React.useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents(filter);
      setEvents(res.data);
    } catch (err) {
      console.error('fetch events err', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        nav('/login');
      }
    } finally { setLoading(false); }
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
      console.error(err);
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
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete event?')) return;
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleImageChange = async (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await updateEvent(id, formData);
      setEvents(prev => prev.map(ev => ev._id === id ? res.data : ev));
    } catch (err) { console.error('Image upload failed', err); }
  };

  const total = events.length;
  const active = events.filter(e => e.status === 'upcoming').length;
  const completed = events.filter(e => e.status === 'completed').length;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-600">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-3xl md:text-4xl font-bold">Dashboard</h2>
        <button
          onClick={()=>{ localStorage.removeItem('token'); nav('/login'); }}
          className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:scale-105 transition-transform"
        >
          Logout
        </button>
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsBox title="Total Events" value={total} color="bg-white/10" />
        <StatsBox title="Active Events" value={active} color="bg-white/10" />
        <StatsBox title="Completed" value={completed} color="bg-white/10" />
      </div>

      
      <div className="flex flex-wrap gap-3 mb-6">
        {['','upcoming','completed'].map(f => (
          <button
            key={f}
            onClick={()=>setFilter(f)}
            className={`px-4 py-2 rounded-xl font-medium transition-all
              ${filter===f ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            {f==='' ? 'All' : f==='upcoming' ? 'Active' : 'Completed'}
          </button>
        ))}
        <button
          onClick={()=>setShowCreateForm(true)}
          className="ml-auto px-4 py-2 bg-white text-indigo-600 rounded-xl font-semibold shadow hover:scale-105 transition-transform"
        >
          + Create Event
        </button>
      </div>

      {/* Create Event Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <motion.form
            onSubmit={handleCreateEvent}
            className="bg-white rounded-2xl p-6 w-full max-w-md flex flex-col gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">Create Event</h3>
            <input
              type="text"
              placeholder="Title"
              className="border p-2 rounded"
              value={newEvent.title}
              onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <textarea
              placeholder="Description"
              className="border p-2 rounded"
              value={newEvent.description}
              onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
            />
            <input
              type="datetime-local"
              className="border p-2 rounded"
              value={newEvent.date}
              onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="flex gap-2 justify-end mt-2">
              <button type="button" onClick={()=>setShowCreateForm(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Create</button>
            </div>
          </motion.form>
        </div>
      )}

 
      {loading ? (
        <div className="text-white text-center mt-10">Loading...</div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => (
            <EventCard
              key={ev._id}
              ev={ev}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onImageChange={handleImageChange}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

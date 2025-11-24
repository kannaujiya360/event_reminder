import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import sampleVideo from '../assets/event.mp4';
import { getEvents } from '../api/events';
import EventCard from '../components/EventCardDisplay';


function WeatherWidget() {
  const [weather, setWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const API_KEY = 'bcbdce1de7ddfb288a93a75fa42824f6'; // OpenWeatherMap API key
  const DEFAULT_CITY = { lat: 28.6139, lon: 77.2090 }; 
  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        const fetchByCoords = async (lat, lon) => {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
          );
          const data = await res.json();
          setWeather({
            city: data.name,
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          });
          setLoading(false);
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              fetchByCoords(latitude, longitude);
            },
            () => {
              
              fetchByCoords(DEFAULT_CITY.lat, DEFAULT_CITY.lon);
            }
          );
        } else {
          
          fetchByCoords(DEFAULT_CITY.lat, DEFAULT_CITY.lon);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch weather');
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return <p className="text-white/80">Loading weather...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <motion.div
      className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-lg rounded-xl shadow-lg text-white w-max"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <img src={weather.icon} alt={weather.condition} className="w-12 h-12" />
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{weather.temp}°C</span>
        <span className="text-sm">{weather.city}</span>
      </div>
    </motion.div>
  );
}

// Clock Component
function Clock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div
      className="text-4xl md:text-5xl font-mono text-white drop-shadow-[0_0_25px_rgba(0,0,0,0.8)] mt-2"
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
    >
      {time.toLocaleTimeString()}
    </motion.div>
  );
}

export default function Home() {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(ev => ev.status === 'upcoming');

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start p-6 overflow-hidden">

   
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-600 animate-gradient-fast -z-20"></div>
      <div className="absolute inset-0 bg-black/50 -z-10"></div>

    
      <motion.div
        className="container max-w-7xl flex flex-col md:flex-row items-center gap-12 backdrop-blur-xl bg-white/5 rounded-3xl shadow-[0_30px_90px_rgba(255,255,255,0.2)] p-12 mt-12"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
      
        <div className="flex-1 text-center md:text-left text-white space-y-6">
          <motion.h1
            className="text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-400 drop-shadow-lg"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Event Reminder
          </motion.h1>

          <motion.p
            className="text-2xl text-white/90"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Track your events. Get reminders. Never miss anything important again.
          </motion.p>

        
          <div className="flex gap-6 justify-center md:justify-start mt-6">
            <Clock />
            <WeatherWidget />
          </div>

          <motion.div
            className="flex gap-6 justify-center md:justify-start mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/signup"
              className="px-12 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-12 py-4 border border-white rounded-3xl hover:bg-white/20 transition-colors"
            >
              Login
            </Link>
          </motion.div>
        </div>

       
        <motion.div
          className="flex-1 flex justify-center md:justify-end mt-8 md:mt-0"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.div
            className="w-full md:w-[520px] h-[380px] rounded-3xl overflow-hidden shadow-[0_35px_100px_rgba(255,255,255,0.25)] border border-white/20"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <video
              src={sampleVideo}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover rounded-3xl"
            />
          </motion.div>
        </motion.div>
      </motion.div>

   
      <div className="container max-w-7xl mt-16 bg-white rounded-3xl p-6 shadow-lg z-10 relative">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Upcoming Events</h2>
        {loading ? (
          <p className="text-gray-600">Loading events...</p>
        ) : upcomingEvents.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {upcomingEvents.map(ev => (
              <EventCard key={ev._id} ev={ev} />
            ))}
          </motion.div>
        ) : (
          <p className="text-gray-600">No upcoming events.</p>
        )}
      </div>
    </div>
  );
}

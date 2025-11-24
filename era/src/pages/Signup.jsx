import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import { motion } from 'framer-motion';
import sampleImage from '../assets/event.jpg';

export default function Signup() {
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });
  const [err, setErr] = React.useState('');
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await register(form);
      localStorage.setItem('token', res.data.token);
      nav('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">

     
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-800 via-purple-700 to-pink-600 animate-gradient-fast -z-20"></div>
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      <motion.div 
        className="container max-w-6xl flex flex-col md:flex-row items-center gap-12 p-6 md:p-12 rounded-3xl bg-white/5 backdrop-blur-xl shadow-[0_30px_90px_rgba(255,255,255,0.25)]"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        
        <motion.div 
          className="flex-1 w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-3xl shadow-[0_25px_60px_rgba(255,255,255,0.2)] border border-white/20"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-400 text-center mb-6 drop-shadow-lg">
            Sign Up
          </h2>

          {err && (
            <motion.div 
              className="text-red-400 mb-4 text-center font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {err}
            </motion.div>
          )}

          <form onSubmit={handle} className="space-y-5">
            <motion.input 
              required 
              value={form.name} 
              onChange={e=>setForm({...form, name: e.target.value})}
              placeholder="Name" 
              className="w-full p-4 rounded-2xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 backdrop-blur-sm"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            <motion.input 
              required 
              value={form.email} 
              onChange={e=>setForm({...form, email: e.target.value})}
              placeholder="Email" 
              className="w-full p-4 rounded-2xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 backdrop-blur-sm"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
            <motion.input 
              required 
              type="password" 
              value={form.password} 
              onChange={e=>setForm({...form, password: e.target.value})}
              placeholder="Password" 
              className="w-full p-4 rounded-2xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 backdrop-blur-sm"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            />

            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button 
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-3xl shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[0_0_35px_rgba(0,0,0,0.5)] transition-all"
              >
                Sign Up
              </button>
              <Link to="/login" className="text-white/80 hover:text-white text-sm mt-2 sm:mt-0">
                Already have an account?
              </Link>
            </motion.div>
          </form>
        </motion.div>

       
        <motion.div 
          className="flex-1 w-full md:w-[380px] h-[380px] md:h-[420px] rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(255,255,255,0.25)] border border-white/20 hover:scale-105 transition-transform"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src={sampleImage}
            alt="Event"
            className="w-full h-full object-cover rounded-3xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

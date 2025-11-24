import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { motion } from 'framer-motion';
import loginImage from '../assets/event.jpg'; 

export default function Login() {
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [err, setErr] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      
      <motion.div
        className="container max-w-6xl flex flex-col md:flex-row bg-white rounded-3xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
       
        <div className="flex-1 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">Login</h2>

          {err && <div className="text-red-500 text-center mb-4">{err}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

       
        <motion.div 
          className="flex-1 hidden md:block"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={loginImage}
            alt="Login"
            className="w-full h-full object-cover rounded-r-3xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

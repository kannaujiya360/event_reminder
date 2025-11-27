import React, { useState, useRef, useMemo, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import sampleImage from '../assets/event.jpg';


function FloatingSphere({ position, colors, distort, speed }) {
  const ref = useRef();
  const color = useMemo(() => new THREE.Color(colors[0]), [colors]);
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * speed;
    ref.current.rotation.y = clock.getElapsedTime() * speed * 0.7;
    const t = (Math.sin(clock.getElapsedTime()) + 1) / 2;
    ref.current.material.color.lerpColors(new THREE.Color(colors[0]), new THREE.Color(colors[1]), t);
  });
  return (
    <Sphere ref={ref} args={[1.2, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={0.3}
        metalness={0.5}
        emissive={color}
        emissiveIntensity={0.7}
      />
    </Sphere>
  );
}


function ParticleField({ count = 1200 }) {
  const pointsRef = useRef();
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          Math.random() * 12,
          (Math.random() - 0.5) * 20
        )
      );
    }
    return temp;
  }, [count]);

  useFrame(({ clock }) => {
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
  });

  return (
    <Points ref={pointsRef} limit={count}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]))}
          count={particles.length}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial size={0.05} color="#ffffff" transparent sizeAttenuation />
    </Points>
  );
}

// ---------------- 3D Signup Scene ----------------
function Signup3DScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 55 }} dpr={window.devicePixelRatio}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Suspense fallback={null}>
        <FloatingSphere position={[-2, 1, -2]} colors={['#ff4d6d', '#ff9ad6']} distort={0.4} speed={2} />
        <FloatingSphere position={[2, -1, -1]} colors={['#4dffea', '#4d9aff']} distort={0.3} speed={1.5} />
        <FloatingSphere position={[0, 2, -3]} colors={['#ffd34d', '#ffae4d']} distort={0.35} speed={1.8} />
        <FloatingSphere position={[3, 1, -2]} colors={['#8c4dff', '#b54dff']} distort={0.25} speed={1.2} />
        <ParticleField count={1200} />

        <mesh position={[0, -1, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial map={new THREE.TextureLoader().load(sampleImage)} />
        </mesh>
      </Suspense>
    </Canvas>
  );
}


export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
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
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-black">

      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-700 animate-gradient-fast opacity-60 -z-20"></div>
      <div className="absolute inset-0 bg-black/70 -z-10"></div>

      <motion.div className="container max-w-6xl flex flex-col md:flex-row items-center gap-12 p-6 md:p-12 rounded-3xl bg-white/5 backdrop-blur-xl shadow-[0_30px_90px_rgba(255,255,255,0.25)]">
        
 
        <motion.div className="flex-1 w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-3xl shadow-[0_25px_60px_rgba(255,255,255,0.2)] border border-white/20">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-400 text-center mb-6 drop-shadow-xl animate-pulse">
            Create Account
          </h2>

          {err && <div className="text-red-400 mb-4 text-center font-semibold">{err}</div>}

          <form onSubmit={handle} className="space-y-5">
            <input
              required
              autoComplete="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              className="w-full p-4 rounded-2xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            />
            <input
              required
              autoComplete="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full p-4 rounded-2xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            />
            <input
              required
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className="w-full p-4 rounded-2xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-3xl shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[0_0_35px_rgba(0,0,0,0.5)] transition-all"
              >
                Sign Up
              </button>
              <Link to="/login" className="text-white/80 hover:text-white text-sm mt-2 sm:mt-0">
                Already have an account?
              </Link>
            </div>
          </form>
        </motion.div>


        <motion.div className="flex-1 w-full md:w-[480px] h-[480px] md:h-[520px] rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(255,255,255,0.25)] border border-white/20">
          <Signup3DScene />
        </motion.div>
      </motion.div>
    </div>
  );
}


import React, { useRef, useEffect, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { getEvents } from "../api/events";
import EventCard from "../components/EventCardDisplay";


const fadeIn = { opacity: 0, y: 14 };
const fadeInTo = { opacity: 1, y: 0 };


function ClockNeon() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div
      animate={{ scale: [1, 1.025, 1], opacity: [0.92, 1, 0.92] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="font-mono text-2xl md:text-3xl text-white"
      style={{ textShadow: "0 0 6px #00eaff, 0 0 12px #7C3AED, 0 0 20px #ff007a" }}
    >
      {time.toLocaleTimeString()}
    </motion.div>
  );
}


function WeatherNeon() {
  const [weather, setWeather] = useState(null);
  const API_KEY = "bcbdce1de7ddfb288a93a75fa42824f6";

  useEffect(() => {
    let mounted = true;
    const fetchBy = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const json = await res.json();
        if (!mounted) return;
        setWeather({
          city: json.name,
          temp: Math.round(json.main.temp),
          icon: `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`,
        });
      } catch {}
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => fetchBy(p.coords.latitude, p.coords.longitude),
        () => fetchBy(28.6139, 77.2090)
      );
    } else fetchBy(28.6139, 77.2090);

    return () => (mounted = false);
  }, []);

  if (!weather) return <div className="text-gray-400">Loading weather…</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-3 px-3 py-2 rounded-2xl"
      style={{
        backdropFilter: "blur(8px)",
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 20px rgba(0,234,255,0.2)",
      }}
    >
      <img src={weather.icon} alt="w" className="w-10 h-10" />
      <div className="flex flex-col">
        <span className="text-white font-semibold">{weather.temp}°C</span>
        <span className="text-gray-300 text-sm">{weather.city}</span>
      </div>
    </motion.div>
  );
}


function HologramOrb({ position = [0, 0, -4] }) {
  const group = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const scan = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.25;
      group.current.position.y = Math.sin(t * 0.6) * 0.12;
    }
    if (ring1.current) ring1.current.rotation.z = t * 0.6;
    if (ring2.current) ring2.current.rotation.z = -t * 0.4;
    if (scan.current) {
      scan.current.position.y = Math.sin(t * 1.8) * 0.8;
      scan.current.material.opacity = 0.18 + (Math.sin(t * 1.8) + 1) * 0.06;
    }
  });

  return (
    <group ref={group} position={position}>
      <Sphere args={[1.05, 128, 128]}>
        <MeshDistortMaterial
          color="#00eaff"
          distort={0.45}
          speed={1.6}
          roughness={0.12}
          metalness={0.3}
          emissive="#00eaff"
          emissiveIntensity={0.6}
        />
      </Sphere>

      <mesh>
        <sphereGeometry args={[1.18, 64, 64]} />
        <meshStandardMaterial
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0.2}
          emissive="#7cc1ff"
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh ref={ring1} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 8, 200]} />
        <meshStandardMaterial emissive="#ff007a" emissiveIntensity={0.9} color="#ff007a" />
      </mesh>

      <mesh ref={ring2} rotation={[Math.PI / 3.2, 0.2, 0]}>
        <torusGeometry args={[1.85, 0.018, 8, 200]} />
        <meshStandardMaterial emissive="#7c3aed" emissiveIntensity={0.75} color="#7c3aed" />
      </mesh>

      <mesh ref={scan}>
        <planeGeometry args={[3.4, 0.08, 1, 1]} />
        <meshBasicMaterial transparent opacity={0.16} color="#00eaff" />
      </mesh>
    </group>
  );
}


function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 55 }}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 6, 6]} intensity={0.8} />
      <Suspense fallback={null}>
        <HologramOrb />
      </Suspense>
      <Stars radius={130} depth={40} count={2000} factor={4} fade />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}


export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getEvents();
        if (!mounted) return;
        setEvents(res?.data ?? res?.events ?? res ?? []);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const upcomingEvents = Array.isArray(events) ? events.filter((e) => e.status === "upcoming") : [];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black/95">
      <div className="absolute inset-0 -z-20">
        <HeroCanvas />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
     
        <motion.section
          initial={fadeIn}
          animate={fadeInTo}
          transition={{ duration: 0.9 }}
          className="w-full max-w-6xl mx-auto rounded-3xl relative overflow-visible"
        >
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, rgba(15,15,25,0.9), rgba(30,30,45,0.85))",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,234,255,0.15)",
            }}
          >
           
            <div className="flex flex-col justify-center items-start gap-6">
              <h1
                className="text-4xl md:text-6xl font-extrabold leading-tight"
                style={{
                  background: "none",
                  color: "white",
                  textShadow: "0 0 2px #00eaff, 0 0 6px #7C3AED, 0 0 10px #ff007a",
                }}
              >
                Remember every moment.
                <span className="block">Effortlessly.</span>
              </h1>

              <p className="text-gray-300 max-w-xl">
                Smart reminders, contextual alerts, and a futuristic visual layer — designed to keep your focus and memory sharp.
              </p>

              <div className="flex items-center gap-4">
                <div className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <ClockNeon />
                </div>
                <WeatherNeon />
              </div>

              <div className="flex gap-4 mt-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/signup"
                    className="px-6 py-3 rounded-full font-semibold text-white"
                    style={{
                      background: "linear-gradient(90deg,#00eaff,#ff007a,#7C3AED)",
                      boxShadow: "0 10px 40px rgba(0,234,255,0.3)",
                    }}
                  >
                    Get Started
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }}>
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-full font-medium text-gray-300"
                    style={{
                      background: "linear-gradient(90deg,#1f1f2f,#2b2b42)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      backdropFilter: "blur(6px)",
                      boxShadow: "0 6px 20px rgba(0,234,255,0.1)",
                    }}
                  >
                    Login
                  </Link>
                </motion.div>
              </div>
            </div>

           
            <div className="flex items-center justify-center">
              <div
                className="w-full max-w-md h-80 md:h-96 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, rgba(15,15,25,0.7), rgba(30,30,45,0.8))",
                  border: "1px solid rgba(124,58,237,0.2)",
                  boxShadow: "0 30px 90px rgba(124,58,237,0.1)",
                }}
              >
                <div className="text-center px-4">
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      margin: "0 auto",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 30% 20%, rgba(0,234,255,0.2), rgba(124,58,237,0.2))",
                      boxShadow: "0 12px 50px rgba(124,58,237,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#00eaff" }} />
                  </div>

                  <div className="text-white font-semibold text-xl mt-4">Time is precious don’t miss this</div>
                  <div className="text-gray-400 text-sm mt-2">Something good for a time reminder.</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

       
        <motion.section
          className="w-full max-w-6xl mt-12 rounded-3xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "rgba(15,15,25,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-3xl font-bold"
              style={{
                backgroundImage: "linear-gradient(90deg,#00eaff,#ff007a,#7C3AED)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Upcoming Events
            </h3>

            <div className="text-sm text-gray-400">Tap to open an event</div>
          </div>

          <AnimatePresence>
            {loading ? (
              <div className="py-12 text-gray-400 text-lg">Loading events…</div>
            ) : upcomingEvents.length ? (
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((ev, i) => (
                  <motion.div
                    key={ev._id ?? i}
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  >
                    <div
                      className="rounded-2xl overflow-hidden relative"
                      style={{
                        background: "rgba(15,15,25,0.7)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 10,
                          bottom: 10,
                          width: 6,
                          background: "linear-gradient(180deg,#00eaff,#7C3AED)",
                          borderRadius: 10,
                        }}
                      />
                      <div style={{ padding: 14, marginLeft: 18 }}>
                        <EventCard ev={ev} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-12 text-gray-400 text-xl text-center">No upcoming events.</div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
}

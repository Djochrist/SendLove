import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export function HeartParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate static set of particles on mount to avoid re-renders
    const colors = ["#ef4444", "#f43f5e", "#fb7185", "#fda4af"];
    const count = 20; // Number of floating hearts
    
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      size: Math.random() * 20 + 10, // px
      duration: Math.random() * 10 + 10, // seconds
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "110vh", x: `${p.x}vw`, opacity: 0, scale: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0.5],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={p.color}
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

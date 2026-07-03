"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  type: "sparkle" | "star" | "dot";
  color: string;
}

const COLORS = ["#8b5cf6", "#a78bfa", "#f59e0b", "#6366f1", "#fbbf24"];

export default function HeartBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate initial particles
    const initialParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 14 + 6, // smaller size for sparkles (6px to 20px)
      duration: Math.random() * 18 + 12, // slightly slower
      delay: Math.random() * -25,
      type: (["sparkle", "star", "dot"][Math.floor(Math.random() * 3)]) as any,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setParticles(initialParticles);

    // Periodically spawn new particles
    const interval = setInterval(() => {
      setParticles((prev) => {
        const active = prev.filter((p) => p.id > Date.now() - 35000);
        return [
          ...active,
          {
            id: Date.now(),
            x: Math.random() * 100,
            size: Math.random() * 14 + 6,
            duration: Math.random() * 18 + 15,
            delay: 0,
            type: (["sparkle", "star", "dot"][Math.floor(Math.random() * 3)]) as any,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          },
        ];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercentage = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Spawn 3 quick sparkles on click
    const newSpawns = Array.from({ length: 3 }).map((_, idx) => ({
      id: Date.now() + Math.random() + idx,
      x: xPercentage + (Math.random() * 6 - 3),
      size: Math.random() * 12 + 8,
      duration: Math.random() * 8 + 6,
      delay: 0,
      type: "sparkle" as const,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    setParticles((prev) => [...prev, ...newSpawns]);
  };

  const renderParticlePath = (type: "sparkle" | "star" | "dot") => {
    if (type === "sparkle") {
      // 4-pointed star
      return <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />;
    } else if (type === "star") {
      // 5-pointed star
      return <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />;
    } else {
      // Circle dot
      return <circle cx="12" cy="12" r="8" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{ pointerEvents: "auto" }}
      onClick={handleScreenClick}
    >
      {/* Soft dark-indigo to warm-cream background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#f3f0fc] via-[#fbfaf8] to-[#edf0fe] -z-10" />

      {/* Floating particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.svg
            key={particle.id}
            initial={{ y: "110vh", x: `${particle.x}vw`, opacity: 0, scale: 0.4, rotate: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.7, 0.7, 0],
              scale: [0.4, 1.1, 1.1, 0.7],
              rotate: [0, 90, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              color: particle.color,
              fill: "currentColor",
              opacity: 0.45,
            }}
            viewBox="0 0 24 24"
            className="drop-shadow-sm filter blur-[0.3px]"
          >
            {renderParticlePath(particle.type)}
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  );
}

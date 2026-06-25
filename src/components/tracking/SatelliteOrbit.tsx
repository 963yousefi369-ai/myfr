'use client';

import { motion } from 'framer-motion';

interface SatelliteOrbitProps {
  size?: number;
  duration?: number;
}

export default function SatelliteOrbit({ size = 40, duration = 8 }: SatelliteOrbitProps) {
  const orbitRadius = size * 0.8;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: orbitRadius * 2 + size, height: orbitRadius * 2 + size }}
    >
      <div
        className="absolute rounded-full border border-dashed border-slate-300"
        style={{ width: orbitRadius * 2, height: orbitRadius * 2 }}
      />
      <motion.div
        className="absolute"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            position: 'absolute',
            top: -size * 0.3,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <svg
            width={size * 0.5}
            height={size * 0.5}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a5f"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 7L9 3L5 7l4 4" />
            <path d="M17 11l4 4-4 4-4-4" />
            <path d="M8 12l4 4" />
            <path d="M16 8l-4-4" />
            <circle cx="12" cy="12" r="1" fill="#1e3a5f" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

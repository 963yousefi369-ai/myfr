'use client';

import { motion } from 'framer-motion';

interface RadarPingProps {
  size?: number;
  color?: string;
}

export default function RadarPing({ size = 80, color = '#10b981' }: RadarPingProps) {
  const rings = [0, 1, 2];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {rings.map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: color, width: '100%', height: '100%' }}
          animate={{ scale: [0.2, 1], opacity: [0.8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
      <span
        className="relative rounded-full"
        style={{ width: size * 0.12, height: size * 0.12, backgroundColor: color }}
      />
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';

interface PulsingDotProps {
  color?: 'green' | 'blue' | 'red';
  size?: number;
}

const colorMap = {
  green: '#10b981',
  blue: '#1e3a5f',
  red: '#ef4444',
};

export default function PulsingDot({ color = 'green', size = 8 }: PulsingDotProps) {
  const hex = colorMap[color];

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size * 3, height: size * 3 }}
    >
      <motion.span
        className="absolute rounded-full"
        style={{ width: size * 2, height: size * 2, backgroundColor: hex, opacity: 0.4 }}
        animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
      />
      <span
        className="relative rounded-full"
        style={{ width: size, height: size, backgroundColor: hex }}
      />
    </span>
  );
}

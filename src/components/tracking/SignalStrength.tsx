'use client';

import { motion } from 'framer-motion';

interface SignalStrengthProps {
  bars?: 1 | 2 | 3 | 4;
  activeColor?: string;
}

export default function SignalStrength({ bars = 4, activeColor = '#10b981' }: SignalStrengthProps) {
  const barHeights = [4, 8, 12, 16];
  const totalBars = 4;

  return (
    <div className="inline-flex items-end gap-0.5">
      {barHeights.map((h, i) => {
        const isActive = i < bars;
        return (
          <motion.div
            key={i}
            className="rounded-sm"
            style={{
              width: 4,
              backgroundColor: isActive ? activeColor : '#cbd5e1',
            }}
            initial={{ height: 2 }}
            animate={{ height: isActive ? h : 2 }}
            transition={{
              duration: 0.4,
              delay: i * 0.1,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

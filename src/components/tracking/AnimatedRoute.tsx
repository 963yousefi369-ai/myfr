'use client';

import { motion } from 'framer-motion';

interface AnimatedRouteProps {
  direction?: 'horizontal' | 'vertical';
  color?: string;
}

export default function AnimatedRoute({
  direction = 'horizontal',
  color = '#1e3a5f',
}: AnimatedRouteProps) {
  const isHorizontal = direction === 'horizontal';
  const width = isHorizontal ? 200 : 4;
  const height = isHorizontal ? 4 : 200;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.line
        x1={isHorizontal ? 0 : 2}
        y1={isHorizontal ? 2 : 0}
        x2={isHorizontal ? 200 : 2}
        y2={isHorizontal ? 2 : 200}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="8 6"
        animate={{ strokeDashoffset: [28, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

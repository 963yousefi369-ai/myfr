'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ScrollTrail() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const dotTop = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="fixed right-2 top-0 z-50 h-full w-[3px] pointer-events-none">
      <div className="absolute inset-0 rounded-full bg-gray-800/40" />

      <motion.div
        className="absolute top-0 left-0 w-full rounded-full origin-top"
        style={{
          scaleY: smoothProgress,
          background: 'linear-gradient(to bottom, #10b981, #1e3a5f, #f59e0b)',
          height: '100%',
        }}
      />

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
        style={{
          top: dotTop,
          background: '#1e3a5f',
          boxShadow:
            '0 0 6px 2px rgba(30, 58, 95, 0.7), 0 0 12px 4px rgba(16, 185, 129, 0.3)',
        }}
      />
    </div>
  );
}

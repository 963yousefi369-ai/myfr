'use client';

interface TrackingTickerProps {
  stats: { label: string; value: string }[];
  speed?: number;
}

export default function TrackingTicker({ stats, speed = 30 }: TrackingTickerProps) {
  const content = stats
    .map((s) => `${s.label}: ${s.value}`)
    .join('  \u2022  ');

  return (
    <div className="w-full overflow-hidden rounded-full bg-[#0f172a] px-4 py-2">
      <div
        className="flex whitespace-nowrap text-sm font-medium text-white"
        style={{
          animation: `ticker ${speed}s linear infinite`,
        }}
      >
        <span className="pr-12">{content}</span>
        <span className="pr-12">{content}</span>
        <span className="pr-12">{content}</span>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

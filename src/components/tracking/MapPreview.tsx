'use client';

import { MapPin } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface MapPreviewProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function MapPreview({ width = 200, height = 120, className }: MapPreviewProps) {
  return (
    <div
      className={twMerge(
        'relative overflow-hidden rounded-lg border border-slate-200 bg-[#f1f5f9]',
        className,
      )}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <MapPin size={24} className="text-[#ef4444] drop-shadow-md" fill="#ef4444" fillOpacity={0.2} />
          <div
            className="mt-0.5 rounded-sm bg-[#ef4444]/10"
            style={{ width: 8, height: 4, borderRadius: '50%' }}
          />
        </div>
      </div>
    </div>
  );
}

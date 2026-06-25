'use client';

import { MapPin } from 'lucide-react';
import PulsingDot from './PulsingDot';

interface LocationBadgeProps {
  city?: string;
}

export default function LocationBadge({ city = 'تهران' }: LocationBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#f1f5f9] px-3 py-1.5 text-sm font-medium text-[#0f172a]">
      <PulsingDot color="green" size={6} />
      <MapPin size={14} className="text-[#1e3a5f]" />
      <span>{city}</span>
    </span>
  );
}

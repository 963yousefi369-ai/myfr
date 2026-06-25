'use client';

import { useUserTrailStore } from '@/lib/store/user-trail';

interface TrailDotProps {
  showLabel?: boolean;
}

export default function TrailDot({ showLabel = true }: TrailDotProps) {
  const getCurrentPage = useUserTrailStore((s) => s.getCurrentPage);
  const current = getCurrentPage();

  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#10b981]" />
      </span>
      {showLabel && current && (
        <span className="text-sm text-gray-300 font-medium">
          {current.label}
        </span>
      )}
    </span>
  );
}

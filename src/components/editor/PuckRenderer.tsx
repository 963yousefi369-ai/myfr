'use client'

import React from 'react'

interface PuckRendererProps {
  data: unknown
}

export default function PuckRenderer({ data }: PuckRendererProps) {
  if (!data) return null

  return (
    <div className="puck-renderer">
      {/* Puck page renderer placeholder */}
      <div suppressHydrationWarning />
    </div>
  )
}

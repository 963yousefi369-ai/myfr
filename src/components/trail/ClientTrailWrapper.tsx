'use client'
import { ReactNode } from 'react'
import UserTrail from '@/components/trail/UserTrail'
import ScrollTrail from '@/components/trail/ScrollTrail'
import TrailPath from '@/components/trail/TrailPath'

export default function ClientTrailWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <UserTrail />
      <TrailPath />
      <ScrollTrail />
      {children}
    </>
  )
}

'use client'
import { createContext, useContext } from 'react'

interface ShopStatus {
  shopEnabled: boolean
  supportPhone: string
}

const ShopStatusContext = createContext<ShopStatus>({ shopEnabled: true, supportPhone: '' })

export function ShopStatusProvider({ shopEnabled, supportPhone, children }: ShopStatus & { children: React.ReactNode }) {
  return (
    <ShopStatusContext.Provider value={{ shopEnabled, supportPhone }}>
      {children}
    </ShopStatusContext.Provider>
  )
}

export function useShopStatus() {
  return useContext(ShopStatusContext)
}

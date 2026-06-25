'use client'
import { create } from 'zustand'

interface LoginModalStore {
  open: boolean
  message?: string
  returnUrl?: string
  onLoginSuccess?: () => void
  openLogin: (opts?: { message?: string; returnUrl?: string; onLoginSuccess?: () => void }) => void
  closeLogin: () => void
}

export const useLoginModal = create<LoginModalStore>((set) => ({
  open: false,
  message: undefined,
  returnUrl: undefined,
  onLoginSuccess: undefined,
  openLogin: (opts) => set({
    open: true,
    message: opts?.message,
    returnUrl: opts?.returnUrl,
    onLoginSuccess: opts?.onLoginSuccess,
  }),
  closeLogin: () => set({ open: false, message: undefined, onLoginSuccess: undefined }),
}))

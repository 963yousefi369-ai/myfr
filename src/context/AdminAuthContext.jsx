'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext(null)

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@atifarzam.ir'
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin1234'
const STORAGE_KEY = 'admin_auth'

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setAdmin(JSON.parse(stored))
      }
    } catch {}
    setLoading(false)
  }, [])

  async function adminLogin(email, password) {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user = { email }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      setAdmin(user)
      return { success: true }
    }
    return { success: false, error: 'ایمیل یا رمز عبور اشتباه است' }
  }

  function adminLogout() {
    localStorage.removeItem(STORAGE_KEY)
    setAdmin(null)
  }

  const isAdminLoggedIn = !!admin

  return (
    <AdminAuthContext.Provider value={{ admin, loading, isAdminLoggedIn, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth باید داخل AdminAuthProvider استفاده شود')
  return ctx
}

export default AdminAuthContext

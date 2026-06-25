import React, { createContext, useContext, useState, useEffect } from 'react'
import { pb } from '../api/pocketbase.js'

const AdminAuthContext = createContext(null)
const ADMIN_KEY = 'pb_admin_auth'

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // بازیابی session از pb.authStore
    if (pb.authStore.isValid && pb.authStore.model) {
      setAdmin(pb.authStore.model)
    }
    setLoading(false)

    // گوش دادن به تغییرات authStore
    const unsub = pb.authStore.onChange((token, model) => {
      setAdmin(model && pb.authStore.isValid ? model : null)
    })
    return () => unsub()
  }, [])

  async function adminLogin(email, password) {
    try {
      // PocketBase v0.22+ از _superusers استفاده می‌کند
      let authData
      try {
        authData = await pb.collection('_superusers').authWithPassword(email, password)
      } catch {
        // fallback برای نسخه‌های قدیمی‌تر
        authData = await pb.admins.authWithPassword(email, password)
      }
      setAdmin(authData.record || authData.admin)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'خطا در ورود' }
    }
  }

  function adminLogout() {
    pb.authStore.clear()
    setAdmin(null)
  }

  const isAdminLoggedIn = !!admin && pb.authStore.isValid

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

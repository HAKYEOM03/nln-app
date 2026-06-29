import { createContext, useContext, useState, useEffect } from 'react'
import { initDB, loginUser as dbLogin, getUser } from '../utils/db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await initDB()
      const saved = localStorage.getItem('makepro_session')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const fresh = await getUser(parsed.username)
          if (fresh) setUser(fresh)
        } catch {}
      }
      setLoading(false)
    }
    init()
  }, [])

  const login = async (username, password) => {
    const u = await dbLogin(username, password)
    setUser(u)
    localStorage.setItem('makepro_session', JSON.stringify(u))
    return u
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('makepro_session')
  }

  const refreshUser = async () => {
    if (user) {
      const fresh = await getUser(user.username)
      if (fresh) {
        setUser(fresh)
        localStorage.setItem('makepro_session', JSON.stringify(fresh))
      }
    }
  }

  const isAdmin = user?.role === 'admin'
  const isSubAdmin = user?.role === 'subadmin'
  const hasPermission = (perm) => {
    if (isAdmin) return true
    if (isSubAdmin) return user.permissions?.includes(perm) || user.permissions?.includes('all')
    return false
  }

  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, isAdmin, isSubAdmin, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

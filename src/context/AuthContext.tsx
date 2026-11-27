/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import {
  authApi,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  setUnauthorizedHandler,
  type SafeUser,
  type RegisterPayload,
  type LoginPayload,
} from '../services/api'

export interface AuthContextType {
  user: SafeUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginPayload) => Promise<{ user: SafeUser; token: string }>
  register: (data: RegisterPayload) => Promise<{ user: SafeUser; message: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<SafeUser | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // If there is no token stored, initial loading is immediately false
    return !!getStoredToken()
  })

  useEffect(() => {
    let isMounted = true

    // Register 401 callback to clean up state immediately when an authorized request is rejected
    setUnauthorizedHandler(() => {
      if (isMounted) {
        setUser(null)
        setToken(null)
      }
    })

    const runRestore = async () => {
      const existingToken = getStoredToken()
      if (!existingToken) {
        if (isMounted) {
          setIsLoading(false)
        }
        return
      }

      try {
        const res = await authApi.getMe()
        if (isMounted && res?.user) {
          setUser(res.user)
          setToken(existingToken)
        }
      } catch {
        removeStoredToken()
        if (isMounted) {
          setUser(null)
          setToken(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (token) {
      runRestore()
    }

    // Synchronize authentication status across multiple browser tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tgp_auth_token') {
        const updatedToken = getStoredToken()
        if (!updatedToken) {
          setUser(null)
          setToken(null)
          setIsLoading(false)
        } else {
          runRestore()
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      isMounted = false
      setUnauthorizedHandler(null)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [token])

  /**
   * Log in user, store token with rememberMe configuration, and hydrate auth state
   */
  const login = async (
    credentials: LoginPayload
  ): Promise<{ user: SafeUser; token: string }> => {
    const res = await authApi.login(credentials)
    const remember = credentials.rememberMe !== false

    setStoredToken(res.token, remember)
    setToken(res.token)
    setUser(res.user)

    return { user: res.user, token: res.token }
  }

  /**
   * Register a new customer account
   */
  const register = async (
    data: RegisterPayload
  ): Promise<{ user: SafeUser; message: string }> => {
    const res = await authApi.register(data)
    return { user: res.user, message: res.message }
  }

  /**
   * Log out user: revoke token on backend and wipe local session
   */
  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await authApi.logout()
      }
    } catch {
      // Even if network or token validation fails on server, proceed to clear client auth state
    } finally {
      removeStoredToken()
      setUser(null)
      setToken(null)
    }
  }

  /**
   * Refresh current user profile from GET /api/auth/me
   */
  const refreshUser = async (): Promise<SafeUser | null> => {
    try {
      const res = await authApi.getMe()
      if (res?.user) {
        setUser(res.user)
        return res.user
      }
      return null
    } catch {
      return null
    }
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

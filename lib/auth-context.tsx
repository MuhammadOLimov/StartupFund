"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: "investor" | "entrepreneur") => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: "investor" | "entrepreneur"
  projectName?: string
  investmentInterests?: string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, _password: string, role: "investor" | "entrepreneur") => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: "1",
      email,
      name: email.split("@")[0],
      role,
      avatar: "/diverse-user-avatars.png",
    })
    setIsLoading(false)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: "1",
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: "/diverse-user-avatars.png",
    })
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

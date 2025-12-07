"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'patient' | 'doctor'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  bloodType?: string
  patientId?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database
const mockUsers = {
  patient: {
    email: 'patient@flarehealth.com',
    password: 'patient123',
    user: {
      id: 'patient-001',
      email: 'patient@flarehealth.com',
      name: 'John Anderson',
      role: 'patient' as UserRole,
      bloodType: 'A+',
      patientId: 'FLR-2024-9834'
    }
  },
  doctor: {
    email: 'doctor@flarehealth.com',
    password: 'doctor123',
    user: {
      id: 'doctor-001',
      email: 'doctor@flarehealth.com',
      name: 'Dr. Sarah Mitchell',
      role: 'doctor' as UserRole
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('flarehealth_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockUser = mockUsers[role]
    
    if (email === mockUser.email && password === mockUser.password) {
      setUser(mockUser.user)
      localStorage.setItem('flarehealth_user', JSON.stringify(mockUser.user))
      return true
    }
    
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('flarehealth_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'ta' | 'hi'

interface SettingsContextType {
  language: Language
  setLanguage: (lang: Language) => void
  voiceInputEnabled: boolean
  setVoiceInputEnabled: (enabled: boolean) => void
  voiceOutputEnabled: boolean
  setVoiceOutputEnabled: (enabled: boolean) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false)
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false)
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Load settings from localStorage
    const storedLang = localStorage.getItem('flarehealth_language') as Language
    const storedVoiceInput = localStorage.getItem('flarehealth_voice_input') === 'true'
    const storedVoiceOutput = localStorage.getItem('flarehealth_voice_output') === 'true'
    const storedTheme = localStorage.getItem('flarehealth_theme') as 'light' | 'dark'

    if (storedLang) setLanguageState(storedLang)
    if (storedVoiceInput !== null) setVoiceInputEnabled(storedVoiceInput)
    if (storedVoiceOutput !== null) setVoiceOutputEnabled(storedVoiceOutput)
    if (storedTheme) {
      setThemeState(storedTheme)
      document.documentElement.classList.toggle('dark', storedTheme === 'dark')
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('flarehealth_language', lang)
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme)
    localStorage.setItem('flarehealth_theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        voiceInputEnabled,
        setVoiceInputEnabled: (enabled) => {
          setVoiceInputEnabled(enabled)
          localStorage.setItem('flarehealth_voice_input', String(enabled))
        },
        voiceOutputEnabled,
        setVoiceOutputEnabled: (enabled) => {
          setVoiceOutputEnabled(enabled)
          localStorage.setItem('flarehealth_voice_output', String(enabled))
        },
        theme,
        setTheme
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

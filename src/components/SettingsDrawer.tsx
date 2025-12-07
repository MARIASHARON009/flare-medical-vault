"use client"

import { useSettings } from '@/contexts/SettingsContext'
import { useTranslation } from '@/lib/i18n'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Globe, Mic, Volume2, Sun, Moon } from 'lucide-react'

interface SettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const {
    language,
    setLanguage,
    voiceInputEnabled,
    setVoiceInputEnabled,
    voiceOutputEnabled,
    setVoiceOutputEnabled,
    theme,
    setTheme
  } = useSettings()

  const { t } = useTranslation(language)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="glass-card w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-2xl neon-text">{t('settings')}</SheetTitle>
          <SheetDescription>
            Customize your FlareHealth experience
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">{t('language')}</Label>
            </div>
            <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="ta">🇮🇳 தமிழ் (Tamil)</SelectItem>
                <SelectItem value="hi">🇮🇳 हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select your preferred language for the interface
            </p>
          </div>

          <Separator />

          {/* Voice Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  <Label className="text-base font-semibold">{t('voiceInput')}</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Speak to interact with AI assistant
                </p>
              </div>
              <Switch
                checked={voiceInputEnabled}
                onCheckedChange={setVoiceInputEnabled}
              />
            </div>
          </div>

          <Separator />

          {/* Voice Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <Label className="text-base font-semibold">{t('voiceOutput')}</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Hear AI responses spoken aloud
                </p>
              </div>
              <Switch
                checked={voiceOutputEnabled}
                onCheckedChange={setVoiceOutputEnabled}
              />
            </div>
          </div>

          <Separator />

          {/* Theme Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-primary" />
                  )}
                  <Label className="text-base font-semibold">{t('theme')}</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {theme === 'dark' ? t('darkMode') : t('lightMode')}
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>

          {/* Feature Status */}
          <div className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Voice features require browser support for Web Speech API. 
              Make sure to grant microphone permissions when prompted.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

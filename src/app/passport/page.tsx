"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Shield, QrCode, Scan, User, Droplet, Award, Camera, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import QRCode from "react-qr-code"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/i18n"
import { useRouter, useSearchParams } from "next/navigation"
import { AIAssistant } from "@/components/AIAssistant"

export default function PassportPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { language } = useSettings()
  const { t } = useTranslation(language)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [permissions, setPermissions] = useState({
    allergies: false,
    medHistory: false,
    insurance: false,
  })
  const [showQR, setShowQR] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [scannerMode, setScannerMode] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showAI, setShowAI] = useState(false)

  // Mock health data for AI assistant
  const mockHealthData = {
    stressLevel: 8,
    bloodPressure: "145/95",
    glucose: 185,
    heartRate: 88,
    sleepHours: 4.5
  }

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please login to access Health Passport')
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Check if doctor mode is requested
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'doctor') {
      if (user?.role === 'doctor') {
        setScannerMode(true)
      } else {
        toast.error('Doctor login required', {
          description: 'Please sign in as a doctor to access scanner mode'
        })
      }
    }
  }, [searchParams, user])

  // Countdown timer
  useEffect(() => {
    if (showQR && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      setShowQR(false)
      setTimeLeft(300)
      toast.error(t('oneTimeAccessToken') + " expired", {
        description: "Please generate a new one"
      })
    }
  }, [showQR, timeLeft, t])

  // Scanner simulation
  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false)
        setScannerMode(false)
        toast.success("✅ Patient Data Decrypted. Access Granted.", {
          description: "Medical records verified on Flare Network"
        })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [scanning])

  const handleGenerateQR = () => {
    const selectedPerms = Object.entries(permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key)
    
    if (selectedPerms.length === 0) {
      toast.error("Please select at least one permission to share")
      return
    }

    setShowQR(true)
    setTimeLeft(300)
    toast.success("Secure QR Code Generated", {
      description: "One-time access token created"
    })
  }

  const handleDoctorToggle = () => {
    if (!scannerMode) {
      // Trying to switch to scanner mode
      if (user?.role === 'doctor') {
        setScannerMode(true)
        setShowQR(false)
        setScanning(false)
      } else {
        toast.error("Doctor login required", {
          description: "Please sign in as a doctor to access scanner mode"
        })
      }
    } else {
      // Switch back to passport
      setScannerMode(false)
      setShowQR(false)
      setScanning(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const qrData = JSON.stringify({
    patient: user?.id || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    patientName: user?.name || "Patient",
    dataAccess: Object.entries(permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key),
    expiry: Date.now() + timeLeft * 1000,
    timestamp: Date.now()
  })

  const progressPercentage = (timeLeft / 300) * 100

  // Show loading while checking auth
  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        {/* Main Passport Content (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold neon-text">{t('globalHealthPassport')}</h1>
            <p className="text-muted-foreground">{t('verifiedMedicalIdentity')}</p>
          </div>

          {!scannerMode ? (
            <>
              {/* Holographic ID Card */}
              <div className="flex justify-center">
                <motion.div
                  className="relative w-full max-w-md"
                  whileHover={{ 
                    rotateY: 5, 
                    rotateX: -5,
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ 
                    perspective: "1000px",
                    transformStyle: "preserve-3d"
                  }}
                >
                  <Card className="glass-card gradient-border overflow-hidden">
                    <CardContent className="p-8 space-y-6">
                      {/* Badge */}
                      <div className="flex justify-end">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 border-0">
                          <Award className="h-3 w-3 mr-1" />
                          {user.role === 'patient' ? 'Verified Patient' : 'Verified Doctor'}
                        </Badge>
                      </div>

                      {/* Avatar & Name */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
                            <User className="h-10 w-10 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
                            <Shield className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{user.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {user.patientId ? `Patient ID: ${user.patientId}` : 'Medical Professional'}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4">
                        {user.bloodType && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Blood Type</p>
                            <div className="flex items-center gap-2">
                              <Droplet className="h-4 w-4 text-red-500" />
                              <p className="text-lg font-bold">{user.bloodType}</p>
                            </div>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Network</p>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            <p className="text-lg font-bold">Flare</p>
                          </div>
                        </div>
                      </div>

                      {/* Holographic shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* QR Code Generator Section */}
              {!showQR ? (
                <Card className="glass-card max-w-lg mx-auto">
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <QrCode className="h-5 w-5 text-primary" />
                        {t('generateAccessQR')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Select what information to share with healthcare providers
                      </p>
                    </div>

                    {/* Permissions */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="allergies" 
                          checked={permissions.allergies}
                          onCheckedChange={(checked) => 
                            setPermissions(prev => ({ ...prev, allergies: checked as boolean }))
                          }
                        />
                        <Label htmlFor="allergies" className="cursor-pointer">
                          {t('shareAllergies')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="medHistory" 
                          checked={permissions.medHistory}
                          onCheckedChange={(checked) => 
                            setPermissions(prev => ({ ...prev, medHistory: checked as boolean }))
                          }
                        />
                        <Label htmlFor="medHistory" className="cursor-pointer">
                          {t('shareMedHistory')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="insurance" 
                          checked={permissions.insurance}
                          onCheckedChange={(checked) => 
                            setPermissions(prev => ({ ...prev, insurance: checked as boolean }))
                          }
                        />
                        <Label htmlFor="insurance" className="cursor-pointer">
                          {t('shareInsurance')}
                        </Label>
                      </div>
                    </div>

                    <Button 
                      onClick={handleGenerateQR}
                      className="w-full neon-glow"
                      size="lg"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {t('generateSecureQR')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* QR Code Display */
                <Card className="glass-card max-w-lg mx-auto">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold text-green-500">
                        {t('oneTimeAccessToken')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('readyForDoctorScan')}
                      </p>
                    </div>

                    {/* QR Code with Circular Progress */}
                    <div className="flex justify-center">
                      <div className="relative">
                        {/* Circular progress background */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 260 260">
                          <circle
                            cx="130"
                            cy="130"
                            r="125"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-muted/20"
                          />
                          <circle
                            cx="130"
                            cy="130"
                            r="125"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={`${2 * Math.PI * 125}`}
                            strokeDashoffset={`${2 * Math.PI * 125 * (1 - progressPercentage / 100)}`}
                            className="text-primary transition-all duration-1000"
                            strokeLinecap="round"
                          />
                        </svg>
                        
                        {/* QR Code */}
                        <div className="p-5 bg-white rounded-xl m-[15px]">
                          <QRCode value={qrData} size={200} />
                        </div>
                      </div>
                    </div>

                    {/* Timer */}
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold font-mono text-primary">
                        {formatTime(timeLeft)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('expiresIn')} {Math.ceil(timeLeft / 60)} {t('minutes')}
                      </p>
                    </div>

                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowQR(false)
                        setTimeLeft(300)
                      }}
                      className="w-full"
                    >
                      {t('cancelGenerate')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            /* Scanner Mode */
            <Card className="glass-card max-w-lg mx-auto">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    {t('doctorScannerMode')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('positionQRCode')}
                  </p>
                </div>

                {/* Camera Viewfinder */}
                <div className="relative aspect-square bg-slate-950 rounded-lg overflow-hidden border-2 border-primary">
                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-primary" />
                  <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-primary" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-primary" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-primary" />

                  {/* Scanning laser animation */}
                  {scanning && (
                    <motion.div
                      className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                      animate={{ y: [0, 320, 0] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    />
                  )}

                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Scan className="h-16 w-16 text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        {scanning ? "Scanning..." : "Ready to scan"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setScanning(true)}
                  disabled={scanning}
                  className="w-full neon-glow"
                  size="lg"
                >
                  {scanning ? t('decryptingData') : t('startScanning')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Doctor Mode Toggle */}
          <div className="text-center">
            <Button
              variant="link"
              onClick={handleDoctorToggle}
              className="text-primary hover:text-primary/80"
            >
              {scannerMode ? `← ${t('backToPassport')}` : `${t('areYouDoctor')} →`}
            </Button>
          </div>
        </div>

        {/* AI Assistant Sidebar (Right 1/3) */}
        <div className="lg:col-span-1">
          {user.role === 'patient' && (
            <div className="sticky top-20">
              <AIAssistant 
                healthData={mockHealthData}
                autoOpen={mockHealthData.stressLevel >= 7}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
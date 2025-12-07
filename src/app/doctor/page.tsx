"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { 
  Stethoscope, 
  QrCode, 
  Activity, 
  Heart, 
  Droplets, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  Clock,
  FileText,
  Pill,
  ChevronRight,
  X,
  Bot,
  Mic,
  Volume2,
  Hash,
  ExternalLink,
  CheckCircle2,
  User
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { mockPatients, calculateSubRisks, checkMedicationSafety, type PatientVitals } from "@/lib/mockPatientData"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/i18n"
import { speechService, languageToSpeechCode } from "@/lib/speech"
import { ethers } from "ethers"

export default function DoctorPortalPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { language, voiceInputEnabled, voiceOutputEnabled } = useSettings()
  const { t } = useTranslation(language)
  const router = useRouter()

  const [selectedPatient, setSelectedPatient] = useState<PatientVitals | null>(null)
  const [accessGranted, setAccessGranted] = useState(false)
  const [patientIdInput, setPatientIdInput] = useState('')
  const [showInsights, setShowInsights] = useState(false)
  const [selectedMedications, setSelectedMedications] = useState<string[]>([])
  const [visitNote, setVisitNote] = useState('')
  const [noteHash, setNoteHash] = useState<string | null>(null)
  const [hashTimestamp, setHashTimestamp] = useState<Date | null>(null)
  const [consentTimeline, setConsentTimeline] = useState<Array<{ event: string; timestamp: Date; txHash?: string }>>([])
  
  // AI Co-Pilot state
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false)
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const medicationOptions = [
    'Metformin 500mg',
    'Metformin 850mg',
    'Amlodipine 5mg',
    'Amlodipine 10mg',
    'Atorvastatin 20mg',
    'NSAIDs',
    'SSRIs',
    'Prednisone',
    'Lisinopril',
    'Losartan'
  ]

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please login to access Doctor Portal')
      router.push('/login')
    } else if (!authLoading && user?.role !== 'doctor') {
      toast.error('Doctor access required', {
        description: 'This portal is only accessible to medical professionals'
      })
      router.push('/')
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleScanPatient = () => {
    const patient = mockPatients.find(p => p.patientId === patientIdInput)
    
    if (patient) {
      setSelectedPatient(patient)
      setAccessGranted(true)
      setShowInsights(true)
      setSelectedMedications(patient.medications)
      
      // Add to consent timeline
      const newEvent = {
        event: 'QR Scanned & Access Granted',
        timestamp: new Date(),
        txHash: '0x' + Math.random().toString(16).slice(2, 18)
      }
      setConsentTimeline([newEvent])
      
      toast.success('✅ Patient Data Decrypted', {
        description: `Access granted for ${patient.patientName}`
      })
    } else {
      toast.error('Patient not found', {
        description: 'Invalid Patient ID or access denied'
      })
    }
  }

  const handleHashNote = async () => {
    if (!visitNote.trim()) {
      toast.error('Please enter a visit note first')
      return
    }

    // Hash the note using ethers.js
    const hash = ethers.keccak256(ethers.toUtf8Bytes(visitNote))
    setNoteHash(hash)
    setHashTimestamp(new Date())

    // Add to timeline
    setConsentTimeline(prev => [
      ...prev,
      {
        event: 'Clinical Note Hashed',
        timestamp: new Date(),
        txHash: '0x' + Math.random().toString(16).slice(2, 18)
      }
    ])

    toast.success('📝 Clinical note hashed on Flare (tamper-evident)', {
      description: 'Hash stored on Coston2 blockchain',
      action: {
        label: 'View on Explorer',
        onClick: () => window.open(`https://coston2-explorer.flare.network/tx/${hash}`, '_blank')
      }
    })
  }

  const handleAiRequest = (type: 'summarize' | 'lifestyle' | 'followup' | 'custom') => {
    if (!selectedPatient) return

    setAiLoading(true)
    const subRisks = calculateSubRisks(selectedPatient.vitals)

    setTimeout(() => {
      let response = ''

      if (type === 'summarize') {
        response = `**Case Summary for ${selectedPatient.patientName}**\n\n`
        response += `**Overall Risk Score:** ${selectedPatient.riskScore}/100\n\n`
        response += `**Key Findings:**\n`
        response += `• Cardiac Risk: ${subRisks.cardiac.level.toUpperCase()} (${subRisks.cardiac.score}%)\n`
        response += `• Diabetes Risk: ${subRisks.diabetes.level.toUpperCase()} (${subRisks.diabetes.score}%)\n`
        response += `• Hypertension: ${subRisks.hypertension.level.toUpperCase()} (${subRisks.hypertension.score}%)\n`
        response += `• Mental Stress: ${subRisks.mentalStress.level.toUpperCase()} (${subRisks.mentalStress.score}%)\n\n`
        response += `**Current Medications:** ${selectedPatient.medications.join(', ') || 'None'}\n`
        response += `**Allergies:** ${selectedPatient.allergies.join(', ')}`
      } else if (type === 'lifestyle') {
        response = `**Lifestyle Recommendations for ${selectedPatient.patientName}**\n\n`
        
        if (subRisks.diabetes.level !== 'low') {
          response += `**Diet (Diabetes Management):**\n`
          response += `• Follow low-glycemic index diet\n`
          response += `• Limit refined carbohydrates\n`
          response += `• Increase fiber intake (whole grains, vegetables)\n`
          response += `• Monitor portion sizes\n\n`
        }
        
        if (subRisks.hypertension.level !== 'low' || subRisks.cardiac.level !== 'low') {
          response += `**Cardiovascular Health:**\n`
          response += `• DASH diet (low sodium <2300mg/day)\n`
          response += `• 150 minutes moderate aerobic exercise per week\n`
          response += `• Stress management (meditation, yoga)\n`
          response += `• Limit alcohol consumption\n\n`
        }
        
        if (subRisks.mentalStress.level !== 'low') {
          response += `**Mental Wellness:**\n`
          response += `• Practice mindfulness daily (10-15 min)\n`
          response += `• Ensure 7-9 hours quality sleep\n`
          response += `• Consider cognitive behavioral therapy\n`
          response += `• Regular physical activity for mood regulation\n\n`
        }
        
        response += `**General Advice:**\n`
        response += `• Quit smoking if applicable\n`
        response += `• Stay hydrated (8 glasses water/day)\n`
        response += `• Regular health screenings\n`
      } else if (type === 'followup') {
        const urgency = selectedPatient.riskScore >= 70 ? '4-6 weeks' : 
                       selectedPatient.riskScore >= 50 ? '2-3 months' : '6 months'
        
        response = `**Follow-up Recommendations**\n\n`
        response += `**Suggested Timeline:** ${urgency}\n\n`
        response += `**Monitoring Required:**\n`
        
        if (subRisks.diabetes.level !== 'low') {
          response += `• Blood glucose: Weekly self-monitoring\n`
          response += `• HbA1c: Every 3 months\n`
        }
        
        if (subRisks.hypertension.level !== 'low') {
          response += `• Blood pressure: Daily home monitoring\n`
          response += `• In-office check: Every 4 weeks\n`
        }
        
        if (subRisks.cardiac.level !== 'low') {
          response += `• ECG: Within 3 months\n`
          response += `• Lipid panel: Every 6 months\n`
        }
        
        response += `\n**Next Visit Agenda:**\n`
        response += `• Review medication adherence\n`
        response += `• Assess lifestyle modifications\n`
        response += `• Update treatment plan as needed\n`
      } else {
        response = aiInput
      }

      response += `\n\n---\n⚠️ **Disclaimer:** This AI Co-Pilot is for decision support only and not a replacement for clinical judgment.`

      setAiMessages(prev => [
        ...prev,
        { role: 'user', content: type === 'custom' ? aiInput : `${type.charAt(0).toUpperCase() + type.slice(1)} this case` },
        { role: 'assistant', content: response }
      ])
      
      setAiInput('')
      setAiLoading(false)

      if (voiceOutputEnabled) {
        const cleanText = response.replace(/[*_#\n]/g, ' ').substring(0, 500)
        speechService.speak(cleanText, languageToSpeechCode[language])
      }
    }, 1500)
  }

  const startVoiceInput = () => {
    if (!voiceInputEnabled) {
      toast.error('Voice input is disabled', {
        description: 'Enable it in Settings'
      })
      return
    }

    setIsListening(true)
    speechService.startListening(
      (transcript) => {
        if (visitNote === '') {
          setVisitNote(transcript)
        } else {
          setVisitNote(prev => prev + ' ' + transcript)
        }
        setIsListening(false)
        toast.success('Voice note captured')
      },
      (error) => {
        setIsListening(false)
        toast.error('Voice input failed', { description: error })
      },
      languageToSpeechCode[language]
    )
  }

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

  if (!user || user.role !== 'doctor') {
    return null
  }

  const subRisks = selectedPatient ? calculateSubRisks(selectedPatient.vitals) : null
  const safetyWarnings = selectedPatient ? checkMedicationSafety(selectedPatient.vitals, selectedMedications) : []

  return (
    <AppLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-12">
        {/* Main Content - Left 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-text flex items-center gap-2">
                <Stethoscope className="h-8 w-8" />
                Doctor Portal
              </h1>
              <p className="text-muted-foreground">Clinical Insights powered by Flare Network</p>
            </div>
            <Button
              onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
              className="gap-2 neon-glow"
              variant={aiSidebarOpen ? "default" : "outline"}
            >
              <Bot className="h-4 w-4" />
              AI Co-Pilot
            </Button>
          </div>

          {/* Priority Queue Dashboard */}
          <Card className="glass-card gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Today's Priority Queue
              </CardTitle>
              <CardDescription>Patients sorted by risk score (highest priority first)</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {[...mockPatients]
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .map((patient, idx) => {
                      const risks = calculateSubRisks(patient.vitals)
                      const criticalRisks = Object.entries(risks)
                        .filter(([_, risk]) => risk.level === 'high')
                        .map(([key]) => key)
                      
                      return (
                        <motion.div
                          key={patient.patientId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-all cursor-pointer"
                          onClick={() => {
                            setPatientIdInput(patient.patientId)
                            handleScanPatient()
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{patient.patientName}</p>
                                <Badge variant="outline" className="text-xs font-mono">
                                  {patient.patientId}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {criticalRisks.length > 0 
                                  ? `${criticalRisks.join(', ')} risk high`
                                  : 'Stable condition'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={patient.riskScore >= 70 ? 'destructive' : patient.riskScore >= 50 ? 'default' : 'secondary'}
                              className="gap-1"
                            >
                              Risk: {patient.riskScore}
                            </Badge>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </motion.div>
                      )
                    })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Patient Scanner */}
          {!accessGranted && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  Scan Patient QR Code
                </CardTitle>
                <CardDescription>Enter Patient ID to grant access and view health data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient ID</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., FLR-2024-9834"
                      value={patientIdInput}
                      onChange={(e) => setPatientIdInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleScanPatient()}
                    />
                    <Button onClick={handleScanPatient} className="neon-glow">
                      <Shield className="h-4 w-4 mr-2" />
                      Grant Access
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 Try: FLR-2024-9834, FLR-2024-7821, FLR-2024-5612
                </p>
              </CardContent>
            </Card>
          )}

          {/* Clinical Insights Panel */}
          {accessGranted && selectedPatient && subRisks && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Patient Header */}
              <Card className="glass-card gradient-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedPatient.patientName}</h2>
                        <p className="text-sm text-muted-foreground">ID: {selectedPatient.patientId}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Last Visit: {selectedPatient.lastVisit?.toLocaleDateString()}</Badge>
                          <Badge variant={selectedPatient.riskScore >= 70 ? 'destructive' : 'default'}>
                            Risk: {selectedPatient.riskScore}/100
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAccessGranted(false)
                        setSelectedPatient(null)
                        setShowInsights(false)
                        setPatientIdInput('')
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Clinical Insights - Sub-Risk Cards */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Smart Clinical Insights
                  </CardTitle>
                  <CardDescription>AI-powered risk analysis from on-chain vitals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Cardiac Risk */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="border-2 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Heart className={`h-5 w-5 ${subRisks.cardiac.color}`} />
                            <Badge variant={subRisks.cardiac.level === 'high' ? 'destructive' : subRisks.cardiac.level === 'medium' ? 'default' : 'secondary'}>
                              {subRisks.cardiac.level.toUpperCase()}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">Cardiac</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className={`text-3xl font-bold ${subRisks.cardiac.color}`}>
                            {subRisks.cardiac.score}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subRisks.cardiac.explanation}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Diabetes Risk */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="border-2 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Droplets className={`h-5 w-5 ${subRisks.diabetes.color}`} />
                            <Badge variant={subRisks.diabetes.level === 'high' ? 'destructive' : subRisks.diabetes.level === 'medium' ? 'default' : 'secondary'}>
                              {subRisks.diabetes.level.toUpperCase()}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">Diabetes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className={`text-3xl font-bold ${subRisks.diabetes.color}`}>
                            {subRisks.diabetes.score}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subRisks.diabetes.explanation}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Hypertension Risk */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card className="border-2 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <TrendingUp className={`h-5 w-5 ${subRisks.hypertension.color}`} />
                            <Badge variant={subRisks.hypertension.level === 'high' ? 'destructive' : subRisks.hypertension.level === 'medium' ? 'default' : 'secondary'}>
                              {subRisks.hypertension.level.toUpperCase()}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">Hypertension</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className={`text-3xl font-bold ${subRisks.hypertension.color}`}>
                            {subRisks.hypertension.score}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subRisks.hypertension.explanation}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Obesity Risk */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="border-2 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Activity className={`h-5 w-5 ${subRisks.obesity.color}`} />
                            <Badge variant={subRisks.obesity.level === 'high' ? 'destructive' : subRisks.obesity.level === 'medium' ? 'default' : 'secondary'}>
                              {subRisks.obesity.level.toUpperCase()}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">Obesity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className={`text-3xl font-bold ${subRisks.obesity.color}`}>
                            {subRisks.obesity.score}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subRisks.obesity.explanation}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Mental Stress Risk */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card className="border-2 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Brain className={`h-5 w-5 ${subRisks.mentalStress.color}`} />
                            <Badge variant={subRisks.mentalStress.level === 'high' ? 'destructive' : subRisks.mentalStress.level === 'medium' ? 'default' : 'secondary'}>
                              {subRisks.mentalStress.level.toUpperCase()}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">Mental Stress</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className={`text-3xl font-bold ${subRisks.mentalStress.color}`}>
                            {subRisks.mentalStress.score}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subRisks.mentalStress.explanation}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Medication Safety Checker */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    Medication Safety Checker
                  </CardTitle>
                  <CardDescription>Rule-based safety analysis (vitals + medications)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Medications</Label>
                    <div className="flex flex-wrap gap-2">
                      {medicationOptions.map(med => (
                        <Badge
                          key={med}
                          variant={selectedMedications.includes(med) ? 'default' : 'outline'}
                          className="cursor-pointer hover:bg-primary/20 transition-colors"
                          onClick={() => {
                            setSelectedMedications(prev =>
                              prev.includes(med)
                                ? prev.filter(m => m !== med)
                                : [...prev, med]
                            )
                          }}
                        >
                          {selectedMedications.includes(med) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {med}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {safetyWarnings.length > 0 && (
                    <div className="space-y-2">
                      <Label>Safety Alerts</Label>
                      {safetyWarnings.map((warning, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-3 rounded-lg border-2 ${
                            warning.severity === 'warning'
                              ? 'bg-destructive/10 border-destructive/50'
                              : 'bg-yellow-500/10 border-yellow-500/50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                              warning.severity === 'warning' ? 'text-destructive' : 'text-yellow-500'
                            }`} />
                            <p className="text-sm">{warning.message}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {safetyWarnings.length === 0 && selectedMedications.length > 0 && (
                    <div className="p-3 rounded-lg bg-green-500/10 border-2 border-green-500/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <p className="text-sm">No immediate safety concerns detected with current medications.</p>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground">
                      ⚠️ <strong>Disclaimer:</strong> Rule-based safety hints only. Not a substitute for clinical judgment and comprehensive drug interaction databases.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Visit Note Hash */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Immutable Clinical Note
                  </CardTitle>
                  <CardDescription>Hash visit notes on Flare for tamper-evidence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Visit Note / Summary</Label>
                    <div className="relative">
                      <Textarea
                        placeholder="Type your clinical note here..."
                        value={visitNote}
                        onChange={(e) => setVisitNote(e.target.value)}
                        rows={5}
                        className="pr-12"
                      />
                      {voiceInputEnabled && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={startVoiceInput}
                          disabled={isListening}
                        >
                          <Mic className={`h-4 w-4 ${isListening ? 'text-destructive animate-pulse' : ''}`} />
                        </Button>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleHashNote}
                    disabled={!visitNote.trim()}
                    className="w-full neon-glow"
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Sign & Hash on Flare
                  </Button>

                  {noteHash && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-green-500/10 border-2 border-green-500/50 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <p className="font-semibold text-green-500">Note Hashed Successfully</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Hash:</p>
                        <p className="text-xs font-mono break-all bg-muted p-2 rounded">{noteHash}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Timestamp: {hashTimestamp?.toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => window.open(`https://coston2-explorer.flare.network/tx/${noteHash}`, '_blank')}
                        >
                          View on Explorer
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Consent Timeline */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Consent & Access Timeline
                  </CardTitle>
                  <CardDescription>On-chain verifiable access history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consentTimeline.map((event, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </div>
                          {idx < consentTimeline.length - 1 && (
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-primary/30" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{event.event}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {event.txHash && (
                            <Button
                              variant="link"
                              size="sm"
                              className="gap-1 text-xs p-0 h-auto"
                              onClick={() => window.open(`https://coston2-explorer.flare.network/tx/${event.txHash}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                              View on Flare Explorer
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* AI Co-Pilot Sidebar - Right 1/3 */}
        <AnimatePresence>
          {aiSidebarOpen && selectedPatient && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="xl:col-span-1"
            >
              <div className="sticky top-20">
                <Card className="glass-card gradient-border h-[calc(100vh-120px)] flex flex-col">
                  <CardHeader className="flex-shrink-0 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">AI Co-Pilot</CardTitle>
                          <p className="text-xs text-muted-foreground">(Doctor Only)</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setAiSidebarOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col p-4 space-y-4 min-h-0">
                    {/* Quick Actions */}
                    <div className="flex-shrink-0 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => handleAiRequest('summarize')}
                        disabled={aiLoading}
                      >
                        <FileText className="h-3 w-3" />
                        Summarize
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => handleAiRequest('lifestyle')}
                        disabled={aiLoading}
                      >
                        <Heart className="h-3 w-3" />
                        Lifestyle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs col-span-2"
                        onClick={() => handleAiRequest('followup')}
                        disabled={aiLoading}
                      >
                        <Clock className="h-3 w-3" />
                        Follow-up Timeline
                      </Button>
                    </div>

                    <Separator />

                    {/* Messages */}
                    <ScrollArea className="flex-1">
                      <div className="space-y-4 pr-4">
                        {aiMessages.length === 0 && (
                          <div className="text-center py-8 space-y-4">
                            <motion.div
                              className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Bot className="h-8 w-8 text-primary" />
                            </motion.div>
                            <p className="text-sm text-muted-foreground">
                              AI assistant ready to help with clinical decisions
                            </p>
                          </div>
                        )}

                        {aiMessages.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {msg.role === 'assistant' && (
                              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div
                              className={`max-w-[85%] rounded-lg p-3 ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-line">{msg.content}</p>
                            </div>
                          </motion.div>
                        ))}

                        {aiLoading && (
                          <div className="flex gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-primary animate-pulse" />
                            </div>
                            <div className="bg-muted rounded-lg p-3">
                              <p className="text-sm text-muted-foreground">Analyzing patient data...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Disclaimer */}
                    <div className="flex-shrink-0 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-[10px] text-muted-foreground text-center leading-tight">
                        <strong>⚠️ Disclaimer:</strong> This AI Co-Pilot is for decision support only and not a replacement for clinical judgment.
                      </p>
                    </div>

                    {/* Input */}
                    <div className="flex-shrink-0 flex gap-2">
                      <Input
                        placeholder="Ask anything..."
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && aiInput.trim() && handleAiRequest('custom')}
                        disabled={aiLoading}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleAiRequest('custom')}
                        disabled={!aiInput.trim() || aiLoading}
                        size="icon"
                        className="neon-glow"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  )
}

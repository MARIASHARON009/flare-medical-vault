"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Pill, 
  Stethoscope, 
  Calendar, 
  ChevronRight,
  AlertCircle,
  Clock
} from "lucide-react"

interface Diagnosis {
  id: string
  condition: string
  doctor: string
  date: string
  severity: "low" | "medium" | "high"
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
}

interface Doctor {
  id: string
  name: string
  specialty: string
  contact: string
}

interface Appointment {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  type: "checkup" | "followup" | "emergency"
}

const sampleDiagnoses: Diagnosis[] = [
  {
    id: "1",
    condition: "Hypertension",
    doctor: "Dr. Smith",
    date: "03/2025",
    severity: "medium"
  },
  {
    id: "2",
    condition: "Type 2 Diabetes",
    doctor: "Dr. Johnson",
    date: "01/2025",
    severity: "medium"
  }
]

const sampleMedications: Medication[] = [
  {
    id: "1",
    name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once daily",
    startDate: "03/15/2025"
  },
  {
    id: "2",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "01/20/2025"
  },
  {
    id: "3",
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    startDate: "03/15/2025"
  }
]

const sampleDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Smith",
    specialty: "Cardiology",
    contact: "+1 (555) 123-4567"
  },
  {
    id: "2",
    name: "Dr. Michael Johnson",
    specialty: "Endocrinology",
    contact: "+1 (555) 987-6543"
  }
]

const sampleAppointments: Appointment[] = [
  {
    id: "1",
    doctor: "Dr. Smith",
    specialty: "Cardiology",
    date: "2025-12-15",
    time: "10:00 AM",
    type: "followup"
  },
  {
    id: "2",
    doctor: "Dr. Johnson",
    specialty: "Endocrinology",
    date: "2025-12-20",
    time: "2:30 PM",
    type: "checkup"
  }
]

export function MedicalHistorySidebar() {
  const [diagnoses] = useState<Diagnosis[]>(sampleDiagnoses)
  const [medications] = useState<Medication[]>(sampleMedications)
  const [doctors] = useState<Doctor[]>(sampleDoctors)
  const [appointments] = useState<Appointment[]>(sampleAppointments)
  const [activeSection, setActiveSection] = useState<string | null>("appointments")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case "emergency": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "followup": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "checkup": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const isUpcoming = (dateStr: string) => {
    const appointmentDate = new Date(dateStr)
    const now = new Date()
    return appointmentDate > now
  }

  const getDaysUntil = (dateStr: string) => {
    const appointmentDate = new Date(dateStr)
    const now = new Date()
    const diffTime = appointmentDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 glass-card border-l border-border overflow-y-auto p-4 space-y-4 z-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Medical History</h2>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          Active
        </Badge>
      </div>

      {/* Upcoming Appointments */}
      <Card className="glass-card border-primary/20">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/30 transition-colors rounded-t-lg"
          onClick={() => setActiveSection(activeSection === "appointments" ? null : "appointments")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            </div>
            <motion.div
              animate={{ rotate: activeSection === "appointments" ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {activeSection === "appointments" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-3 pt-4">
                {appointments.filter(apt => isUpcoming(apt.date)).map((appointment) => (
                  <div key={appointment.id} className="p-3 rounded-lg glass-card space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{appointment.doctor}</p>
                        <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                      </div>
                      <Badge className={`${getAppointmentTypeColor(appointment.type)} capitalize text-xs`}>
                        {appointment.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(appointment.date).toLocaleDateString()} • {appointment.time}</span>
                    </div>
                    {getDaysUntil(appointment.date) <= 7 && (
                      <div className="flex items-center gap-1 text-xs text-orange-400">
                        <AlertCircle className="h-3 w-3" />
                        <span>In {getDaysUntil(appointment.date)} days</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Diagnoses */}
      <Card className="glass-card">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/30 transition-colors rounded-t-lg"
          onClick={() => setActiveSection(activeSection === "diagnoses" ? null : "diagnoses")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-base">Previous Diagnoses</CardTitle>
            </div>
            <motion.div
              animate={{ rotate: activeSection === "diagnoses" ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {activeSection === "diagnoses" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-3 pt-4">
                {diagnoses.map((diagnosis) => (
                  <div key={diagnosis.id} className="p-3 rounded-lg glass-card space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-sm">{diagnosis.condition}</p>
                      <Badge className={`${getSeverityColor(diagnosis.severity)} capitalize text-xs`}>
                        {diagnosis.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{diagnosis.doctor} • {diagnosis.date}</p>
                  </div>
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Medications */}
      <Card className="glass-card">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/30 transition-colors rounded-t-lg"
          onClick={() => setActiveSection(activeSection === "medications" ? null : "medications")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-400" />
              <CardTitle className="text-base">Current Medications</CardTitle>
            </div>
            <motion.div
              animate={{ rotate: activeSection === "medications" ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {activeSection === "medications" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-3 pt-4">
                {medications.map((med) => (
                  <div key={med.id} className="p-3 rounded-lg glass-card space-y-1">
                    <p className="font-semibold text-sm">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.dosage} • {med.frequency}</p>
                    <p className="text-xs text-muted-foreground">Since {med.startDate}</p>
                  </div>
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Doctors */}
      <Card className="glass-card">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/30 transition-colors rounded-t-lg"
          onClick={() => setActiveSection(activeSection === "doctors" ? null : "doctors")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-base">Your Doctors</CardTitle>
            </div>
            <motion.div
              animate={{ rotate: activeSection === "doctors" ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {activeSection === "doctors" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-3 pt-4">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="p-3 rounded-lg glass-card space-y-1">
                    <p className="font-semibold text-sm">{doctor.name}</p>
                    <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                    <p className="text-xs text-primary">{doctor.contact}</p>
                  </div>
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}

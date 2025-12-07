"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Thermometer, Activity, Droplets, Wind, Brain, Download, ChevronDown, ChevronUp } from "lucide-react"
import { HeartRateVisualization } from "./visualizations/HeartRateVisualization"
import { TemperatureVisualization } from "./visualizations/TemperatureVisualization"
import { BloodPressureVisualization } from "./visualizations/BloodPressureVisualization"
import { OxygenVisualization } from "./visualizations/OxygenVisualization"
import { RespiratoryVisualization } from "./visualizations/RespiratoryVisualization"
import { MentalHealthVisualization } from "./visualizations/MentalHealthVisualization"
import { TrendChart } from "./visualizations/TrendChart"
import { RealtimeWaveform } from "./visualizations/RealtimeWaveform"
import { generatePDF } from "@/lib/pdfGenerator"
import { toast } from "sonner"

export type HealthMetric = {
  id: string
  icon: any
  label: string
  value: string
  unit: string
  status: "normal" | "warning" | "abnormal" | "excellent" | "good"
  color: string
  normalRange: string
  trendData: { date: string; value: number }[]
}

const healthMetrics: HealthMetric[] = [
  {
    id: "heart-rate",
    icon: Heart,
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    status: "normal",
    color: "text-red-500",
    normalRange: "60-100 bpm",
    trendData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: Math.floor(Math.random() * 20) + 65
    }))
  },
  {
    id: "temperature",
    icon: Thermometer,
    label: "Body Temperature",
    value: "36.8",
    unit: "°C",
    status: "normal",
    color: "text-orange-500",
    normalRange: "36.1-37.2 °C",
    trendData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: 36 + Math.random() * 1.5
    }))
  },
  {
    id: "blood-pressure",
    icon: Activity,
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "normal",
    color: "text-blue-500",
    normalRange: "90/60 - 120/80 mmHg",
    trendData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: Math.floor(Math.random() * 20) + 110
    }))
  },
  {
    id: "blood-oxygen",
    icon: Droplets,
    label: "Blood Oxygen",
    value: "98",
    unit: "%",
    status: "excellent",
    color: "text-cyan-500",
    normalRange: "95-100 %",
    trendData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: Math.floor(Math.random() * 5) + 95
    }))
  },
  {
    id: "respiratory",
    icon: Wind,
    label: "Respiratory Rate",
    value: "16",
    unit: "brpm",
    status: "normal",
    color: "text-green-500",
    normalRange: "12-20 brpm",
    trendData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: Math.floor(Math.random() * 8) + 12
    }))
  },
  {
    id: "mental-health",
    icon: Brain,
    label: "Mental Health",
    value: "85",
    unit: "/100",
    status: "good",
    color: "text-purple-500",
    normalRange: "70-100 /100",
    trendData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: Math.floor(Math.random() * 30) + 70
    }))
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent": return "bg-green-500/20 text-green-400 border-green-500/30"
    case "good": return "bg-teal-500/20 text-teal-400 border-teal-500/30"
    case "normal": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "warning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "abnormal": return "bg-red-500/20 text-red-400 border-red-500/30"
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export function HealthDashboard() {
  const [activeTab, setActiveTab] = useState("heart-rate")
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Enhanced: Handle PDF export with error handling and toast notifications
  const handleExportPDF = async (metric: HealthMetric) => {
    setIsExporting(true)
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500))
      generatePDF(metric)
      toast.success("Report exported successfully!", {
        description: `${metric.label} report has been downloaded.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("PDF export error:", error)
      toast.error("Export failed", {
        description: "Unable to generate PDF report. Please try again.",
        duration: 4000,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const toggleExpanded = (metricId: string) => {
    setExpandedMetric(expandedMetric === metricId ? null : metricId)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Enhanced: Premium tabbed navigation with glowing pulse on active heart rate */}
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-3 bg-transparent h-auto p-2">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon
            const isActive = activeTab === metric.id
            const isHeartRate = metric.id === "heart-rate"
            
            return (
              <TabsTrigger
                key={metric.id}
                value={metric.id}
                className={`
                  relative overflow-hidden
                  data-[state=active]:glass-card 
                  data-[state=active]:shadow-2xl
                  data-[state=inactive]:hover:bg-accent/30
                  transition-all duration-500 ease-out
                  flex flex-col gap-2 py-4 px-3
                  group
                  ${isActive && isHeartRate ? 'animate-pulse-glow' : ''}
                `}
              >
                {/* Enhanced: Animated gradient background on active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent"
                    layoutId="activeTabBackground"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Enhanced: Icon with smooth color transition and hover scale */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: isHeartRate ? [0, -5, 5, 0] : 0 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <Icon 
                    className={`h-6 w-6 transition-all duration-300 ${
                      isActive ? metric.color : 'text-muted-foreground group-hover:text-foreground'
                    }`} 
                  />
                  
                  {/* Enhanced: Glowing pulse ring for active heart rate */}
                  {isActive && isHeartRate && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-500"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
                
                {/* Enhanced: Label with smooth fade */}
                <span className={`text-xs font-medium relative z-10 transition-colors duration-300 ${
                  isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {metric.label}
                </span>
                
                {/* Enhanced: Decorative bottom border on active */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                    layoutId="activeTabBorder"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {healthMetrics.map((metric) => (
          <TabsContent key={metric.id} value={metric.id} className="mt-6">
            {/* Enhanced: Smooth fade + slide transition between tabs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <Card className="glass-card overflow-hidden border-2 shadow-2xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Enhanced: Premium gradient background for icon */}
                        <motion.div 
                          className={`p-4 rounded-2xl bg-gradient-to-br from-${metric.color.split('-')[1]}-500/30 to-${metric.color.split('-')[1]}-600/10 border border-${metric.color.split('-')[1]}-500/20 shadow-lg`}
                          whileHover={{ scale: 1.05, rotate: 2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <metric.icon className={`h-8 w-8 ${metric.color} drop-shadow-lg`} />
                        </motion.div>
                        <div>
                          <CardTitle className="text-2xl font-bold tracking-tight">{metric.label}</CardTitle>
                          <CardDescription className="text-base mt-1">Normal Range: {metric.normalRange}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpanded(metric.id)}
                        className="hover:bg-accent/50 rounded-full transition-all duration-300"
                      >
                        <motion.div
                          animate={{ rotate: expandedMetric === metric.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {expandedMetric === metric.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </motion.div>
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Enhanced: Current Reading with breathing animation and bouncing numbers */}
                    <motion.div 
                      className="relative flex items-center justify-between p-8 rounded-2xl glass-card border-2 border-primary/10 shadow-xl overflow-hidden"
                      animate={{
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Animated gradient background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="relative z-10">
                        <p className="text-sm text-muted-foreground mb-3 font-medium">Current Reading</p>
                        <div className="flex items-baseline gap-3">
                          {/* Enhanced: Bouncing number animation */}
                          <motion.span 
                            className="text-6xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                            key={metric.value}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 25
                            }}
                          >
                            {metric.value}
                          </motion.span>
                          <span className="text-2xl text-muted-foreground font-medium">{metric.unit}</span>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(metric.status)} capitalize text-base px-6 py-3 shadow-lg relative z-10`}>
                        {metric.status}
                      </Badge>
                    </motion.div>

                    {/* Enhanced: Real-time waveform for heart rate */}
                    {metric.id === "heart-rate" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl glass-card p-4 border border-red-500/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-red-400">Live ECG Signal</h4>
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="h-2 w-2 rounded-full bg-red-500"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0.5, 1],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                              }}
                            />
                            <span className="text-xs text-muted-foreground">Recording</span>
                          </div>
                        </div>
                        <RealtimeWaveform bpm={parseInt(metric.value)} />
                      </motion.div>
                    )}

                    {/* Animated Visualization - Expanded State */}
                    <AnimatePresence>
                      {expandedMetric === metric.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                          className="space-y-6"
                        >
                          {/* 3D Visualization */}
                          <motion.div 
                            className="rounded-2xl glass-card p-6 h-[400px] border-2 border-primary/10 shadow-xl"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {metric.id === "heart-rate" && <HeartRateVisualization bpm={parseInt(metric.value)} />}
                            {metric.id === "temperature" && <TemperatureVisualization temp={parseFloat(metric.value)} />}
                            {metric.id === "blood-pressure" && <BloodPressureVisualization systolic={120} diastolic={80} />}
                            {metric.id === "blood-oxygen" && <OxygenVisualization value={parseInt(metric.value)} />}
                            {metric.id === "respiratory" && <RespiratoryVisualization rate={parseInt(metric.value)} />}
                            {metric.id === "mental-health" && <MentalHealthVisualization score={parseInt(metric.value)} />}
                          </motion.div>

                          {/* 30-Day Trend Chart */}
                          <motion.div 
                            className="rounded-2xl glass-card p-6 border-2 border-primary/10 shadow-xl"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <Activity className="h-5 w-5 text-primary" />
                              30-Day Trend Analysis
                            </h3>
                            <TrendChart data={metric.trendData} color={metric.color} />
                          </motion.div>

                          {/* Enhanced: Export Button with loading state */}
                          <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Button
                              onClick={() => handleExportPDF(metric)}
                              disabled={isExporting}
                              className="w-full gap-3 py-6 text-base font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:bg-right-bottom transition-all duration-500 shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                              {isExporting ? (
                                <>
                                  <motion.div
                                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  />
                                  Generating Report...
                                </>
                              ) : (
                                <>
                                  <Download className="h-5 w-5" />
                                  Export {metric.label} Report as PDF
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
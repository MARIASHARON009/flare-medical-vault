"use client"

import { AppLayout } from "@/components/AppLayout"
import { HealthDashboard } from "@/components/HealthDashboard"
import { MedicalHistorySidebar } from "@/components/MedicalHistorySidebar"
import { SerenityAIGuidance } from "@/components/SerenityAIGuidance"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import type { HealthMetric } from "@/components/HealthDashboard"

// Sample health metrics for Serenity AI
const healthMetrics: HealthMetric[] = [
  {
    id: "heart-rate",
    icon: null,
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    status: "normal",
    color: "text-red-500",
    normalRange: "60-100 bpm",
    trendData: []
  },
  {
    id: "temperature",
    icon: null,
    label: "Body Temperature",
    value: "36.8",
    unit: "°C",
    status: "normal",
    color: "text-orange-500",
    normalRange: "36.1-37.2 °C",
    trendData: []
  },
  {
    id: "blood-pressure",
    icon: null,
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "normal",
    color: "text-blue-500",
    normalRange: "90/60 - 120/80 mmHg",
    trendData: []
  },
  {
    id: "blood-oxygen",
    icon: null,
    label: "Blood Oxygen",
    value: "98",
    unit: "%",
    status: "excellent",
    color: "text-cyan-500",
    normalRange: "95-100 %",
    trendData: []
  },
  {
    id: "respiratory",
    icon: null,
    label: "Respiratory Rate",
    value: "16",
    unit: "brpm",
    status: "normal",
    color: "text-green-500",
    normalRange: "12-20 brpm",
    trendData: []
  },
  {
    id: "mental-health",
    icon: null,
    label: "Mental Health",
    value: "85",
    unit: "/100",
    status: "good",
    color: "text-purple-500",
    normalRange: "70-100 /100",
    trendData: []
  }
]

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="pr-80">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Health Dashboard</h1>
              <p className="text-muted-foreground">Real-time health monitoring powered by DePIN</p>
            </div>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
            </Badge>
          </div>

          {/* Health Dashboard with Tabbed Navigation */}
          <HealthDashboard />

          {/* Serenity AI Patient Guidance Coach */}
          <div className="pt-6">
            <SerenityAIGuidance metrics={healthMetrics} />
          </div>
        </div>
      </div>

      {/* Medical History Sidebar */}
      <MedicalHistorySidebar />
    </AppLayout>
  )
}
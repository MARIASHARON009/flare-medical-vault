
"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Radio, Activity, Thermometer, Heart, Droplets } from "lucide-react"
import { useState } from "react"

const bioSensorNodes = [
  { id: 1, name: "Bio-Sensor SF-001", location: "San Francisco, USA", lat: 37.7749, lon: -122.4194, type: "Heart Monitor", status: "active", dataPoints: 2450 },
  { id: 2, name: "Bio-Sensor TK-042", location: "Tokyo, Japan", lat: 35.6762, lon: 139.6503, type: "Blood Oxygen", status: "active", dataPoints: 3120 },
  { id: 3, name: "Bio-Sensor LD-089", location: "London, UK", lat: 51.5074, lon: -0.1278, type: "Temperature", status: "active", dataPoints: 1890 },
  { id: 4, name: "Bio-Sensor BR-156", location: "Berlin, Germany", lat: 52.5200, lon: 13.4050, type: "Activity Tracker", status: "maintenance", dataPoints: 980 },
  { id: 5, name: "Bio-Sensor SY-203", location: "Sydney, Australia", lat: -33.8688, lon: 151.2093, type: "Sleep Monitor", status: "active", dataPoints: 2780 },
  { id: 6, name: "Bio-Sensor NY-067", location: "New York, USA", lat: 40.7128, lon: -74.0060, type: "Heart Monitor", status: "active", dataPoints: 4230 },
  { id: 7, name: "Bio-Sensor SG-134", location: "Singapore", lat: 1.3521, lon: 103.8198, type: "Blood Pressure", status: "active", dataPoints: 3560 },
  { id: 8, name: "Bio-Sensor PR-091", location: "Paris, France", lat: 48.8566, lon: 2.3522, type: "Glucose Monitor", status: "active", dataPoints: 2190 },
]

const deviceTypeIcons = {
  "Heart Monitor": Heart,
  "Blood Oxygen": Droplets,
  "Temperature": Thermometer,
  "Activity Tracker": Activity,
  "Sleep Monitor": Activity,
  "Blood Pressure": Activity,
  "Glucose Monitor": Activity,
}

export default function MapPage() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const activeNodes = bioSensorNodes.filter(n => n.status === 'active').length

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">DePIN Network Map</h1>
            <p className="text-muted-foreground">Global bio-sensor network visualization</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-2">
              <Radio className="h-3 w-3 text-green-500" />
              {activeNodes} Active Nodes
            </Badge>
            <Badge variant="outline">{bioSensorNodes.length} Total Devices</Badge>
          </div>
        </div>

        {/* Map Visualization */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted/20">
              {/* Mock World Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)`,
                  backgroundSize: '40px 40px',
                  opacity: 0.3
                }} />
              </div>

              {/* Device Markers */}
              {bioSensorNodes.map((node) => {
                const xPos = ((node.lon + 180) / 360) * 100
                const yPos = ((90 - node.lat) / 180) * 100
                
                return (
                  <div
                    key={node.id}
                    className={`absolute cursor-pointer transition-all ${
                      selectedNode === node.id ? 'scale-150 z-10' : 'hover:scale-125'
                    }`}
                    style={{
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  >
                    <div className={`relative ${node.status === 'active' ? 'neon-glow' : ''}`}>
                      <MapPin className={`h-6 w-6 ${
                        node.status === 'active' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      {node.status === 'active' && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Node Details */}
        {selectedNode && (
          <Card className="glass-card gradient-border">
            <CardHeader>
              <CardTitle>Device Details</CardTitle>
              <CardDescription>Information about the selected bio-sensor node</CardDescription>
            </CardHeader>
            <CardContent>
              {bioSensorNodes.filter(n => n.id === selectedNode).map((node) => {
                const Icon = deviceTypeIcons[node.type as keyof typeof deviceTypeIcons] || Activity
                return (
                  <div key={node.id} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold">{node.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {node.location}
                        </p>
                      </div>
                      <Badge variant={node.status === 'active' ? 'default' : 'secondary'}>
                        {node.status}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Device Type</p>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <p className="font-medium">{node.type}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Data Points</p>
                        <p className="text-xl font-bold">{node.dataPoints.toLocaleString()}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Coordinates</p>
                        <p className="text-sm font-mono">{node.lat.toFixed(4)}, {node.lon.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Network Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bioSensorNodes.length}</div>
              <p className="text-xs text-muted-foreground">Across 8 regions</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Nodes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{activeNodes}</div>
              <p className="text-xs text-muted-foreground">98.7% uptime</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Data Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bioSensorNodes.reduce((acc, node) => acc + node.dataPoints, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Network Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Optimal</div>
              <p className="text-xs text-muted-foreground">All systems go</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

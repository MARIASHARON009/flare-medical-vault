"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Users, Settings, Wallet, Shield, Bell } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface FamilyMember {
  id: number
  name: string
  relation: string
  age: number
  avatar: string
  healthData?: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygenLevel: number
  }
}

const initialFamilyMembers: FamilyMember[] = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    relation: "Self", 
    age: 32, 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    healthData: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 36.8,
      oxygenLevel: 98
    }
  },
  { 
    id: 2, 
    name: "Michael Johnson", 
    relation: "Spouse", 
    age: 35, 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    healthData: {
      heartRate: 75,
      bloodPressure: "118/78",
      temperature: 36.9,
      oxygenLevel: 97
    }
  },
  { 
    id: 3, 
    name: "Emma Johnson", 
    relation: "Daughter", 
    age: 8, 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    healthData: {
      heartRate: 85,
      bloodPressure: "95/60",
      temperature: 36.7,
      oxygenLevel: 99
    }
  },
  { 
    id: 4, 
    name: "Oliver Johnson", 
    relation: "Son", 
    age: 5, 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    healthData: {
      heartRate: 90,
      bloodPressure: "90/55",
      temperature: 36.6,
      oxygenLevel: 99
    }
  },
]

export default function ProfilePage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [memberToRemove, setMemberToRemove] = useState<FamilyMember | null>(null)
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)

  // Handle viewing family member's health
  const handleViewHealth = (member: FamilyMember) => {
    setSelectedMember(member)
    setIsHealthDialogOpen(true)
  }

  // Handle removing family member
  const handleRemoveMember = (member: FamilyMember) => {
    setMemberToRemove(member)
    setIsRemoveDialogOpen(true)
  }

  // Confirm removal
  const confirmRemoval = () => {
    if (memberToRemove) {
      setFamilyMembers(prev => prev.filter(m => m.id !== memberToRemove.id))
      toast.success("Family member removed", {
        description: `${memberToRemove.name} has been removed from your family list.`,
      })
      setMemberToRemove(null)
      setIsRemoveDialogOpen(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile & Settings</h1>
            <p className="text-muted-foreground">Manage your account and family health data</p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Shield className="h-3 w-3 text-primary" />
            Verified Account
          </Badge>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                </CardContent>
              </Card>

              <Card className="glass-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Sarah" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Johnson" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="sarah.johnson@example.com" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" defaultValue="32" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input id="bloodType" defaultValue="A+" />
                    </div>
                  </div>

                  <Button className="neon-glow">Save Changes</Button>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Info */}
            <Card className="glass-card gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Connected Wallet
                </CardTitle>
                <CardDescription>Your Web3 identity and rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Wallet Address</p>
                    <p className="font-mono text-lg font-semibold">0x4f2a...8b9c</p>
                  </div>
                  <Button variant="outline">Disconnect</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Rewards</p>
                    <p className="text-2xl font-bold">0.28 ETH</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">FLARE Tokens</p>
                    <p className="text-2xl font-bold">2,450</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Health NFTs</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family Tab */}
          <TabsContent value="family" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Family Members
                    </CardTitle>
                    <CardDescription>Manage health data for your family</CardDescription>
                  </div>
                  <Button variant="outline">Add Member</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50 transition-all"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.relation} • {member.age} years old
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2" style={{ pointerEvents: 'auto' }}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewHealth(member)
                          }}
                          className="hover:bg-primary/10 transition-colors"
                        >
                          View Health
                        </Button>
                        {member.relation !== "Self" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveMember(member)
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Family Health Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Active Members</p>
                    <p className="text-2xl font-bold">{familyMembers.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Check-ins</p>
                    <p className="text-2xl font-bold">342</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Health Score</p>
                    <p className="text-2xl font-bold text-green-500">89</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Family Rewards</p>
                    <p className="text-2xl font-bold">0.52 ETH</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Health Alerts</Label>
                    <p className="text-xs text-muted-foreground">Get notified about vital sign changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Medication Reminders</Label>
                    <p className="text-xs text-muted-foreground">Daily reminders for medications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reward Notifications</Label>
                    <p className="text-xs text-muted-foreground">Updates on earned rewards</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Family Updates</Label>
                    <p className="text-xs text-muted-foreground">Health updates from family members</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Control your data privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>ZK Privacy Mode</Label>
                    <p className="text-xs text-muted-foreground">Use zero-knowledge proofs for all transactions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Encryption</Label>
                    <p className="text-xs text-muted-foreground">End-to-end encryption for health data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anonymous Analytics</Label>
                    <p className="text-xs text-muted-foreground">Share anonymized data for research</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Biometric Lock</Label>
                    <p className="text-xs text-muted-foreground">Require biometric authentication</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-red-500 border-red-500/50">
                  Export All Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-500 border-red-500/50">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Health Dashboard Modal - Shows family member's health data */}
        <Dialog open={isHealthDialogOpen} onOpenChange={setIsHealthDialogOpen}>
          <DialogContent className="max-w-2xl glass-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedMember?.avatar} />
                  <AvatarFallback>{selectedMember?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {selectedMember?.name}'s Health Dashboard
              </DialogTitle>
              <DialogDescription>
                {selectedMember?.relation} • {selectedMember?.age} years old
              </DialogDescription>
            </DialogHeader>
            
            {selectedMember?.healthData && (
              <div className="space-y-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="glass-card border-red-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Heart Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-500">{selectedMember.healthData.heartRate}</div>
                      <p className="text-xs text-muted-foreground">bpm</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-blue-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Blood Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-500">{selectedMember.healthData.bloodPressure}</div>
                      <p className="text-xs text-muted-foreground">mmHg</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-orange-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-500">{selectedMember.healthData.temperature}</div>
                      <p className="text-xs text-muted-foreground">°C</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-cyan-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Blood Oxygen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-cyan-500">{selectedMember.healthData.oxygenLevel}</div>
                      <p className="text-xs text-muted-foreground">%</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-2">
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    All vitals within normal range
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsHealthDialogOpen(false)}>
                Close
              </Button>
              <Button className="neon-glow">View Full Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Confirmation Dialog */}
        <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
          <AlertDialogContent className="glass-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove <strong>{memberToRemove?.name}</strong> from your family list. 
                Their health data will no longer be accessible from your account. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setMemberToRemove(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmRemoval}
                className="bg-destructive hover:bg-destructive/90"
              >
                Remove Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  )
}
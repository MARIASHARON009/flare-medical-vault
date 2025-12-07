
"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, CheckCircle2, XCircle, AlertTriangle, Scan, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

const recentVerifications = [
  { id: 1, drug: "Aspirin 100mg", batch: "BT-2024-001", status: "verified", timestamp: "2 mins ago" },
  { id: 2, drug: "Metformin 500mg", batch: "BT-2024-078", status: "verified", timestamp: "15 mins ago" },
  { id: 3, drug: "Lisinopril 10mg", batch: "BT-2024-145", status: "verified", timestamp: "1 hour ago" },
  { id: 4, drug: "Unknown Medication", batch: "BT-2023-999", status: "failed", timestamp: "2 hours ago" },
]

export default function VerifyPage() {
  const [batchNumber, setBatchNumber] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [zkPrivacy, setZkPrivacy] = useState(true)
  const [anonymousMode, setAnonymousMode] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    status: 'verified' | 'failed' | null
    drug?: string
    manufacturer?: string
    expiryDate?: string
    batchNumber?: string
  }>({ status: null })

  const handleVerify = async () => {
    setIsVerifying(true)
    // Simulate verification
    setTimeout(() => {
      setVerificationResult({
        status: Math.random() > 0.2 ? 'verified' : 'failed',
        drug: "Aspirin 100mg",
        manufacturer: "PharmaCorp International",
        expiryDate: "12/2025",
        batchNumber: batchNumber
      })
      setIsVerifying(false)
    }, 2000)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ZK Drug Verifier</h1>
            <p className="text-muted-foreground">Authenticate medications with zero-knowledge proofs</p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Shield className="h-3 w-3 text-primary" />
            Privacy Protected
          </Badge>
        </div>

        {/* Verification Form */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-primary" />
                Verify Medication
              </CardTitle>
              <CardDescription>Enter batch number or scan QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="batch">Batch Number</Label>
                <Input
                  id="batch"
                  placeholder="BT-2024-XXXX"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      ZK Privacy Mode
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Verify without revealing your identity
                    </p>
                  </div>
                  <Switch checked={zkPrivacy} onCheckedChange={setZkPrivacy} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      {anonymousMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      Anonymous Verification
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Don't store verification history
                    </p>
                  </div>
                  <Switch checked={anonymousMode} onCheckedChange={setAnonymousMode} />
                </div>
              </div>

              <Button 
                onClick={handleVerify} 
                disabled={!batchNumber || isVerifying}
                className="w-full neon-glow"
              >
                {isVerifying ? "Verifying..." : "Verify Medication"}
              </Button>

              {verificationResult.status && (
                <div className={`rounded-lg border p-4 ${
                  verificationResult.status === 'verified' 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-red-500 bg-red-500/10'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {verificationResult.status === 'verified' ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold text-green-500">Verified Authentic</h3>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <h3 className="font-semibold text-red-500">Verification Failed</h3>
                      </>
                    )}
                  </div>
                  
                  {verificationResult.status === 'verified' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medication:</span>
                        <span className="font-medium">{verificationResult.drug}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Manufacturer:</span>
                        <span className="font-medium">{verificationResult.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expiry Date:</span>
                        <span className="font-medium">{verificationResult.expiryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Batch:</span>
                        <span className="font-medium font-mono">{verificationResult.batchNumber}</span>
                      </div>
                    </div>
                  )}
                  
                  {verificationResult.status === 'failed' && (
                    <p className="text-sm text-muted-foreground">
                      This medication could not be verified. Please check the batch number or contact support.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Verifications */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Verifications</CardTitle>
              <CardDescription>Your verification history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentVerifications.map((verification) => (
                  <div
                    key={verification.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {verification.status === 'verified' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{verification.drug}</p>
                        <p className="text-xs text-muted-foreground font-mono">{verification.batch}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{verification.timestamp}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">98.4%</div>
              <p className="text-xs text-muted-foreground">Verified authentic</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Counterfeits Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">20</div>
              <p className="text-xs text-muted-foreground">Prevented harm</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Privacy Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">100%</div>
              <p className="text-xs text-muted-foreground">ZK protected</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

"use client"

import { Activity, Brain, FileCheck, Home, Map, Settings, User, Wallet, QrCode, Stethoscope } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

const navItems = [
  { href: "/", icon: Home, label: "Dashboard", roles: ['patient', 'doctor'] },
  { href: "/doctor", icon: Stethoscope, label: "Doctor Portal", roles: ['doctor'] },
  { href: "/map", icon: Map, label: "DePIN Map", roles: ['patient', 'doctor'] },
  { href: "/verify", icon: FileCheck, label: "ZK Verifier", roles: ['patient', 'doctor'] },
  { href: "/passport", icon: QrCode, label: "Health Passport", roles: ['patient', 'doctor'] },
  { href: "/chat", icon: Brain, label: "Serenity AI", roles: ['patient', 'doctor'] },
  { href: "/profile", icon: User, label: "Profile", roles: ['patient', 'doctor'] },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(item => 
    !user || item.roles.includes(user.role)
  )

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar transition-transform">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold neon-text">FlareHealth</h1>
            <p className="text-xs text-muted-foreground">AI Vault</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm neon-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all">
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </div>
      </div>
    </aside>
  )
}
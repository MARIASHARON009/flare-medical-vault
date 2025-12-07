
"use client"

import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <AppHeader />
      <main className="ml-64 mt-16 p-6">
        {children}
      </main>
    </div>
  )
}

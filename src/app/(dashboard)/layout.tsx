import type React from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <DashboardLayout>{children}</DashboardLayout>
    </SidebarProvider>
  )
}


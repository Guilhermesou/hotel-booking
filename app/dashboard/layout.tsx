'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, UsersIcon, BedIcon, LogOutIcon, SunIcon, MoonIcon, WrenchIcon, BarChartIcon } from 'lucide-react'
import { Button, Card } from '@heroui/react'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import { ThemeSwitch } from '@/components/theme-switch'
import Sidebar from '@/components/Sidebar'

// const navItems = [
//   { label: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
//   { label: 'Hóspedes', icon: UsersIcon, href: '/dashboard/guests' },
//   { label: 'Quartos', icon: BedIcon, href: '/dashboard/rooms' },
//   { label: 'Equipe - Escalas', icon: UsersIcon, href: '/dashboard/staff/shifts' },
//   { label: 'Equipe - Tarefas', icon: UsersIcon, href: '/dashboard/staff/tasks' },
//   { label: 'Manutenção', icon: WrenchIcon, href: '/dashboard/maintenance' },
//   { label: 'Relatórios', icon: BarChartIcon, href: '/dashboard/reports' },
// ]


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 overflow-y-auto bg-background text-foreground">
        {children}
      </main>
    </div>
  )
}

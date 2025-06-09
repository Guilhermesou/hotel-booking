'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import {
  HomeIcon,
  UsersIcon,
  BedIcon,
  WrenchIcon,
  BarChartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  LogOutIcon
} from 'lucide-react'

import { Button } from '@heroui/button'
import { Card, Tooltip } from '@heroui/react'
import { ThemeSwitch } from './theme-switch'

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    staff: true,
  })

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const navItems = [
    { label: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
    { label: 'Hóspedes', icon: UsersIcon, href: '/dashboard/guests' },
    { label: 'Quartos', icon: BedIcon, href: '/dashboard/rooms' },
  ]

  const staffItems = [
    { label: "Inicio", icon: UsersIcon, href: "/dashboard/staff" },
    { label: 'Escalas', icon: UsersIcon, href: '/dashboard/staff/shifts' },
    { label: 'Tarefas', icon: UsersIcon, href: '/dashboard/staff/tasks' },
  ]

  const maintenanceItems = [
    { label: 'Manutenção', icon: WrenchIcon, href: '/dashboard/maintenance' },
    { label: 'Relatórios', icon: BarChartIcon, href: '/dashboard/reports' },
  ]

  return (
    <Card
      className={clsx(
        'min-h-screen rounded-none shadow-none border-r border-divider bg-content1 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-20 p-2' : 'w-64 p-4'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && (
          <h2 className="text-2xl font-bold px-2">Admin</h2>
        )}
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Tooltip key={href} content={label} isDisabled={!isCollapsed} placement="right">
            <Link href={href}>
              <Button
                variant={pathname === href ? 'solid' : 'light'}
                color="primary"
                startContent={<Icon size={18} />}
                className={clsx('w-full justify-start', {
                  'justify-center': isCollapsed,
                })}
              >
                {!isCollapsed && label}
              </Button>
            </Link>
          </Tooltip>
        ))}

        {/* Grupo: Equipe */}
        <div>
          <Button
            variant="light"
            color="default"
            onClick={() => toggleGroup('staff')}
            startContent={<UsersIcon size={18} />}
            endContent={
              !isCollapsed && (
                <ChevronDownIcon
                  size={16}
                  className={clsx('transition-transform', {
                    'rotate-180': openGroups.staff,
                  })}
                />
              )
            }
            className={clsx('w-full justify-start', {
              'justify-center': isCollapsed,
            })}
          >
            {!isCollapsed && 'Equipe'}
          </Button>
          {!isCollapsed && openGroups.staff && (
            <div className="pl-6 mt-1 space-y-1">
              {staffItems.map(({ label, icon: Icon, href }) => (
                <Link key={href} href={href}>
                  <Button
                    variant={pathname === href ? 'solid' : 'light'}
                    color="primary"
                    startContent={<Icon size={16} />}
                    className="w-full justify-start text-sm"
                  >
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Grupo: Outros */}
        {!isCollapsed && (
          <div className="mt-2 space-y-1">
            {maintenanceItems.map(({ label, icon: Icon, href }) => (
              <Link key={href} href={href}>
                <Button
                  variant={pathname === href ? 'solid' : 'light'}
                  color="primary"
                  startContent={<Icon size={18} />}
                  className="w-full justify-start"
                >
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Rodapé: Theme + Logout */}
      <div className="pt-4 mt-auto flex flex-col gap-2">
        <ThemeSwitch />

        <Button
          variant="light"
          color="danger"
          startContent={<LogOutIcon size={18} />}
          className={clsx('w-full justify-start', {
            'justify-center': isCollapsed,
          })}
        >
          {!isCollapsed && 'Sair'}
        </Button>
      </div>
    </Card>
  )
}

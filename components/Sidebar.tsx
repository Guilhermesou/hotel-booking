'use client'

import { useEffect, useState } from 'react'
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
  LogOutIcon,
  MenuIcon,
  XIcon,
  CalendarIcon
} from 'lucide-react'

import { Button } from '@heroui/button'
import { Card, Tooltip } from '@heroui/react'
import { ThemeSwitch } from './theme-switch'
import { HotelSelector } from './HotelSelector'
import { useSession } from 'next-auth/react'

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    staff: true,
  })

  // Detectar se é mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Fechar menu mobile ao navegar
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const navItems = [
  { label: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
  { label: 'Hóspedes', icon: UsersIcon, href: '/dashboard/guests' },
  { label: 'Quartos', icon: BedIcon, href: '/dashboard/rooms' },
  { label: 'Reservas', icon: CalendarIcon, href: '/dashboard/reservations' }, // 🔥 Aqui
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

  // Botão do menu mobile
  const MobileMenuButton = () => (
    <Button
      isIconOnly
      size="sm"
      variant="light"
      className="md:hidden fixed top-4 left-4 z-50 bg-content1 shadow-md"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
    </Button>
  )

  // Overlay para mobile
  const MobileOverlay = () => (
    isMobileMenuOpen && (
      <div
        className="md:hidden fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )
  )

  return (
    <>
      <MobileMenuButton />
      <MobileOverlay />
      
      <Card
        className={clsx(
          'min-h-screen rounded-none shadow-none border-r border-divider bg-content1 flex flex-col transition-all duration-300',
          // Desktop
          !isMobile && (isCollapsed ? 'w-20 p-2' : 'w-64 p-4'),
          // Mobile
          isMobile && 'fixed left-0 top-0 z-50 w-72 p-4',
          isMobile && (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full')
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {(!isCollapsed || isMobile) && (
            <h2 className="text-2xl font-bold px-2">Admin</h2>
          )}
          {!isMobile && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
            </Button>
          )}
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ label, icon: Icon, href }) => (
            <Tooltip 
              key={href} 
              content={label} 
              isDisabled={!isCollapsed || isMobile} 
              placement="right"
            >
              <Link href={href}>
                <Button
                  variant={pathname === href ? 'solid' : 'light'}
                  color="primary"
                  startContent={<Icon size={18} />}
                  className={clsx('w-full justify-start', {
                    'justify-center': isCollapsed && !isMobile,
                  })}
                >
                  {(!isCollapsed || isMobile) && label}
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
                (!isCollapsed || isMobile) && (
                  <ChevronDownIcon
                    size={16}
                    className={clsx('transition-transform', {
                      'rotate-180': openGroups.staff,
                    })}
                  />
                )
              }
              className={clsx('w-full justify-start', {
                'justify-center': isCollapsed && !isMobile,
              })}
            >
              {(!isCollapsed || isMobile) && 'Equipe'}
            </Button>
            {(!isCollapsed || isMobile) && openGroups.staff && (
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
          {(!isCollapsed || isMobile) && (
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
        <div className="pt-4 mt-auto flex flex-col gap-3">
          <ThemeSwitch />
          <div className='h-px w-full bg-divider'></div>
          <HotelSelector />
          <Button
            variant="light"
            color="danger"
            startContent={<LogOutIcon size={18} />}
            className={clsx('w-full justify-start', {
              'justify-center': isCollapsed && !isMobile,
            })}
          >
            {(!isCollapsed || isMobile) && 'Sair'}
          </Button>
        </div>
      </Card>
    </>
  )
}
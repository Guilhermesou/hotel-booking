import { useHotelStore } from "@/stores/useHotelStore";
import { HomeIcon, UsersIcon, BedIcon, CalendarIcon, SettingsIcon, AlarmClockIcon, ClipboardListIcon, WrenchIcon, BarChartIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export const useDashboardPageController = () => {
    const pathname = usePathname();
  const { selectedHotel } = useHotelStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    staff: true,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: HomeIcon,
      href: "/dashboard",
    },
    {
      label: "Hóspedes",
      icon: UsersIcon,
      href: "/dashboard/guests",
    },
    {
      label: "Quartos",
      icon: BedIcon,
      href: "/dashboard/rooms",
    },
    {
      label: "Reservas",
      icon: CalendarIcon,
      href: "/dashboard/reservations",
    },
  ];

  const staffItems = [
    {
      label: "Início",
      icon: SettingsIcon,
      href: "/dashboard/staff",
    },
    {
      label: "Escalas",
      icon: AlarmClockIcon,
      href: "/dashboard/staff/shifts",
    },
    {
      label: "Tarefas",
      icon: ClipboardListIcon,
      href: "/dashboard/staff/tasks",
    },
  ];

  const maintenanceItems = [
    {
      label: "Manutenção",
      icon: WrenchIcon,
      href: "/dashboard/maintenance",
    },
    {
      label: "Relatórios",
      icon: BarChartIcon,
      href: "/dashboard/reports",
    },
  ];

  return {
    pathname,
    selectedHotel,
    isCollapsed,
    isMobileMenuOpen,
    openGroups,
    isMobile,
    navItems,
    staffItems,
    maintenanceItems,
    setIsMobileMenuOpen,
    setIsCollapsed,
    toggleGroup
  }
}
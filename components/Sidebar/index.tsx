"use client";

import Link from "next/link";
import clsx from "clsx";
import {
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  LogOutIcon,
  MenuIcon,
  XIcon
} from "lucide-react";
import { Button } from "@heroui/button";
import { Card, Tooltip } from "@heroui/react";

import { ThemeSwitch } from "../theme-switch";
import { HotelSelector } from "../HotelSelector";

import { signOut } from "next-auth/react";
import { useDashboardPageController } from "./useDashboardPageController";

export default function Sidebar() {
  const {
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
  } = useDashboardPageController();

  const MobileMenuButton = () => (
    <Button
      isIconOnly
      className="md:hidden fixed top-4 left-4 z-50 bg-content1 shadow-md"
      size="sm"
      variant="light"
      onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
    </Button>
  );

  const MobileOverlay = () =>
    isMobileMenuOpen && (
      <div
        className="md:hidden fixed inset-0 bg-black/50 z-40"
        role="button"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    );

  return (
    <>
      <MobileMenuButton />
      <MobileOverlay />

      <Card
        className={clsx(
          "min-h-screen rounded-none shadow-none border-r border-divider bg-content1 flex flex-col transition-all duration-300",
          !isMobile && (isCollapsed ? "w-20 p-2" : "w-64 p-4"),
          isMobile && "fixed left-0 top-0 z-50 w-72 p-4",
          isMobile &&
            (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"),
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {(!isCollapsed || isMobile) && (
            <h2 className="text-2xl font-bold px-2 truncate max-w-[180px]">
              {selectedHotel?.name || "Hotel Flow Admin"}
            </h2>
          )}
          {!isMobile && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRightIcon size={18} />
              ) : (
                <ChevronLeftIcon size={18} />
              )}
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
                  className={clsx(
                    `group w-full justify-start`,
                    {
                      "justify-center": isCollapsed && !isMobile,
                    },
                    pathname === href ? "bg-white" : "",
                  )}
                  startContent={
                    <Icon
                      className={`transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                      size={18}
                    />
                  }
                  variant={pathname === href ? "solid" : "light"}
                >
                  {(!isCollapsed || isMobile) && label}
                </Button>
              </Link>
            </Tooltip>
          ))}

          <div>
            <Button
              className={clsx("w-full justify-start", {
                "justify-center": isCollapsed && !isMobile,
              })}
              color="default"
              endContent={
                (!isCollapsed || isMobile) && (
                  <ChevronDownIcon
                    className={clsx("transition-transform", {
                      "rotate-180": openGroups.staff,
                    })}
                    size={16}
                  />
                )
              }
              startContent={<UsersIcon className="text-lime-500" size={18} />}
              variant="light"
              onPress={() => toggleGroup("staff")}
            >
              {(!isCollapsed || isMobile) && "Equipe"}
            </Button>
            {(!isCollapsed || isMobile) && openGroups.staff && (
              <div className="pl-6 mt-1 space-y-1">
                {staffItems.map(({ label, icon: Icon, href }) => (
                  <Link key={href} href={href}>
                    <Button
                      className="w-full justify-start text-sm"
                      color="primary"
                      startContent={<Icon size={16} />}
                      variant={pathname === href ? "solid" : "light"}
                    >
                      {label}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Outros */}
          {(!isCollapsed || isMobile) && (
            <div className="mt-2 space-y-1">
              {maintenanceItems.map(({ label, icon: Icon, href }) => (
                <Link key={href} href={href}>
                  <Button
                    className="w-full justify-start"
                    color="primary"
                    startContent={<Icon size={18} />}
                    variant={pathname === href ? "solid" : "light"}
                  >
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="pt-4 mt-auto flex flex-col gap-3">
          <ThemeSwitch />
          <div className="h-px w-full bg-divider" />
          <HotelSelector />
          <Button
            className={clsx("w-full justify-start", {
              "justify-center": isCollapsed && !isMobile,
            })}
            color="danger"
            startContent={<LogOutIcon size={18} />}
            variant="light"
            onPress={() => signOut()}
          >
            {(!isCollapsed || isMobile) && "Sair"}
          </Button>
        </div>
      </Card>
    </>
  );
}

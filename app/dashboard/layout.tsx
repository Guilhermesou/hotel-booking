"use client";

import { usePathname } from "next/navigation";

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-background text-foreground md:ml-0">
        {/* Espaçamento extra no topo para mobile (devido ao botão do menu) */}
        <div className="md:hidden h-12" />
        {children}
      </main>
    </div>
  );
}

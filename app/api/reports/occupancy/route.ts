// app/api/reports/occupancy/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const total = await prisma.room.count();
  const available = await prisma.room.count({ where: { status: "AVAILABLE" } });
  const occupied = await prisma.room.count({ where: { status: "OCCUPIED" } });
  const maintenance = await prisma.room.count({
    where: { status: "MAINTENANCE" },
  });

  return NextResponse.json({
    total,
    available,
    occupied,
    maintenance,
    occupancyRate: ((occupied / total) * 100).toFixed(2),
  });
}

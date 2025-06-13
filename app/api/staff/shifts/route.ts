import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  const { staffId, date, startTime, endTime } = data;

  try {
    const shift = await prisma.workShift.create({
      data: {
        staffId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar escala" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const shifts = await prisma.workShift.findMany({
    include: {
      staff: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return NextResponse.json(shifts);
}

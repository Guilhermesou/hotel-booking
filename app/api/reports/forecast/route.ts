import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    const next30Days = new Date();

    next30Days.setDate(today.getDate() + 30);

    // Ocupação prevista para os próximos 30 dias
    const upcomingReservations = await prisma.reservation.findMany({
      where: {
        checkIn: {
          gte: today,
          lte: next30Days,
        },
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
      },
      include: {
        room: true,
      },
    });

    // Receita prevista
    let projectedRevenue = 0;
    for (const reservation of upcomingReservations) {
      const nights = Math.ceil(
        (new Date(reservation.checkOut).getTime() -
          new Date(reservation.checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const room = await prisma.room.findUnique({
        where: {
          id: reservation.roomId,
        },
      });
      projectedRevenue += Number(nights) * Number(room?.pricePerNight ?? 0);
    }


    // Taxa de ocupação por dia nos próximos 30 dias
    const totalRooms = await prisma.room.count();
    const occupancyByDay = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);

      date.setDate(today.getDate() + i);

      const occupiedRooms = upcomingReservations.filter((reservation) => {
        const checkIn = new Date(reservation.checkIn);
        const checkOut = new Date(reservation.checkOut);

        return date >= checkIn && date < checkOut;
      }).length;

      occupancyByDay.push({
        date: date.toISOString().split("T")[0],
        occupancyRate: (occupiedRooms / totalRooms) * 100,
        occupiedRooms,
      });
    }

    return NextResponse.json({
      projectedRevenue,
      upcomingReservations: upcomingReservations.length,
      occupancyByDay,
      averageOccupancy:
        occupancyByDay.reduce((sum, day) => sum + day.occupancyRate, 0) / 30,
    });
  } catch (error) {
    console.error("Erro ao buscar previsões:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

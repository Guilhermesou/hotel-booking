import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get("period") || "30"; // últimos 30 dias por padrão
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - parseInt(period));

  try {
    // Receita total do período
    const reservations = await prisma.reservation.findMany({
      where: {
        status: "CHECKED_OUT",
        checkOut: {
          gte: startDate,
        },
      },
      include: {
        room: true,
      },
    });

    const totalRevenue = (
      await Promise.all(
        reservations.map(async (reservation: Reservation) => {
          const nights = Math.ceil(
            (new Date(reservation.checkOut).getTime() -
              new Date(reservation.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
          );

          const room = await prisma.room.findUnique({
            where: { id: reservation.roomId },
          });

          return room ? Number(room.pricePerNight) * nights : 0;
        })
      )
    ).reduce((sum, revenue) => sum + revenue, 0);


    // Receita por dia
    const revenueEntries = await Promise.all(
      reservations.map(async (reservation: Reservation) => {
        const date = new Date(reservation.checkOut).toISOString().split("T")[0];

        const nights = Math.ceil(
          (new Date(reservation.checkOut).getTime() -
            new Date(reservation.checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        const room = await prisma.room.findUnique({
          where: { id: reservation.roomId },
        });

        if (!room) return null;

        const revenue = Number(room.pricePerNight) * nights;

        return { date, revenue };
      })
    );

    // Agrupar os resultados em um Record<string, number>
    const revenueByDay = revenueEntries.reduce<Record<string, number>>((acc, entry: {
      date: string;
      revenue: number;
    } | null) => {
      if (!entry) return acc;

      const { date, revenue } = entry;
      acc[date] = (acc[date] || 0) + revenue;

      return acc;
    }, {});



    // ADR (Average Daily Rate) e RevPAR (Revenue Per Available Room)
    const totalRooms = await prisma.room.count();
    const totalNights = reservations.reduce((sum: number, reservation: Reservation) => {
      return (
        sum +
        Math.ceil(
          (new Date(reservation.checkOut).getTime() -
            new Date(reservation.checkIn).getTime()) /
          (1000 * 60 * 60 * 24),
        )
      );
    }, 0);

    const adr = totalNights > 0 ? totalRevenue / totalNights : 0;
    const revpar = totalRevenue / (totalRooms * parseInt(period));

    return NextResponse.json({
      totalRevenue,
      revenueByDay: Object.entries(revenueByDay).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      adr: parseFloat(adr.toFixed(2)),
      revpar: parseFloat(revpar.toFixed(2)),
      totalReservations: reservations.length,
      averageStayLength: totalNights / reservations.length || 0,
    });
  } catch (error) {
    console.error("Erro ao buscar dados de receita:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

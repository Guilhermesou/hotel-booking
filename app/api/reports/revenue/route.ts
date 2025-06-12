import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get('period') || '30'; // últimos 30 dias por padrão
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  try {
    // Receita total do período
    const reservations = await prisma.reservation.findMany({
      where: {
        status: 'CHECKED_OUT',
        checkOut: {
          gte: startDate,
        },
      },
      include: {
        room: true,
      },
    });

    const totalRevenue = reservations.reduce((sum, reservation) => {
      const nights = Math.ceil(
        (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + (Number(reservation.room.pricePerNight) * nights);
    }, 0);

    // Receita por dia
    const revenueByDay = reservations.reduce((acc, reservation) => {
      const date = new Date(reservation.checkOut).toISOString().split('T')[0];
      const nights = Math.ceil(
        (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );
      const revenue = Number(reservation.room.pricePerNight) * nights;
      
      acc[date] = (acc[date] || 0) + revenue;
      return acc;
    }, {} as Record<string, number>);

    // ADR (Average Daily Rate) e RevPAR (Revenue Per Available Room)
    const totalRooms = await prisma.room.count();
    const totalNights = reservations.reduce((sum, reservation) => {
      return sum + Math.ceil(
        (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24)
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
    console.error('Erro ao buscar dados de receita:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
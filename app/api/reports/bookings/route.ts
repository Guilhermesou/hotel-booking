import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get('period') || '30';
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  try {
    // Reservas por status
    const bookingsByStatus = await prisma.reservation.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: { id: true },
    });

    // Reservas por mês
    const bookingsByMonth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM "Reservation"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month
    `;

    // Taxa de cancelamento
    const totalBookings = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const cancelledBookings = await prisma.reservation.count({
      where: {
        status: 'CANCELLED',
        createdAt: {
          gte: startDate,
        },
      },
    });

    const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

    // Reservas por categoria de quarto
    const bookingsByRoomCategory = await prisma.reservation.groupBy({
      by: ['room', 'roomId'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: { id: true },
    });

    const roomCategories = await prisma.room.findMany({
      where: {
        id: { in: bookingsByRoomCategory.map(b => b.roomId) },
      },
      select: { id: true, category: true },
    });

    const bookingsByCategory = bookingsByRoomCategory.map(booking => {
      const room = roomCategories.find(r => r.id === booking.roomId);
      return {
        category: room?.category || 'Desconhecido',
        count: booking._count.id,
      };
    });

    return NextResponse.json({
      bookingsByStatus,
      bookingsByMonth,
      bookingsByCategory,
      cancellationRate: parseFloat(cancellationRate.toFixed(2)),
      totalBookings,
    });
  } catch (error) {
    console.error('Erro ao buscar dados de reservas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

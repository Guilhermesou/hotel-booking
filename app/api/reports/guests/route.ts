import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Hóspedes ativos (com reserva atual)
    const activeGuests = await prisma.guest.count({
      where: {
        reservations: {
          some: {
            status: 'CHECKED_IN',
          },
        },
      },
    });

    // Novos hóspedes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newGuests = await prisma.guest.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Hóspedes recorrentes
    const recurringGuests = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "Guest" g
      WHERE (
        SELECT COUNT(*)
        FROM "Reservation" r
        WHERE r."guestId" = g.id
      ) > 1
    `;

    // Top hóspedes por número de reservas
    const topGuests = await prisma.guest.findMany({
      include: {
        _count: {
          select: { reservations: true },
        },
      },
      orderBy: {
        reservations: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Opção 1: Se você tem o campo 'nationality' no seu modelo
    // Descomente as linhas abaixo se o campo existir
    /*
    const guestsByCountry = await prisma.guest.groupBy({
      by: ['nationality'],
      _count: { 
        nationality: true 
      },
      orderBy: {
        _count: {
          nationality: 'desc',
        },
      },
      take: 10,
      where: {
        nationality: {
          not: null
        }
      }
    });
    */

    // Opção 2: Se você não tem o campo 'nationality', use uma consulta alternativa
    // Por exemplo, agrupar por cidade ou país se existir no endereço
    // ou simplesmente remover esta funcionalidade por enquanto
    const guestsByCountry: any[] = [];

    // Opção 3: Se você quiser agrupar por outro campo (ex: cidade)
    // Substitua 'city' pelo campo real que existe no seu modelo
    /*
    const guestsByCity = await prisma.guest.groupBy({
      by: ['city'], // substitua pelo campo correto
      _count: { 
        id: true 
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
      where: {
        city: {
          not: null
        }
      }
    });
    */

    return NextResponse.json({
      activeGuests,
      newGuests,
      recurringGuests: Number((recurringGuests as any)[0]?.count || 0),
      topGuests: topGuests.map(guest => ({
        id: guest.id,
        name: guest.name,
        reservationCount: guest._count.reservations,
      })),
      guestsByCountry, // será um array vazio se não implementado
    });
    
  } catch (error) {
    console.error('Erro ao buscar dados de hóspedes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
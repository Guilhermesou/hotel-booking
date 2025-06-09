import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    console.log("ROOMS -> ", rooms)
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Erro ao buscar quartos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const room = await prisma.room.create({
    data: {
      number: data.number,
      category: data.category,
      status: data.status,
      pricePerNight: data.pricePerNight,
    },
  });
  return NextResponse.json(room);
}

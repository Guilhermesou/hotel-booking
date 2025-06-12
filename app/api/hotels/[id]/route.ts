import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const hotel = await prisma.hotel.findUnique({
    where: { id: Number(params.id) },
  });

  if (!hotel) {
    return NextResponse.json({ error: 'Hotel não encontrado' }, { status: 404 });
  }

  return NextResponse.json(hotel);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const data = await req.json();

  try {
    const updated = await prisma.hotel.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao atualizar hotel' }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const deleted = await prisma.hotel.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(deleted);
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao deletar hotel' }, { status: 400 });
  }
}

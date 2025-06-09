import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  const data = await req.json();

  try {
    const updated = await prisma.hotel.update({
      where: { id: params.id },
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
      where: { id: params.id },
    });

    return NextResponse.json(deleted);
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao deletar hotel' }, { status: 400 });
  }
}

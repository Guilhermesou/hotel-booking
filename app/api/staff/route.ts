import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { name, role, contact } = data;

  try {
    const staff = await prisma.staff.create({
      data: { name, role, contact },
    });
    return NextResponse.json(staff);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao criar funcionário' }, { status: 500 });
  }
}

export async function GET() {
  const staff = await prisma.staff.findMany({
    include: {
      tasks: true,
      shifts: true,
    },
  });

  return NextResponse.json(staff);
}

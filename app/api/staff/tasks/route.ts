import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: { staff: true },
    orderBy: { dueDate: 'asc' }
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { staffId, description, status, dueDate } = body;

  try {
    const task = await prisma.task.create({
      data: {
        staffId,
        description,
        status,
        dueDate: new Date(dueDate)
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar tarefa' }, { status: 500 });
  }
}

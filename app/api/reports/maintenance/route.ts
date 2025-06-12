import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Quartos em manutenção
    const roomsInMaintenance = await prisma.room.count({
      where: { status: 'MAINTENANCE' },
    });

    // Tarefas de manutenção pendentes
    const pendingTasks = await prisma.task.count({
      where: {
        status: 'PENDING',
      },
    });

    // Tarefas atrasadas
    const overdueTasks = await prisma.task.count({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: new Date(),
        },
      },
    });

    // Tempo médio de resolução de tarefas
    const completedTasks = await prisma.task.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: { not: null as any },
        createdAt: { not: null as any }, // Garantir que createdAt existe
      },
      select: {
        completedAt: true,
        createdAt: true, // Incluir createdAt no select
      },
    });

    const averageResolutionTime = completedTasks.length > 0
      ? completedTasks.reduce((sum, task) => {
          const resolutionTime = new Date(task.completedAt!).getTime() - new Date(task.createdAt).getTime();
          return sum + resolutionTime;
        }, 0) / completedTasks.length / (1000 * 60 * 60) // em horas
      : 0;

    // Tarefas por categoria - removido temporariamente
    // const tasksByCategory = [];

    return NextResponse.json({
      roomsInMaintenance,
      pendingTasks,
      overdueTasks,
      averageResolutionTime: parseFloat(averageResolutionTime.toFixed(2)),
      // tasksByCategory, // comentado temporariamente
    });
  } catch (error) {
    console.error('Erro ao buscar dados de manutenção:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
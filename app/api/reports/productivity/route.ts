import { TaskStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const start = url.searchParams.get("startDate");
  const end = url.searchParams.get("endDate");

  const where = {
    status: TaskStatus.COMPLETED,
    ...(start &&
      end && {
        dueDate: {
          gte: new Date(start),
          lte: new Date(end),
        },
      }),
  };

  const tasks = await prisma.task.groupBy({
    by: ["staffId"],
    where,
    _count: { id: true },
  });

  const staff = await prisma.staff.findMany({
    where: {
      id: { in: tasks.map((t) => t.staffId) },
    },
  });

  const result = tasks.map((task) => {
    const staffMember = staff.find((s) => s.id === task.staffId);

    return {
      staffId: task.staffId,
      name: staffMember?.name || "Desconhecido",
      completedTasks: task._count.id,
    };
  });

  return NextResponse.json(result);
}

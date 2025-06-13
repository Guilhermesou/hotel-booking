import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { Staff } from "@prisma/client";

type TaskGroup = {
  staffId: number;
  _count: { id: number };
};
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
      id: { in: tasks.map((t: TaskGroup) => t.staffId) },
    },
  });

  const result = tasks.map((task: TaskGroup) => {
    const staffMember = staff.find((s: Staff) => s.id === task.staffId);

    return {
      staffId: task.staffId,
      name: staffMember?.name || "Desconhecido",
      completedTasks: task._count.id,
    };
  });

  return NextResponse.json(result);
}

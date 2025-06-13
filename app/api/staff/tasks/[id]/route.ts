import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { extractIdFromUrl } from "@/lib/utils/extractId";

export async function PATCH(req: NextRequest) {
  const id = extractIdFromUrl(req.url, "tasks");

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const { status } = await req.json();

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao atualizar tarefa" },
      { status: 500 },
    );
  }
}

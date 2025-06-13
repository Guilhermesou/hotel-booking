import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Função auxiliar para extrair o ID da URL
function extractRoomId(request: NextRequest): number | null {
  const segments = new URL(request.url).pathname.split("/");
  const idStr = segments[segments.indexOf("rooms") + 1];
  const id = parseInt(idStr);

  return isNaN(id) ? null : id;
}

export async function PUT(request: NextRequest) {
  const id = extractRoomId(request);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const data = await request.json();

  const updated = await prisma.room.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const id = extractRoomId(request);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  await prisma.room.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

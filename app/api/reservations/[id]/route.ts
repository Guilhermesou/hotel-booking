import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

// Função auxiliar para extrair ID da URL
function extractId(request: NextRequest): number | null {
  const segments = new URL(request.url).pathname.split("/");
  const idStr = segments[segments.indexOf("reservations") + 1];
  const id = parseInt(idStr);

  return isNaN(id) ? null : id;
}

// PUT - Atualizar reserva
export async function PUT(request: NextRequest) {
  const id = extractId(request);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const data = await request.json();

  const overlapping = await prisma.reservation.findFirst({
    where: {
      roomId: data.roomId,
      id: { not: id },
      NOT: {
        OR: [
          { checkOut: { lte: new Date(data.checkIn) } },
          { checkIn: { gte: new Date(data.checkOut) } },
        ],
      },
    },
  });

  if (overlapping) {
    return NextResponse.json(
      { error: "Quarto já reservado para esse período" },
      { status: 400 },
    );
  }

  const reservation = await prisma.reservation.update({
    where: { id },
    data: {
      roomId: data.roomId,
      guestId: data.guestId,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      platform: data.platform,
    },
  });

  return NextResponse.json(reservation);
}

// DELETE - Deletar reserva
export async function DELETE(request: NextRequest) {
  const id = extractId(request);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  await prisma.reservation.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

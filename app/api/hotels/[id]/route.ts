import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Função auxiliar para extrair o ID da URL
function extractHotelId(request: NextRequest): number | null {
  const segments = new URL(request.url).pathname.split("/");
  const idStr = segments[segments.indexOf("hotels") + 1];
  const id = parseInt(idStr);

  return isNaN(id) ? null : id;
}

export async function GET(request: NextRequest) {
  const id = extractHotelId(request);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const hotel = await prisma.hotel.findUnique({
    where: { id },
  });

  if (!hotel) {
    return NextResponse.json(
      { error: "Hotel não encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json(hotel);
}

export async function PATCH(request: NextRequest) {
  const id = extractHotelId(request);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const data = await request.json();

  try {
    const updated = await prisma.hotel.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao atualizar hotel" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = extractHotelId(request);

  if (!id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const deleted = await prisma.hotel.delete({
      where: { id },
    });

    return NextResponse.json(deleted);
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao deletar hotel" },
      { status: 400 },
    );
  }
}

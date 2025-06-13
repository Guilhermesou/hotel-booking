import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Listar todos os hóspedes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            {
              documentNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        include: {
          documents: true,
          reservations: {
            include: {
              room: true,
            },
            orderBy: { checkIn: "desc" },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.guest.count({ where }),
    ]);

    return NextResponse.json({
      guests,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar hóspedes:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

// POST - Criar novo hóspede
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      documentType,
      documentNumber,
      phone,
      email,
      preferences,
      notes,
    } = body;

    // Validações básicas
    if (!name || !documentType || !documentNumber || !phone) {
      return NextResponse.json(
        {
          error:
            "Campos obrigatórios: name, documentType, documentNumber, phone",
        },
        { status: 400 },
      );
    }

    // Verificar se já existe hóspede com o mesmo documento
    const existingGuest = await prisma.guest.findFirst({
      where: {
        documentNumber: documentNumber,
      },
    });

    if (existingGuest) {
      return NextResponse.json(
        { error: "Já existe um hóspede com este número de documento" },
        { status: 400 },
      );
    }

    const guest = await prisma.guest.create({
      data: {
        name,
        documentType,
        documentNumber,
        phone,
        email: email || null,
        preferences: preferences || null,
        notes: notes || null,
      },
      include: {
        documents: true,
        reservations: {
          include: {
            room: true,
          },
        },
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar hóspede:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

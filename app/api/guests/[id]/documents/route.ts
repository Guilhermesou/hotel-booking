// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // GET - Listar documentos do hóspede
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const guestId = parseInt(params.id);

//     if (isNaN(guestId)) {
//       return NextResponse.json(
//         { error: 'ID inválido' },
//         { status: 400 }
//       );
//     }

//     const documents = await prisma.guestDocument.findMany({
//       where: { guestId },
//       orderBy: { createdAt: 'desc' }
//     });

//     return NextResponse.json(documents);
//   } catch (error) {
//     console.error('Erro ao buscar documentos:', error);
//     return NextResponse.json(
//       { error: 'Erro interno do servidor' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Adicionar documento
// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const guestId = parseInt(params.id);

//     if (isNaN(guestId)) {
//       return NextResponse.json(
//         { error: 'ID inválido' },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();
//     const { type, fileUrl, number, issuedAt } = body;

//     // Validações básicas
//     if (!type || !fileUrl || !number) {
//       return NextResponse.json(
//         { error: 'Campos obrigatórios: type, fileUrl, number' },
//         { status: 400 }
//       );
//     }

//     // Verificar se o hóspede existe
//     const guest = await prisma.guest.findUnique({
//       where: { id: guestId }
//     });

//     if (!guest) {
//       return NextResponse.json(
//         { error: 'Hóspede não encontrado' },
//         { status: 404 }
//       );
//     }

//     const document = await prisma.guestDocument.create({
//       data: {
//         guestId,
//         type,
//         fileUrl,
//         number,
//         issuedAt: issuedAt ? new Date(issuedAt) : null
//       }
//     });

//     return NextResponse.json(document, { status: 201 });
//   } catch (error) {
//     console.error('Erro ao criar documento:', error);
//     return NextResponse.json(
//       { error: 'Erro interno do servidor' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Listar documentos do hóspede
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").at(-2); // '/api/guests/[id]/documents'

    const guestId = parseInt(id || "");

    if (isNaN(guestId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const documents = await prisma.guestDocument.findMany({
      where: { guestId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

// POST - Adicionar documento
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").at(-2);

    const guestId = parseInt(id || "");

    if (isNaN(guestId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { type, fileUrl, number, issuedAt } = body;

    if (!type || !fileUrl || !number) {
      return NextResponse.json(
        { error: "Campos obrigatórios: type, fileUrl, number" },
        { status: 400 },
      );
    }

    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
    });

    if (!guest) {
      return NextResponse.json(
        { error: "Hóspede não encontrado" },
        { status: 404 },
      );
    }

    const document = await prisma.guestDocument.create({
      data: {
        guestId,
        type,
        fileUrl,
        number,
        issuedAt: issuedAt ? new Date(issuedAt) : null,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar documento:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Buscar hóspede por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const guest = await prisma.guest.findUnique({
      where: { id },
      include: {
        documents: {
          orderBy: { createdAt: 'desc' }
        },
        reservations: {
          include: {
            room: true,
            services: true,
            payments: true
          },
          orderBy: { checkIn: 'desc' }
        }
      }
    });

    if (!guest) {
      return NextResponse.json(
        { error: 'Hóspede não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(guest);
  } catch (error) {
    console.error('Erro ao buscar hóspede:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar hóspede
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const {
      name,
      documentType,
      documentNumber,
      phone,
      email,
      preferences,
      notes
    } = body;

    // Verificar se o hóspede existe
    const existingGuest = await prisma.guest.findUnique({
      where: { id }
    });

    if (!existingGuest) {
      return NextResponse.json(
        { error: 'Hóspede não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o documento já existe em outro hóspede
    if (documentNumber && documentNumber !== existingGuest.documentNumber) {
      const duplicateGuest = await prisma.guest.findFirst({
        where: {
          documentNumber: documentNumber,
          id: { not: id }
        }
      });

      if (duplicateGuest) {
        return NextResponse.json(
          { error: 'Já existe um hóspede com este número de documento' },
          { status: 400 }
        );
      }
    }

    const updatedGuest = await prisma.guest.update({
      where: { id },
      data: {
        name: name || existingGuest.name,
        documentType: documentType || existingGuest.documentType,
        documentNumber: documentNumber || existingGuest.documentNumber,
        phone: phone || existingGuest.phone,
        email: email !== undefined ? email : existingGuest.email,
        preferences: preferences !== undefined ? preferences : existingGuest.preferences,
        notes: notes !== undefined ? notes : existingGuest.notes
      },
      include: {
        documents: true,
        reservations: {
          include: {
            room: true
          }
        }
      }
    });

    return NextResponse.json(updatedGuest);
  } catch (error) {
    console.error('Erro ao atualizar hóspede:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar hóspede
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar se o hóspede existe
    const existingGuest = await prisma.guest.findUnique({
      where: { id },
      include: {
        reservations: true
      }
    });

    if (!existingGuest) {
      return NextResponse.json(
        { error: 'Hóspede não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se tem reservas ativas
    const activeReservations = existingGuest.reservations.filter(
      r => r.status === 'CONFIRMED' || r.status === 'CHECKED_IN'
    );

    if (activeReservations.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar hóspede com reservas ativas' },
        { status: 400 }
      );
    }

    await prisma.guest.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Hóspede deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar hóspede:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const {
    hotelName,
    cnpj,
    address,
    phone,
    hotelEmail,
    adminName,
    adminEmail,
    adminPassword,
  } = body;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    return NextResponse.json({ error: "Usuário já existe." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const hotel = await prisma.hotel.create({
    data: {
      name: hotelName,
      cnpj,
      address,
      phone,
      email: hotelEmail,
      users: {
        create: [
          {
            name: adminName,
            email: adminEmail,
            passwordHash: hashedPassword,
            role: "ADMIN",
          },
        ],
      },
    },
  });

  return NextResponse.json({
    message: "Cadastro realizado com sucesso",
    hotelId: hotel.id,
  });
}

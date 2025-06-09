import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const hotels = await prisma.hotel.findMany();
  return NextResponse.json(hotels);
}

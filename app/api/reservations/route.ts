import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Create reservation
export async function POST(req: Request) {
    const data = await req.json();

    const id = data?.roomId?.replace(/[^0-9]/g, '');
    console.log("ID -> ", id);
    // Check for overlapping reservation
    const overlapping = await prisma.reservation.findFirst({
        where: {
            roomId: parseInt(id),
            NOT: {
                OR: [
                    { checkOut: { lte: new Date(data.checkIn) } },
                    { checkIn: { gte: new Date(data.checkOut) } },
                ],
            },
        },
    })

    if (overlapping) {
        return NextResponse.json(
            { error: 'Room is already booked for this period' },
            { status: 400 }
        )
    }

    const reservation = await prisma.reservation.create({
        data: {
            checkIn: new Date(data.checkIn),
            checkOut: new Date(data.checkOut),
            platform: data.platform || 'DIRECT',
            status: data.status || 'PENDING', // or your default status
            paymentStatus: 'PENDING', // or your default payment status
            guest: {
                connect: { id: Number(data.guestId) }
            },
            room: {
                connect: { id: Number(id) }
            }
        },
    })

    return NextResponse.json(reservation)
}

// List reservations
export async function GET() {
    const reservations = await prisma.reservation.findMany({
        include: {
            room: true,
            guest: true,
        },
        orderBy: {
            checkIn: 'asc',
        },
    })

    return NextResponse.json(reservations)
}

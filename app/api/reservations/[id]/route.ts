import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

// Update reservation
export async function PUT(req: Request, { params }: Params) {
    const data = await req.json()

    const overlapping = await prisma.reservation.findFirst({
        where: {
            roomId: data.roomId,
            id: { not: Number(params.id) },
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


    const reservation = await prisma.reservation.update({
        where: { id: Number(params.id) },
        data: {
            roomId: data.roomId,
            guestId: data.guestId,
            checkIn: new Date(data.checkIn),
            checkOut: new Date(data.checkOut),
            platform: data.platform,
        },
    })

    return NextResponse.json(reservation)
}

// Delete reservation
export async function DELETE(_: Request, { params }: Params) {
    await prisma.reservation.delete({
        where: { id: Number(params.id) },
    })

    return NextResponse.json({ success: true })
}

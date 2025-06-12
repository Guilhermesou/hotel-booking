'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { Calendar, Hotel, User, Move } from 'lucide-react'
import { Card, Avatar, Chip, Divider } from '@heroui/react'
import ReservationForm from './ReservationForm'

type Reservation = {
  id: number
  guest: { name: string }
  guestId: number
  roomId: number
  checkIn: string
  checkOut: string
  platform: string
}

// type Room = {
//   id: number
//   name: string
// }

type Props = {
  rooms: Room[]
  reservations: Reservation[]
  startDate: Date
  days: number
  guests: any
  onUpdated: () => void
}

const platformConfig = {
  airbnb: { label: 'Airbnb', color: 'from-red-500 to-pink-500' },
  booking: { label: 'Booking', color: 'from-blue-500 to-blue-600' },
  vrbo: { label: 'VRBO', color: 'from-yellow-500 to-orange-500' },
  direct: { label: 'Direto', color: 'from-green-500 to-emerald-500' },
  other: { label: 'Outros', color: 'from-purple-500 to-indigo-500' },
} as const

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const formatDate = (date: Date, formatStr: 'dd' | 'MMM' | 'EEE'): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
  return { dd: day, MMM: month, EEE: weekday }[formatStr]
}

const parseISO = (dateStr: string): Date => new Date(dateStr)

const isWithinInterval = (date: Date, interval: { start: Date; end: Date }): boolean => {
  return date >= interval.start && date <= interval.end
}

const PlatformLegend = () => (
  <div className="mb-4 flex flex-wrap gap-2">
    {Object.entries(platformConfig).map(([key, { label, color }]) => (
      <Chip
        key={key}
        size="sm"
        variant="solid"
        className={`bg-gradient-to-r ${color} text-white`}
      >
        {label}
      </Chip>
    ))}
  </div>
)

export default function ReservationCalendar({ rooms, reservations, startDate, days, guests, onUpdated }: Props) {
  const dates = Array.from({ length: days }, (_, i) => addDays(startDate, i))
  const [activeId, setActiveId] = useState<number | null>(null)
  console.log("reservations -> ", reservations)
  const handleDragEnd = useCallback(async (event: any) => {
    const { over, active } = event
    if (!over) return

    const [newRoomIdStr, newDateStr] = over.id.split('|')
    const newRoomId = Number(newRoomIdStr)

    const reservation = reservations.find(r => r.id === Number(active.id))
    if (!reservation) return

    const deltaDays = (parseISO(newDateStr).getTime() - parseISO(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    const dayDiff = Math.round(deltaDays)

    const newCheckIn = addDays(parseISO(reservation.checkIn), dayDiff)
    const newCheckOut = addDays(parseISO(reservation.checkOut), dayDiff)

    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: reservation.guestId,
          roomId: newRoomId,
          checkIn: newCheckIn.toISOString(),
          checkOut: newCheckOut.toISOString(),
          platform: reservation.platform,
        }),
      })

      if (!response.ok) throw new Error('Failed to update reservation')
      setActiveId(null)
      onUpdated()
    } catch (error) {
      console.error('Error updating reservation:', error)
    }
  }, [reservations, onUpdated])

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className='flex items-center gap-3'>
            <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="bg-clip-text text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Reservas
              </h1>
              <p className="text-sm text-gray-600">Gerencie suas reservas com facilidade</p>
            </div>
          </div>
          <ReservationForm
            rooms={rooms}
            guests={guests}
            onSuccess={() => console.log("Success!")}
          />
        </div>
        <PlatformLegend />
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(Number(active.id))}
        onDragEnd={handleDragEnd}
      >
        <Card className="shadow-2xl backdrop-blur-sm">
          <div className="grid" style={{
            gridTemplateColumns: `12rem repeat(${days}, 10rem)`,
          }}>
            <div className="flex items-center gap-2 border-r p-4">
              <Hotel className="h-5 w-5" />
              <span className="font-semibold">Quartos</span>
            </div>
            {dates.map(date => (
              <div
                key={date.toISOString()}
                className="border-r p-4 text-center"
              >
                <div className="font-semibold">{formatDate(date, 'dd')}</div>
                <div className="text-sm opacity-80">{formatDate(date, 'MMM')}</div>
                <div className="text-xs opacity-60">{formatDate(date, 'EEE')}</div>
              </div>
            ))}

            {rooms.map((room, roomIndex) => {
              const roomReservations = reservations.filter(r => r.roomId === room.id)

              return (
                <div key={room.id} className="contents">
                  {/* Nome do quarto */}
                  <div className="border-r border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" name={room.number} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white" />
                      <div>
                        <p className="font-semibold">Quarto {room.number}</p>
                        {/* <p className="text-xs">Quarto {roomIndex + 1}</p> */}
                      </div>
                    </div>
                  </div>

                  {dates.map((date, dateIndex) => {
                    const dayKey = `${room.id}|${date.toISOString()}`

                    // Verifica se alguma reserva começa ou cobre este dia
                    const reservation = roomReservations.find(r => {
                      const checkIn = parseISO(r.checkIn)
                      const checkOut = parseISO(r.checkOut)
                      return date.getTime() >= checkIn.getTime() && date.getTime() < checkOut.getTime()
                    })

                    // Renderizar só no primeiro dia da reserva
                    const isStartDate = reservation && parseISO(reservation.checkIn).toDateString() === date.toDateString()

                    if (reservation && isStartDate) {
                      const checkIn = parseISO(reservation.checkIn)
                      const checkOut = parseISO(reservation.checkOut)

                      const duration = Math.ceil(
                        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
                      )

                      return (
                        <div
                          key={dayKey}
                          className={`col-span-${duration} p-2`}
                          style={{ gridColumn: `${dateIndex + 2} / span ${duration}` }}
                        >
                          <DroppableCell id={dayKey}>
                            <DraggableReservation reservation={reservation} />
                          </DroppableCell>
                        </div>
                      )
                    }

                    // Se o dia está dentro da reserva, mas não é o início, deixa a célula vazia (sem nada para não duplicar)
                    if (reservation && !isStartDate) {
                      return null // evita renderizar novamente
                    }

                    // Dia vazio
                    return (
                      <div key={dayKey} className="p-2">
                        <DroppableCell id={dayKey} />
                      </div>
                    )
                  })}


                  {roomIndex < rooms.length - 1 && <Divider className="col-span-full" />}
                </div>
              )
            })}

          </div>
        </Card>
      </DndContext>
    </div>
  )
}

function DraggableReservation({ reservation }: { reservation: Reservation }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: reservation.id,
  })

  const style: React.CSSProperties = transform
    ? {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
      position: 'relative',
      zIndex: 50,
    }
    : {}

  const checkIn = parseISO(reservation.checkIn)
  const checkOut = parseISO(reservation.checkOut)
  const duration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  const platform = platformConfig[reservation.platform.toLowerCase() as keyof typeof platformConfig] || platformConfig.other

  const roundedClass =
    duration === 1 ? 'rounded-xl' : 'rounded-l-xl rounded-r-xl'

  const formatDateTime = (date: Date) =>
    date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 cursor-grab hover:cursor-grabbing ${isDragging ? 'opacity-50 shadow-2xl' : ''}`}
    >
      <div className={`relative overflow-hidden p-3 bg-gradient-to-r ${platform.color} ${roundedClass}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-2">
            <User className="h-3 w-3 text-white/80" />
            <span className="truncate text-sm font-semibold text-white">
              {reservation.guest.name}
            </span>
          </div>

          <p className="text-xs text-white/80">
            {formatDateTime(checkIn)} → {formatDateTime(checkOut)}
          </p>

          <div className="mt-1 flex items-center justify-between">
            <Chip size="sm" variant="flat" className="bg-white/20 text-xs text-white backdrop-blur-sm">
              {duration} dia{duration > 1 ? 's' : ''}
            </Chip>
            <Chip size="sm" variant="flat" className="bg-white/30 text-xs text-white backdrop-blur-sm">
              {platform.label}
            </Chip>
          </div>
        </div>
      </div>
    </Card>
  )
}

function DroppableCell({ id, children }: { id: string; children?: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[64px] rounded-lg transition-all duration-200 ${isOver ? 'border-2 border-dashed border-green-400 bg-gradient-to-br from-green-100 to-emerald-100' : ''}`}
    >
      {children}
    </div>
  )
}

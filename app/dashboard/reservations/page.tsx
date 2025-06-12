"use client";
import ReservationCalendar from '@/components/ReservationCalendar';
import ReservationForm from '@/components/ReservationForm'
import { getGuests } from '@/lib/guests'
import { getReservations } from '@/lib/reservations';
import { getRooms } from '@/lib/rooms'
import { useHotelStore } from '@/stores/useHotelStore';
import { parseISO, startOfToday } from 'date-fns';
import { useEffect, useState } from 'react';


export default function ReservationPage() {
  const [rooms, setRooms] = useState([])
  const [reservations, setReservations] = useState([])
  const [guests, setGuests] = useState([])
  const { selectedHotel } = useHotelStore()

  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsData, reservationsData, guestsData] = await Promise.all([
          getRooms(),
          getReservations(30),
          getGuests(),
        ])
        setRooms(roomsData)
        const formattedReservations = reservationsData.map((res) => ({
          ...res,
          checkIn: parseISO(res.checkIn),
          checkOut: parseISO(res.checkOut),
        }));

        setReservations(formattedReservations)
        setGuests(guestsData.guests)
      } catch (error) {
        console.error('Failed to fetch:', error)
      }
    }

    fetchData()
  }, [selectedHotel])

  console.log("R -> ", rooms)

  return (
    <div className="p-6">
      <ReservationForm
        rooms={rooms}
        guests={guests}
        onSuccess={() => console.log('Reservation saved')}
      />
      <ReservationCalendar
        rooms={rooms}
        reservations={reservations}
        startDate={startOfToday()}
        days={30}
        // guests={guests} // Provide appropriate guests array
        onUpdated={() => { }} // Provide appropriate handler
      />
    </div>
  )
}

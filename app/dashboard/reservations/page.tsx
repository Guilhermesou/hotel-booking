"use client";
import { startOfToday } from "date-fns";
import { useEffect, useState } from "react";

import ReservationCalendar from "@/components/ReservationCalendar";
import { getGuests } from "@/lib/guests";
import { getReservations } from "@/lib/reservations";
import { getRooms } from "@/lib/rooms";
import { useHotelStore } from "@/stores/useHotelStore";

export default function ReservationPage() {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const { selectedHotel } = useHotelStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsData, reservationsData, guestsData] = await Promise.all([
          getRooms(),
          getReservations(30),
          getGuests(),
        ]);

        setRooms(roomsData);
        setReservations(reservationsData);
        setGuests(guestsData.guests);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    }

    fetchData();
  }, [selectedHotel]);

  return (
    <div className="p-6">
      <ReservationCalendar
        days={30}
        guests={guests} // Provide appropriate guests array
        reservations={reservations}
        rooms={rooms}
        startDate={
          new Date(startOfToday().setDate(startOfToday().getDate() - 1))
        }
        onUpdated={() => {}} // Provide appropriate handler
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";

import { useHotelStore } from "@/stores/useHotelStore";

export function HotelSelector() {
  const { selectedHotel, setSelectedHotel } = useHotelStore();
  const [hotels, setHotels] = useState<Hotel[]>([]);

  function handleOnChange(id: string) {
    const hotel = hotels.find((h) => h.id.toString() === id);

    if (hotel) setSelectedHotel(hotel);
  }

  useEffect(() => {
    fetch("/api/hotels")
      .then((res) => res.json())
      .then(setHotels);
  }, []);

  return (
    <Select
      defaultSelectedKeys={selectedHotel ? [] : []}
      label="Hotel Ativo"
      onChange={(e) => handleOnChange(e.target.value)}
    >
      {hotels.map((hotel) => (
        <SelectItem key={String(hotel.id + hotel.name)}>
          {hotel.name}
        </SelectItem>
      ))}
    </Select>
  );
}

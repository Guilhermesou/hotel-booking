"use client";
import { Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useHotelStore } from "@/stores/useHotelStore";
import { getHotels } from "@/lib/hotels";

function HotelListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="bg-gray-200 h-48 rounded-md" />
      ))}
    </div>
  );
}

export function HotelList() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedHotel } = useHotelStore();

  useEffect(() => {
    getHotels().then((data) => {
      setHotels(data);
      setLoading(false);
    });
  }, []);

  const handleSelect = (hotel: Hotel) => {
    console.log("Selected hotel -> ", hotel);
    setSelectedHotel(hotel);
    router.push("/dashboard");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {loading ? (
        <HotelListSkeleton />
      ) : (
        hotels.map((hotel) => (
          <Card
            key={hotel.id}
            isPressable
            className="cursor-pointer hover:shadow-lg transition"
            onPress={() => handleSelect(hotel)}
          >
            <img
              alt={hotel.name}
              className="w-full h-32 object-cover rounded-t-md"
              src={""}
            />
            <div className="p-4 text-center font-medium">{hotel.name}</div>
          </Card>
        ))
      )}
    </div>
  );
}

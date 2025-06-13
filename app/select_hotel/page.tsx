"use client";

import { HotelList } from "@/components/HotelList";

export default function SelectHotelPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Selecione um hotel
      </h1>

      <HotelList />
    </div>
  );
}

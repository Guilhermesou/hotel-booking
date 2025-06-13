import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HotelStore {
  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel) => void;
  clearHotel: () => void;
}

export const useHotelStore = create<HotelStore>()(
  persist(
    (set) => ({
      selectedHotel: null,
      setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
      clearHotel: () => set({ selectedHotel: null }),
    }),
    {
      name: "hotel-store",
    },
  ),
);

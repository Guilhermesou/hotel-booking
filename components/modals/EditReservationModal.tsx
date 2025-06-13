"use client";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
  ModalFooter,
} from "@heroui/react";
import { useState } from "react";

type Guest = { id: string; name: string };
type Room = { id: string; name: string };

type Props = {
  reservation: {
    id: string;
    guestId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    platform: string;
  };
  guests: Guest[];
  rooms: Room[];
  onUpdated: () => void;
};

export default function EditReservationModal({
  reservation,
  guests,
  rooms,
  onUpdated,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [form, setForm] = useState({ ...reservation });
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const res = await fetch(`/api/reservations/${form.id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const json = await res.json();

      setError(json.error || "Update failed");
    } else {
      setError("");
      onOpenChange();
      onUpdated();
    }
  };

  return (
    <>
      <div
        className="cursor-pointer bg-blue-500 text-white rounded px-1 text-sm truncate"
        role="button"
        onClick={onOpen}
      >
        Edit
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Edit Reservation</ModalHeader>
          <ModalBody className="space-y-4">
            <Select
              label="Room"
              selectedKeys={[form.roomId]}
              onChange={(e) => handleChange("roomId", e.target.value)}
            >
              {rooms.map((room) => (
                <SelectItem key={room.id}>{room.name}</SelectItem>
              ))}
            </Select>

            <Select
              label="Guest"
              selectedKeys={[form.guestId]}
              onChange={(e) => handleChange("guestId", e.target.value)}
            >
              {guests.map((guest) => (
                <SelectItem key={guest.id}>{guest.name}</SelectItem>
              ))}
            </Select>

            <Input
              label="Check-in"
              type="date"
              value={form.checkIn}
              onChange={(e) => handleChange("checkIn", e.target.value)}
            />
            <Input
              label="Check-out"
              type="date"
              value={form.checkOut}
              onChange={(e) => handleChange("checkOut", e.target.value)}
            />

            <Select
              label="Platform"
              selectedKeys={[form.platform]}
              onChange={(e) => handleChange("platform", e.target.value)}
            >
              <SelectItem key="DIRECT">Direct</SelectItem>
              <SelectItem key="BOOKING">Booking</SelectItem>
              <SelectItem key="AIRBNB">Airbnb</SelectItem>
              <SelectItem key="OTHER">Other</SelectItem>
            </Select>

            {error && <p className="text-danger text-sm">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onOpenChange}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

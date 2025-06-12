'use client'

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem, ModalFooter } from '@heroui/react';
import { useState } from 'react'

type ReservationFormProps = {
  rooms: Room[]
  guests: { id: string; name: string }[]
  onSuccess: () => void
}

export default function ReservationForm({ rooms, guests, onSuccess }: ReservationFormProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [form, setForm] = useState({
    roomId: '',
    guestId: '',
    checkIn: '',
    checkOut: '',
    platform: 'DIRECT',
  })
  const [error, setError] = useState('')

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.roomId || !form.guestId || !form.checkIn || !form.checkOut) {
      setError('All fields are required')
      return
    }

    const res = await fetch('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const json = await res.json()
      setError(json.error || 'Failed to create reservation')
    } else {
      setError('')
      onOpenChange()
      onSuccess()
      setForm({
        roomId: '',
        guestId: '',
        checkIn: '',
        checkOut: '',
        platform: 'DIRECT',
      })
    }
  }

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Nova reserva
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
              <ModalHeader>Criar reserva</ModalHeader>
              <ModalBody className="space-y-4">
                <Select
                  label="Quarto"
                  placeholder="Selecione um quarto"
                  selectedKeys={[form.roomId]}
                  onChange={e => handleChange('roomId', e.target.value)}
                >
                  {rooms?.map(room => (
                    <SelectItem key={"Quarto " + room.id}>
                      {"Quarto " + room.number}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Hóspede"
                  placeholder="Selectione um hóspede"
                  selectedKeys={[form.guestId]}
                  onChange={e => handleChange('guestId', e.target.value)}
                >
                  {guests?.map(guest => (
                    <SelectItem key={guest.id}>
                      {guest.name}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  type="date"
                  label="Check-in"
                  value={form.checkIn}
                  onChange={e => handleChange('checkIn', e.target.value)}
                />
                <Input
                  type="date"
                  label="Check-out"
                  value={form.checkOut}
                  onChange={e => handleChange('checkOut', e.target.value)}
                />

                <Select
                  label="Platform"
                  selectedKeys={[form.platform]}
                  onChange={e => handleChange('platform', e.target.value)}
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
                <Button color="primary" onPress={handleSubmit}>
                  Save
                </Button>
              </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

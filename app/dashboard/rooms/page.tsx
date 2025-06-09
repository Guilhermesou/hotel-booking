'use client'

import { useEffect, useState } from 'react'
import { MoreVertical, Plus } from 'lucide-react'
import { Badge, ModalContent } from '@heroui/react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Card, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, Select, SelectItem, addToast } from '@heroui/react'

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    number: '',
    category: '',
    status: 'AVAILABLE',
    pricePerNight: 100,
    doubleBeds: 0,
    singleBeds: 0,
    capacity: 1,
  })



  useEffect(() => {
    fetch('/api/rooms').then(res => res.json()).then(setRooms)
  }, [])

  useEffect(() => {
    console.log("QUARTOS -> ", rooms)
  }, [rooms])

  interface Room {
    id: number
    name: string
    capacity: number
    status: string
    // add other properties if needed
  }

  interface FormData {
    number: string
    category: string
    status: string
    pricePerNight: number
    doubleBeds: number
    singleBeds: number
    capacity: number
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const error: string = await res.text()
      console.error('Erro ao criar quarto:', error)
      addToast({ title: 'Erro', description: error, color: 'danger' })
      return
    }

    const newRoom: Room = await res.json()
    setRooms((prev: Room[]) => [...prev, newRoom])
    setForm({
      number: '',
      category: '',
      status: 'AVAILABLE',
      pricePerNight: 100,
      doubleBeds: 0,
      singleBeds: 0,
      capacity: 1,
    })
    setIsModalOpen(false)
  }

  const statusMap: Record<string, { label: string; variant: 'shadow' | 'solid' | 'flat' | 'faded' }> = {
    AVAILABLE: { label: 'Disponível', variant: 'solid' },
    OCCUPIED: { label: 'Ocupado', variant: 'faded' },
    MAINTENANCE: { label: 'Manutenção', variant: 'flat' },
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quartos</h2>
        <Button onPress={() => {
          setIsModalOpen(true)
        }
        }>
          <Plus className="w-4 h-4 mr-2" />
          Novo Quarto
        </Button>
      </div>

      {/* Lista de quartos em cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="relative p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="edit"

                    onClick={() => {
                      addToast({ title: 'Editar', description: 'Editar quarto não implementado', color: 'warning' })
                    }}
                  >
                    Editar</DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-red-500"
                    onClick={() => {
                      addToast({ title: 'Excluir', description: 'Excluir quarto não implementado', color: 'danger' })
                    }}
                  >
                    Excluir
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="text-sm text-zinc-500">Capacidade: {room.capacity} pessoa(s)</div>
            <Badge variant={statusMap[room.status]?.variant}>
              {statusMap[room.status]?.label || 'Desconhecido'}
            </Badge>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Novo Quarto</h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <Input
                placeholder="Número do quarto"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
              />
              <Input
                placeholder="Categoria"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />


              <Input
                label="Camas de casal"
                type="number"
                placeholder="1"
                value={String(form.doubleBeds)}
                onChange={(e) => setForm({ ...form, doubleBeds: parseInt(e.target.value) || 0 })}
              />

              <Input
                label="Camas de solteiro"
                type="number"
                placeholder="Camas de solteiro"
                value={String(form.singleBeds)}
                onChange={(e) => setForm({ ...form, singleBeds: parseInt(e.target.value) || 0 })}
              />

              <Input
                label="Capacidade (número de pessoas)"
                type="number"
                placeholder="Capacidade (número de pessoas)"
                value={String(form.capacity)}
                onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
              />


              <Select
                label="Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <SelectItem key="AVAILABLE">Disponível</SelectItem>
                <SelectItem key="OCCUPIED">Ocupado</SelectItem>
                <SelectItem key="MAINTENANCE">Manutenção</SelectItem>
                <SelectItem key="CLEANING">Limpeza</SelectItem>
              </Select>
              <Input
                type="number"
                placeholder="Preço por noite (R$)"
                value={String(form.pricePerNight)}
                onChange={(e) => setForm({ ...form, pricePerNight: parseFloat(e.target.value) })}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onPress={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Cadastrar</Button>
              </div>
            </form>
          </div>
        </ModalContent>
      </Modal>

    </div>
  )
}

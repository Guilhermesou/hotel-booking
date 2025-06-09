'use client'

import { useState, useEffect } from 'react'

import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Card, Select, SelectItem, Modal } from '@heroui/react'

export default function StaffPage() {
  const [form, setForm] = useState({ name: '', role: 'RECEPTION', contact: '' })
  const [staffList, setStaffList] = useState<any[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

  const fetchStaff = async () => {
    const res = await fetch('/api/staff')
    const data = await res.json()
    setStaffList(data)
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/staff/${editId}` : '/api/staff'
    const res = await fetch(url, {
      method,
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      fetchStaff()
      setForm({ name: '', role: 'RECEPTION', contact: '' })
      setEditId(null)
    }
  }

  const handleEdit = (staff: any) => {
    setForm({ name: staff.name, role: staff.role, contact: staff.contact || '' })
    setEditId(staff.id)
  }

  const confirmDelete = (id: string) => {
    setDeleteId(id)
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/staff/${deleteId}`, { method: 'DELETE' })
    if (res.ok) {
      fetchStaff()
      setDeleteId(null)
      setDeleteModalOpen(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {editId ? 'Editar Funcionário' : 'Cadastrar Funcionário'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Contato"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <Select
            value={form.role}
            onChange={(value) => setForm({ ...form, role: value })}
            label="Função"
          >
            <SelectItem value="RECEPTION">Recepção</SelectItem>
            <SelectItem value="CLEANING">Limpeza</SelectItem>
            <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
            <SelectItem value="MANAGER">Gerente</SelectItem>
          </Select>
          <div className="flex gap-2">
            <Button type="submit" className="w-full">
              {editId ? 'Salvar' : 'Cadastrar'}
            </Button>
            {editId && (
              <Button
                className="w-full"
                onClick={() => {
                  setEditId(null)
                  setForm({ name: '', role: 'RECEPTION', contact: '' })
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-2">Funcionários</h3>
        <div className="space-y-3">
          {staffList.map((s) => (
            <Card key={s.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">{s.role}</p>
                {s.contact && <p className="text-sm text-gray-500">{s.contact}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => handleEdit(s)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                
                  variant="ghost"
                  onClick={() => confirmDelete(s.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <div className="p-6 space-y-4">
          <h4 className="text-base font-medium">Confirmar Exclusão</h4>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir este funcionário?
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Modal, Select, SelectItem, Card, addToast } from '@heroui/react'
import { useTheme } from 'next-themes'

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [form, setForm] = useState({
    staffId: '',
    date: '',
    startTime: '',
    endTime: '',
  })

  const { theme } = useTheme();

  useEffect(() => {
    fetch('/api/staff').then((res) => res.json()).then(setStaffList)
    fetch('/api/staff/shifts').then((res) => res.json()).then(setShifts)
  }, [])

  const resetForm = () => {
    setForm({ staffId: '', date: '', startTime: '', endTime: '' })
    setIsEditing(false)
    setEditId(null)
  }

  const openEdit = (shift: any) => {
    setForm({
      staffId: shift.staffId,
      date: shift.date.slice(0, 10),
      startTime: shift.startTime,
      endTime: shift.endTime,
    })
    setIsEditing(true)
    setEditId(shift.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta escala?')) return
    await fetch(`/api/staff/shifts/${id}`, { method: 'DELETE' })
    setShifts((prev) => prev.filter((s) => s.id !== id))
    addToast({ title: 'Escala excluída', description: 'Escala excluída com sucesso', color: 'success' })
  }

  const validateTime = () => {
    const start = new Date(form.startTime)
    const end = new Date(form.endTime)
    return start < end
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateTime()) {
      addToast({ title: 'Erro', description: 'Horário de início deve ser antes do término.', color: 'danger' })
      return
    }

    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `/api/staff/shifts/${editId}` : '/api/staff/shifts'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (isEditing) {
      setShifts((prev) => prev.map((s) => (s.id === data.id ? data : s)))
      addToast({ title: 'Escala atualizada', description: 'Escala atualizada com sucesso', color: 'success' })
    } else {
      setShifts((prev) => [...prev, data])
      addToast({ title: 'Escala cadastrada', description: 'Escala cadastrada com sucesso', color: 'success' })
    }

    resetForm()
    setIsModalOpen(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Escala de Trabalho</h2>
        <Button onPress={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Escala
        </Button>
      </div>

      {/* Modal de Cadastro */}
      <Modal isOpen={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open)
        if (!open) resetForm()
      }}>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">
            {isEditing ? 'Editar Escala' : 'Nova Escala'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              value={form.staffId}
              onChange={(e) => setForm({ ...form, staffId: (e.target as HTMLSelectElement).value })}
            >
              <SelectItem>Selecione o funcionário</SelectItem>
              <>
                {staffList.map((s) => (
                  <SelectItem key={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </>
            </Select>

            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <Input
              type="time"
              value={form.startTime.slice(11, 16)}
              onChange={(e) =>
                setForm({
                  ...form,
                  startTime: `${form.date}T${e.target.value}`,
                })
              }
            />

            <Input
              type="time"
              value={form.endTime.slice(11, 16)}
              onChange={(e) =>
                setForm({
                  ...form,
                  endTime: `${form.date}T${e.target.value}`,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Lista estilo tabela */}
      <Card className="p-0 overflow-hidden">
        <div
          className={`grid grid-cols-4 gap-4 p-3 text-sm font-medium ${theme === 'dark' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
            }`}
        >
          <div>Funcionário</div>
          <div>Data</div>
          <div>Início - Fim</div>
          <div className="text-right">Ações</div>
        </div>
        {shifts.length === 0 && (
          <div className="p-4 text-gray-500 text-sm">Nenhuma escala cadastrada.</div>
        )}
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className="grid grid-cols-4 gap-4 items-center p-3 border-t text-sm"
          >
            <div className="font-medium">{shift.staff?.name || '—'}</div>
            <div>{new Date(shift.date).toLocaleDateString('pt-BR')}</div>
            <div>
              {new Date(shift.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {new Date(shift.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => openEdit(shift)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(shift.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

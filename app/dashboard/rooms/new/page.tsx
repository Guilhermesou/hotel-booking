'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewRoomPage() {
  const [form, setForm] = useState({ number: '', category: '', status: 'AVAILABLE', pricePerNight: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        pricePerNight: parseFloat(form.pricePerNight),
      }),
    });
    router.push('/dashboard/rooms');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <input placeholder="Número" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} className="border p-2 mb-2 w-full" />
      <input placeholder="Categoria" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border p-2 mb-2 w-full" />
      <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border p-2 mb-2 w-full">
        <option value="AVAILABLE">Disponível</option>
        <option value="OCCUPIED">Ocupado</option>
        <option value="MAINTENANCE">Manutenção</option>
      </select>
      <input type="number" placeholder="Preço por noite" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} className="border p-2 mb-4 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
    </form>
  );
}

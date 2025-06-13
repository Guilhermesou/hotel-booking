"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRoomPage() {
  const [form, setForm] = useState({
    number: "",
    category: "",
    status: "AVAILABLE",
    pricePerNight: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/rooms", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        pricePerNight: parseFloat(form.pricePerNight),
      }),
    });
    router.push("/dashboard/rooms");
  };

  return (
    <form className="max-w-md" onSubmit={handleSubmit}>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Número"
        value={form.number}
        onChange={(e) => setForm({ ...form, number: e.target.value })}
      />
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Categoria"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <select
        className="border p-2 mb-2 w-full"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="AVAILABLE">Disponível</option>
        <option value="OCCUPIED">Ocupado</option>
        <option value="MAINTENANCE">Manutenção</option>
      </select>
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Preço por noite"
        type="number"
        value={form.pricePerNight}
        onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        type="submit"
      >
        Salvar
      </button>
    </form>
  );
}

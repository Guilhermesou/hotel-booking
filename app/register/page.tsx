"use client";

import { useState } from "react";
import { Input, Button, Card } from "@heroui/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    hotelName: "",
    cnpj: "",
    address: "",
    phone: "",
    hotelEmail: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Cadastro realizado com sucesso!");
      } else {
        setMessage(data.error || "Erro no cadastro");
      }
    } catch (err) {
      setMessage("Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cadastro de Hotel</h1>

      <form onSubmit={handleSubmit} className="space-y-4 overflow-y-scroll">
        <div>
          <label className="block text-sm font-medium mb-1">Nome do Hotel</label>
          <Input
            type="text"
            name="hotelName"
            value={formData.hotelName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CNPJ</label>
          <Input
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <Input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail do Hotel</label>
          <Input
            type="email"
            name="hotelEmail"
            value={formData.hotelEmail}
            onChange={handleChange}
            required
          />
        </div>

        <hr />

        <h2 className="text-xl font-semibold">Administrador</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <Input
            type="text"
            name="adminName"
            value={formData.adminName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <Input
            type="email"
            name="adminEmail"
            value={formData.adminEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <Input
            type="password"
            name="adminPassword"
            value={formData.adminPassword}
            onChange={handleChange}
            required
          />
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </Card>
  );
}

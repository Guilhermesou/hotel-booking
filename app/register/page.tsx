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

      <form className="space-y-4 overflow-y-scroll" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="hotelName">
            Nome do Hotel
          </label>
          <Input
            required
            id="hotelName"
            name="hotelName"
            type="text"
            value={formData.hotelName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="cnpj">
            CNPJ
          </label>
          <Input
            required
            id="cnpj"
            name="cnpj"
            type="text"
            value={formData.cnpj}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="address">
            Endereço
          </label>
          <Input
            required
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Telefone
          </label>
          <Input
            required
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="hotelEmail"
          >
            E-mail do Hotel
          </label>
          <Input
            required
            id="hotelEmail"
            name="hotelEmail"
            type="email"
            value={formData.hotelEmail}
            onChange={handleChange}
          />
        </div>

        <hr />

        <h2 className="text-xl font-semibold">Administrador</h2>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="adminName">
            Nome
          </label>
          <Input
            required
            id="adminName"
            name="adminName"
            type="text"
            value={formData.adminName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="adminEmail"
          >
            E-mail
          </label>
          <Input
            required
            id="adminEmail"
            name="adminEmail"
            type="email"
            value={formData.adminEmail}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="adminPassword"
          >
            Senha
          </label>
          <Input
            required
            id="adminPassword"
            name="adminPassword"
            type="password"
            value={formData.adminPassword}
            onChange={handleChange}
          />
        </div>

        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          isLoading={loading}
          type="submit"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </Card>
  );
}

"use client";
import { signIn } from "next-auth/react"; // ⬅️ importe aqui
import { useState } from "react";
import { Input, Button, Card } from "@heroui/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const { setSelectedHotel } = useHotelStore();

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
    setMessage("");

    const res = await signIn("credentials", {
      redirect: false, // não redireciona automaticamente
      email: formData.email,
      password: formData.password,
    });

    if (res?.ok) {
      setMessage("Login realizado com sucesso!");
      window.location.href = "/select_hotel"; // ⬅️ redireciona manualmente
    } else {
      setMessage("E-mail ou senha inválidos.");
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-2xl font-bold">Login</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">E-mail</label>
          <Input
            required
            id={"email"}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Senha</label>
          <Input
            required
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          isLoading={loading}
          type="submit"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </Card>
  );
}

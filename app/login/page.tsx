"use client";
import { signIn } from "next-auth/react"; // ⬅️ importe aqui

import { useState } from "react";
import { Input, Button, Card } from "@heroui/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage("Login realizado com sucesso!");
//         // setToken(data.token);

//       } else {
//         setMessage(data.error || "Erro no login");
//       }
//     } catch (err) {
//       setMessage("Erro inesperado");
//     } finally {
//       setLoading(false);
//     }
//   };

  // LoginPage


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
    window.location.href = "/dashboard"; // ⬅️ redireciona manualmente
  } else {
    setMessage("E-mail ou senha inválidos.");
  }

  setLoading(false);
};

return (
    <Card className="max-w-md mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-2xl font-bold">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </Card>
  );
}

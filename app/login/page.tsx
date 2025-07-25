"use client";

import { Input, Button, Link } from "@heroui/react";
import { useLoginController } from "./useLoginController";

export default function LoginPage() {
  const { form, loading, message } = useLoginController();

  return (
    <div className="flex flex-col gap-6 h-full mx-auto">
      <div className=" flex justify-center items-center">
        <img
          src="./login_logo.png"
          alt="logo"
          className="h-80 w-80"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex flex-col p-6 gap-4  justify-center">
        <h1 className="text-2xl font-bold text-center">Entre na sua conta</h1>

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
          <form.Field
            name="email"
            children={(field) => (
              <>
                <label className="block text-sm font-medium mb-1" htmlFor="email">E-mail</label>
                <Input
                  required
                  id={"email"}
                  name="email"
                  type="email"
                  placeholder="email@hotel.com"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <>
                <label className="block text-sm font-medium mb-1" htmlFor="password">Senha</label>
                <Input
                  required
                  id="password"
                  name="password"
                  type="password"
                  placeholder="12345678"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </>
            )}


          />

          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            isLoading={form.state.isSubmitting}
            type="submit"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <p className="text-center text-sm mt-2">{message}</p>

          <p className="text-center text-xs mt-2">Ainda não possui uma conta? <Link href="/login/register" className="text-blue-600 font-bold text-xs">Faça um teste de 30 dias gratuitamente</Link></p>
        </form>
      </div>
    </div>
  );
}

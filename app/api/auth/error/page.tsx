// app/auth/error/page.tsx

"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Erro no login</h1>
      <p className="mt-4 text-red-500">{"Algo deu errado."}</p>
    </div>
  );
}

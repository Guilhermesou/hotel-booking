"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const documentTypes = [
  { key: "CPF", label: "CPF" },
  { key: "RG", label: "RG" },
  { key: "PASSPORT", label: "Passaporte" },
  { key: "CNH", label: "CNH" },
  { key: "OTHER", label: "Outro" },
];

interface GuestDocument {
  id: number;
  type: string;
  fileUrl: string;
  number: string;
  issuedAt: string | null;
  createdAt: string;
}

interface Guest {
  id: number;
  name: string;
  email: string | null;
  documentType: string;
  documentNumber: string;
  phone: string;
  preferences: string | null;
  notes: string | null;
  documents: GuestDocument[];
  // Pode ter outras propriedades
}

export default function EditGuestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    documentType: "",
    documentNumber: "",
    preferences: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchGuest();
  }, [id]);

  async function fetchGuest() {
    try {
      setLoading(true);
      const response = await fetch(`/api/guests/${id}`);

      if (!response.ok) {
        router.push("/dashboard/guests");

        return;
      }
      const data = await response.json();

      setGuest(data);
      setFormData({
        name: data.name,
        email: data.email || "",
        phone: data.phone,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        preferences: data.preferences || "",
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Erro ao carregar hóspede:", error);
      router.push("/dashboard/guests");
    } finally {
      setLoading(false);
    }
  }

  function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  }

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.documentType)
      newErrors.documentType = "Tipo de documento é obrigatório";
    if (!formData.documentNumber.trim())
      newErrors.documentNumber = "Número do documento é obrigatório";
    if (formData.email && !isValidEmail(formData.email))
      newErrors.email = "Email inválido";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/guests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          email: formData.email || null,
          preferences: formData.preferences || null,
          notes: formData.notes || null,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard/guests");
      } else {
        if (data.error && data.error.includes("documento")) {
          setErrors({ documentNumber: data.error });
        } else {
          alert(data.error || "Erro ao atualizar hóspede");
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar hóspede:", error);
      alert("Erro ao atualizar hóspede");
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  if (loading && !guest) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/guests">
          <Button isIconOnly variant="light">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Hóspede</h1>
          <p className="text-gray-600">Atualize as informações do hóspede</p>
        </div>
      </div>
    </div>
  );
}

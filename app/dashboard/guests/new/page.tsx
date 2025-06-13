'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
  Textarea
} from '@heroui/react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const documentTypes = [
  { key: 'CPF', label: 'CPF' },
  { key: 'RG', label: 'RG' },
  { key: 'PASSPORT', label: 'Passaporte' },
  { key: 'CNH', label: 'CNH' },
  { key: 'OTHER', label: 'Outro' }
];

export default function NewGuestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    documentType: '',
    documentNumber: '',
    preferences: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.documentType) {
      newErrors.documentType = 'Tipo de documento é obrigatório';
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'Número do documento é obrigatório';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          email: formData.email || null,
          preferences: formData.preferences || null,
          notes: formData.notes || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard/guests');
      } else {
        if (data.error) {
          if (data.error.includes('documento')) {
            setErrors({ documentNumber: data.error });
          } else {
            alert(data.error);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao criar hóspede:', error);
      alert('Erro ao criar hóspede');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/guests">
          <Button isIconOnly variant="light">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Hóspede</h1>
          <p className="text-gray-600">Cadastre um novo hóspede</p>
        </div>
      </div>

      <Card>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                  isRequired
                />
                
                <Input
                  label="Email"
                  placeholder="Digite o email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                />
                
                <Input
                  label="Telefone"
                  placeholder="Digite o telefone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone}
                  isRequired
                />
              </div>
            </div>

            {/* Documentação */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Documentação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Tipo de Documento"
                  placeholder="Selecione o tipo"
                  selectedKeys={formData.documentType ? [formData.documentType] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    handleInputChange('documentType', value);
                  }}
                  isInvalid={!!errors.documentType}
                  errorMessage={errors.documentType}
                  isRequired
                >
                  {documentTypes.map((type) => (
                    <SelectItem key={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
                
                <Input
                  label="Número do Documento"
                  placeholder="Digite o número"
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                  isInvalid={!!errors.documentNumber}
                  errorMessage={errors.documentNumber}
                  isRequired
                />
              </div>
            </div>

            {/* Preferências e Observações */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações Adicionais</h3>
              <div className="space-y-4">
                <Textarea
                  label="Preferências"
                  placeholder="Ex: Quarto silencioso, cama de casal, andar alto..."
                  value={formData.preferences}
                  onChange={(e) => handleInputChange('preferences', e.target.value)}
                  minRows={2}
                />
                
                <Textarea
                  label="Observações"
                  placeholder="Observações gerais sobre o hóspede..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  minRows={2}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Link href="/dashboard/guests" className="flex-1">
                <Button
                  variant="light"
                  className="w-full"
                  isDisabled={loading}
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                color="primary"
                className="flex-1"
                startContent={<Save size={16} />}
                isLoading={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Hóspede'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
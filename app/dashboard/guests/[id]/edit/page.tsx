// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import {
//   Card,
//   CardBody,
//   Input,
//   Button,
//   Select,
//   SelectItem,
//   Textarea,
//   Spinner,
//   Divider,
//   Chip,
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   useDisclosure
// } from '@heroui/react';
// import { ArrowLeft, Save, Upload, Eye, Trash2, FileText } from 'lucide-react';
// import Link from 'next/link';

// const documentTypes = [
//   { key: 'CPF', label: 'CPF' },
//   { key: 'RG', label: 'RG' },
//   { key: 'PASSPORT', label: 'Passaporte' },
//   { key: 'CNH', label: 'CNH' },
//   { key: 'OTHER', label: 'Outro' }
// ];

// interface Guest {
//   id: number;
//   name: string;
//   email: string | null;
//   documentType: string;
//   documentNumber: string;
//   phone: string;
//   preferences: string | null;
//   notes: string | null;
//   documents: GuestDocument[];
//   reservations: any[];
// }

// interface GuestDocument {
//   id: number;
//   type: string;
//   fileUrl: string;
//   number: string;
//   issuedAt: string | null;
//   createdAt: string;
// }

// export default function EditGuestPage() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id as string;
  
//   const [guest, setGuest] = useState<Guest | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     documentType: '',
//     documentNumber: '',
//     preferences: '',
//     notes: ''
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [selectedDocument, setSelectedDocument] = useState<GuestDocument | null>(null);

//   const { isOpen: isDocumentModalOpen, onOpen: onDocumentModalOpen, onClose: onDocumentModalClose } = useDisclosure();

//   useEffect(() => {
//     fetchGuest();
//   }, [id]);

//   const fetchGuest = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/guests/${id}`);
      
//       if (response.ok) {
//         const guestData = await response.json();
//         setGuest(guestData);
//         setFormData({
//           name: guestData.name,
//           email: guestData.email || '',
//           phone: guestData.phone,
//           documentType: guestData.documentType,
//           documentNumber: guestData.documentNumber,
//           preferences: guestData.preferences || '',
//           notes: guestData.notes || ''
//         });
//       } else {
//         router.push('/dashboard/guests');
//       }
//     } catch (error) {
//       console.error('Erro ao carregar hóspede:', error);
//       router.push('/dashboard/guests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Nome é obrigatório';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Telefone é obrigatório';
//     }

//     if (!formData.documentType) {
//       newErrors.documentType = 'Tipo de documento é obrigatório';
//     }

//     if (!formData.documentNumber.trim()) {
//       newErrors.documentNumber = 'Número do documento é obrigatório';
//     }

//     if (formData.email && !isValidEmail(formData.email)) {
//       newErrors.email = 'Email inválido';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const isValidEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setSaving(true);

//     try {
//       const response = await fetch(`/api/guests/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           ...formData,
//           email: formData.email || null,
//           preferences: formData.preferences || null,
//           notes: formData.notes || null
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         router.push('/dashboard/guests');
//       } else {
//         if (data.error) {
//           if (data.error.includes('documento')) {
//             setErrors({ documentNumber: data.error });
//           } else {
//             alert(data.error);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Erro ao atualizar hóspede:', error);
//       alert('Erro ao atualizar hóspede');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'CONFIRMED':
//         return 'success';
//       case 'CHECKED_IN':
//         return 'primary';
//       case 'CHECKED_OUT':
//         return 'default';
//       case 'CANCELLED':
//         return 'danger';
//       default:
//         return 'warning';
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case 'CONFIRMED':
//         return 'Confirmada';
//       case 'CHECKED_IN':
//         return 'Check-in';
//       case 'CHECKED_OUT':
//         return 'Check-out';
//       case 'CANCELLED':
//         return 'Cancelada';
//       case 'PENDING':
//         return 'Pendente';
//       default:
//         return status;
//     }
//   };

//   if (loading && !guest) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10 px-4">
//       <div className="flex items-center gap-4 mb-6">
//         <Link href="/dashboard/guests">
//           <Button isIconOnly variant="light">
//             <ArrowLeft size={20} />
//           </Button>
//         </Link>
//         <div>
//           <h1 className="text-3xl font-bold">Editar Hóspede</h1>
//           <p className="text-gray-600">Atualize as informações do hóspede</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Formulário Principal */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardBody className="p-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Informações Básicas */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Informações Bás
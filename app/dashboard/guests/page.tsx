'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  User,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  useDisclosure
} from '@heroui/react';
import { SearchIcon, PlusIcon, EyeIcon, EditIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';

interface Guest {
  id: number;
  name: string;
  email: string | null;
  documentType: string;
  documentNumber: string;
  phone: string;
  preferences: string | null;
  notes: string | null;
  documents: any[];
  reservations: any[];
}

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: 10
  });
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (searchValue) {
        params.append('search', searchValue);
      }

      const response = await fetch(`/api/guests?${params}`);
      const data = await response.json();

      if (response.ok) {
        setGuests(data.guests);
        setPagination(data.pagination);
      } else {
        console.error('Erro ao carregar hóspedes:', data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar hóspedes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedGuest) return;

    try {
      const response = await fetch(`/api/guests/${selectedGuest.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchGuests();
        onDeleteClose();
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao deletar hóspede');
      }
    } catch (error) {
      console.error('Erro ao deletar hóspede:', error);
      alert('Erro ao deletar hóspede');
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [page, searchValue]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'CHECKED_IN':
        return 'primary';
      case 'CHECKED_OUT':
        return 'default';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'CHECKED_IN':
        return 'Check-in';
      case 'CHECKED_OUT':
        return 'Check-out';
      case 'CANCELLED':
        return 'Cancelada';
      case 'PENDING':
        return 'Pendente';
      default:
        return status;
    }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'contact', label: 'Contato' },
    { key: 'document', label: 'Documento' },
    { key: 'reservations', label: 'Reservas' },
    { key: 'actions', label: 'Ações' }
  ];

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hóspedes</h1>
          <p className="text-gray-600">Gerencie os hóspedes do hotel</p>
        </div>
        <Link href="/dashboard/guests/new">
          <Button color="primary" startContent={<PlusIcon size={16} />}>
            Novo Hóspede
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardBody>
          <Input
            placeholder="Buscar hóspede por nome, email, documento ou telefone..."
            startContent={<SearchIcon size={16} />}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setPage(1);
            }}
            className="max-w-md"
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Table aria-label="Tabela de hóspedes">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={guests}
              isLoading={loading}
              emptyContent="Nenhum hóspede encontrado"
            >
              {(guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <User
                      name={guest.name}
                      description={guest.email}
                      avatarProps={{
                        name: guest.name.charAt(0),
                        size: 'sm'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{guest.phone}</span>
                      {guest.email && (
                        <span className="text-xs text-gray-500">{guest.email}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{guest.documentType}</span>
                      <span className="text-xs text-gray-500">{guest.documentNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {guest.reservations.length} reserva(s)
                      </span>
                      {guest.reservations.slice(0, 2).map((reservation, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          color={getStatusColor(reservation.status)}
                          variant="flat"
                        >
                          {getStatusText(reservation.status)}
                        </Chip>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => {
                          setSelectedGuest(guest);
                          onViewOpen();
                        }}
                      >
                        <EyeIcon size={16} />
                      </Button>
                      <Link href={`/dashboard/guests/${guest.id}/edit`}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                        >
                          <EditIcon size={16} />
                        </Button>
                      </Link>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onClick={() => {
                          setSelectedGuest(guest);
                          onDeleteOpen();
                        }}
                      >
                        <TrashIcon size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                total={pagination.pages}
                page={page}
                onChange={setPage}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal de Visualização */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h3>Detalhes do Hóspede</h3>
          </ModalHeader>
          <ModalBody>
            {selectedGuest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome</p>
                    <p>{selectedGuest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p>{selectedGuest.email || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Telefone</p>
                    <p>{selectedGuest.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Documento</p>
                    <p>{selectedGuest.documentType}: {selectedGuest.documentNumber}</p>
                  </div>
                </div>
                
                {selectedGuest.preferences && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Preferências</p>
                    <p>{selectedGuest.preferences}</p>
                  </div>
                )}
                
                {selectedGuest.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Observações</p>
                    <p>{selectedGuest.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Histórico de Reservas</p>
                  <div className="space-y-2">
                    {selectedGuest.reservations.length > 0 ? (
                      selectedGuest.reservations.map((reservation, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">Quarto {reservation.room?.number}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                            </p>
                          </div>
                          <Chip
                            size="sm"
                            color={getStatusColor(reservation.status)}
                            variant="flat"
                          >
                            {getStatusText(reservation.status)}
                          </Chip>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Nenhuma reserva encontrada</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onViewClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmação de Delete */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>
            <h3>Confirmar Exclusão</h3>
          </ModalHeader>
          <ModalBody>
            <p>Tem certeza que deseja excluir o hóspede <strong>{selectedGuest?.name}</strong>?</p>
            <p className="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onDeleteClose}>
              Cancelar
            </Button>
            <Button color="danger" onClick={handleDelete}>
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
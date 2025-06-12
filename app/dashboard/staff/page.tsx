'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Spinner,
  useDisclosure,
  User
} from '@heroui/react';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  email?: string;
  role?: string;
  phone?: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [editForm, setEditForm] = useState<Partial<Staff>>({});
  const [createForm, setCreateForm] = useState<Partial<Staff>>({
    name: '',
    email: '',
    role: '',
    phone: '',
  });

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure();

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose
  } = useDisclosure();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async () => {
    if (!selectedStaff) return;
    try {
      const res = await fetch(`/api/staff/${selectedStaff.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStaff((prev) => prev.filter((s) => s.id !== selectedStaff.id));
        onDeleteClose();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao excluir funcionário');
      }
    } catch (err) {
      console.error('Erro ao excluir funcionário:', err);
    }
  };

  const handleEdit = async () => {
    if (!selectedStaff) return;
    try {
      const res = await fetch(`/api/staff/${selectedStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        fetchStaff();
        onEditClose();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao salvar alterações');
      }
    } catch (err) {
      console.error('Erro ao editar funcionário:', err);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });

      if (res.ok) {
        fetchStaff();
        setCreateForm({ name: '', email: '', role: '', phone: '' });
        onCreateClose();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao criar funcionário');
      }
    } catch (err) {
      console.error('Erro ao criar funcionário:', err);
    }
  };

  const filteredStaff = staff.filter((s) =>
    s.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'role', label: 'Função' },
    { key: 'phone', label: 'Contato' },
    { key: 'actions', label: 'Ações' },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Funcionários</h1>
          <p className="text-gray-600">Gerencie os funcionários do hotel</p>
        </div>
        <Button color="primary" startContent={<PlusIcon size={16} />} onClick={onCreateOpen}>
          Novo Funcionário
        </Button>
      </div>

      <Card className="mb-6">
        <CardBody>
          <Input
            placeholder="Buscar funcionário por nome..."
            startContent={<SearchIcon size={16} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="max-w-md"
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Table aria-label="Tabela de funcionários">
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody
              items={filteredStaff}
              emptyContent="Nenhum funcionário encontrado"
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <User
                      name={item.name}
                      description={item.email}
                      avatarProps={{ name: item.name[0], size: 'sm' }}
                    />
                  </TableCell>
                  <TableCell>{item.role || '—'}</TableCell>
                  <TableCell>{item.phone || '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onClick={() => {
                          setSelectedStaff(item);
                          setEditForm(item);
                          onEditOpen();
                        }}
                      >
                        <EditIcon size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onClick={() => {
                          setSelectedStaff(item);
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
        </CardBody>
      </Card>

      {/* Modal de Criação */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="md" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h3>Novo Funcionário</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nome"
                value={createForm.name || ''}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                isRequired
              />
              <Input
                label="Email"
                type="email"
                value={createForm.email || ''}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              />
              <Input
                label="Função"
                value={createForm.role || ''}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
              />
              <Input
                label="Telefone"
                value={createForm.phone || ''}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onCreateClose}>Cancelar</Button>
            <Button color="primary" onClick={handleCreate}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Edição */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="md" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h3>Editar Funcionário</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nome"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                isRequired
              />
              <Input
                label="Email"
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
              <Input
                label="Função"
                value={editForm.role || ''}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              />
              <Input
                label="Telefone"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onEditClose}>Cancelar</Button>
            <Button color="primary" onClick={handleEdit}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>
            <h3>Confirmar Exclusão</h3>
          </ModalHeader>
          <ModalBody>
            <p>Tem certeza que deseja excluir o funcionário <strong>{selectedStaff?.name}</strong>?</p>
            <p className="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onDeleteClose}>Cancelar</Button>
            <Button color="danger" onClick={handleDelete}>Excluir</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

// // app/dashboard/page.tsx

// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { getHotels, deleteHotel, updateHotel } from "@/lib/hotels"
// import { Button } from "@heroui/button"
// import { Input } from "@heroui/input"
// import { Card } from "@heroui/react"

// interface Hotel {
//   id: string
//   name: string
//   email: string
//   cnpj: string
//   address: string
//   phone: string
// }

// export default function DashboardPage() {
//   const [hotels, setHotels] = useState<Hotel[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const router = useRouter()



//   useEffect(() => {
//     const fetchHotels = async () => {
//       try {
//         const res = await getHotels()
//         setHotels(res)
//       } catch (err) {
//         console.error("Erro ao carregar hoteis", err)
//         router.push("/login")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchHotels()
//   }, [router])

//   const handleDelete = async (id: string) => {
//     if (!confirm("Tem certeza que deseja excluir este hotel?")) return

//     try {
//       await deleteHotel(id)
//       setHotels((prev) => prev.filter((hotel) => hotel.id !== id))
//     } catch (err) {
//       console.error("Erro ao excluir hotel", err)
//     }
//   }

//   const handleEdit = (hotel: Hotel) => {
//     setSelectedHotel(hotel)
//     setIsModalOpen(true)
//   }

//   const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!selectedHotel) return
//     setSelectedHotel({ ...selectedHotel, [e.target.name]: e.target.value })
//   }

//   const handleModalSave = async () => {
//     if (!selectedHotel) return
//     try {
//       const updated = await updateHotel(selectedHotel.id,selectedHotel)
//       setHotels((prev) =>
//         prev.map((h) => (h.id === updated.id ? updated : h))
//       )
//       setIsModalOpen(false)
//     } catch (err) {
//       console.error("Erro ao atualizar hotel", err)
//     }
//   }

//   if (loading) return <p className="text-center mt-10">Carregando...</p>

//   return (
//     <div className="max-w-4xl mx-auto mt-10 px-4">
//       <h1 className="text-3xl font-bold mb-6">Dashboard de Hotéis</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {hotels.map((hotel) => (
//           <Card key={hotel.id} className="p-4">
//             <h2 className="text-xl font-semibold mb-2">{hotel.name}</h2>
//             <p><strong>Email:</strong> {hotel.email}</p>
//             <p><strong>CNPJ:</strong> {hotel.cnpj}</p>
//             <p><strong>Endereço:</strong> {hotel.address}</p>
//             <p><strong>Telefone:</strong> {hotel.phone}</p>

//             <div className="mt-4 flex gap-2">
//               <Button
//                 onClick={() => handleEdit(hotel)}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
//               >
//                 Editar
//               </Button>
//               <Button
//                 onClick={() => handleDelete(hotel.id)}
//                 className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
//               >
//                 Excluir
//               </Button>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {isModalOpen && selectedHotel && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Editar Hotel</h2>
//             <form className="space-y-4">
//               <Input
//                 name="name"
//                 placeholder="Nome do Hotel"
//                 value={selectedHotel.name}
//                 onChange={handleModalChange}
//               />
//               <Input
//                 name="email"
//                 placeholder="Email"
//                 value={selectedHotel.email}
//                 onChange={handleModalChange}
//               />
//               <Input
//                 name="cnpj"
//                 placeholder="CNPJ"
//                 value={selectedHotel.cnpj}
//                 onChange={handleModalChange}
//               />
//               <Input
//                 name="address"
//                 placeholder="Endereço"
//                 value={selectedHotel.address}
//                 onChange={handleModalChange}
//               />
//               <Input
//                 name="phone"
//                 placeholder="Telefone"
//                 value={selectedHotel.phone}
//                 onChange={handleModalChange}
//               />
//             </form>
//             <div className="flex justify-end gap-2 mt-6">
//               <Button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-gray-200 hover:bg-gray-300"
//               >
//                 Cancelar
//               </Button>
//               <Button
//                 onClick={handleModalSave}
//                 className="bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 Salvar
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getHotels, deleteHotel, updateHotel } from "@/lib/hotels"
import { Button, Card, CardBody, CardHeader, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react"
import { EditIcon, TrashIcon } from "lucide-react"

interface Hotel {
  id: string
  name: string
  email: string
  cnpj: string
  address: string
  phone: string
}

export default function DashboardPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await getHotels()
        setHotels(res)
      } catch (err) {
        console.error("Erro ao carregar hoteis", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este hotel?")) return

    try {
      await deleteHotel(id)
      setHotels((prev) => prev.filter((hotel) => hotel.id !== id))
    } catch (err) {
      console.error("Erro ao excluir hotel", err)
    }
  }

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setIsModalOpen(true)
  }

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedHotel) return
    setSelectedHotel({ ...selectedHotel, [e.target.name]: e.target.value })
  }

  const handleModalSave = async () => {
    if (!selectedHotel) return
    try {
      const updated = await updateHotel(selectedHotel.id, selectedHotel)
      setHotels((prev) =>
        prev.map((h) => (h.id === updated.id ? updated : h))
      )
      setIsModalOpen(false)
    } catch (err) {
      console.error("Erro ao atualizar hotel", err)
    }
  }

  if (loading) return <p className="text-center mt-10">Carregando...</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Hotéis</h1>
        <p className="text-gray-600">Gerencie os hotéis cadastrados</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {hotels.map((hotel) => (
          <Card key={hotel.id}>
            <CardHeader className="pb-0">
              <h2 className="text-lg font-semibold">{hotel.name}</h2>
              <p className="text-sm text-gray-500">{hotel.email}</p>
            </CardHeader>
            <CardBody className="space-y-2 text-sm">
              <p><strong>CNPJ:</strong> {hotel.cnpj}</p>
              <p><strong>Endereço:</strong> {hotel.address}</p>
              <p><strong>Telefone:</strong> {hotel.phone}</p>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleEdit(hotel)}
                  startContent={<EditIcon size={16} />}
                  size="sm"
                  variant="flat"
                  color="warning"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => handleDelete(hotel.id)}
                  startContent={<TrashIcon size={16} />}
                  size="sm"
                  variant="flat"
                  color="danger"
                >
                  Excluir
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Modal de edição */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Editar Hotel</ModalHeader>
          <ModalBody className="space-y-4">
            <Input name="name" label="Nome" value={selectedHotel?.name || ''} onChange={handleModalChange} />
            <Input name="email" label="Email" value={selectedHotel?.email || ''} onChange={handleModalChange} />
            <Input name="cnpj" label="CNPJ" value={selectedHotel?.cnpj || ''} onChange={handleModalChange} />
            <Input name="address" label="Endereço" value={selectedHotel?.address || ''} onChange={handleModalChange} />
            <Input name="phone" label="Telefone" value={selectedHotel?.phone || ''} onChange={handleModalChange} />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button color="primary" onClick={handleModalSave}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

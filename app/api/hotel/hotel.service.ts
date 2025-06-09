import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function registerHotelWithAdmin(hotelData: {
  name: string
  cnpj: string
  address: string
  phone: string
  email: string
}, adminData: {
  name: string
  email: string
  password: string
}) {
  const hashedPassword = await bcrypt.hash(adminData.password, 10)

  const hotel = await prisma.hotel.create({
    data: {
      ...hotelData,
      users: {
        create: {
          name: adminData.name,
          email: adminData.email,
          passwordHash: hashedPassword,
          role: 'ADMIN'
        }
      }
    },
    include: {
      users: true
    }
  })

  return hotel
}

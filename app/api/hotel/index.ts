import { registerHotelWithAdmin } from "./hotel.service";

export async function POST(request: Request) {
  const {
    name,
    cnpj,
    address,
    phone,
    email,
    // admin: { password, name: adminName, email: adminEmail },
  } = await request.json();

  const hotel = await registerHotelWithAdmin(
    {
      name,
      cnpj,
      address,
      phone,
      email,
    },
    { ...address },
  );

  return new Response(JSON.stringify(hotel), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

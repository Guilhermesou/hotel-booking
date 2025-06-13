export async function getGuests() {
  try {
    const guests = await fetch("/api/guests");
    const data = await guests.json();

    return data;
  } catch (error) {
    console.error("Erro ao buscar hóspedes:", error);
  }
}

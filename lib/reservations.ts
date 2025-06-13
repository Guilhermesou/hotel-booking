export async function getReservations(days: number) {
  try {
    const reservations = await fetch(`/api/reservations?days=${days}`);
    const data = await reservations.json();

    return data;
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
  }
}

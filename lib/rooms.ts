export async function getRooms() {
  try {
    const rooms = await fetch("/api/rooms");
    const data = await rooms.json();

    return data;
  } catch (error) {
    console.error("Erro ao buscar quartos:", error);
  }
}

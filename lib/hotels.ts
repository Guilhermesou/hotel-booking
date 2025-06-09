export async function getHotels() {
  const res = await fetch('/api/hotels');
  if (!res.ok) throw new Error('Erro ao buscar hotéis');
  return res.json();
}

export async function updateHotel(id: string, data: Partial<{ name: string; address: string }>) {
  const res = await fetch(`/api/hotels/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar hotel');
  return res.json();
}

export async function deleteHotel(id: string) {
  const res = await fetch(`/api/hotels/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar hotel');
  return res.json();
}

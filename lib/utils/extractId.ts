// lib/utils/extractId.ts
export function extractIdFromUrl(url: string, segment: string): number | null {
  const segments = new URL(url).pathname.split("/");
  const idStr = segments[segments.indexOf(segment) + 1];
  const id = parseInt(idStr);

  return isNaN(id) ? null : id;
}

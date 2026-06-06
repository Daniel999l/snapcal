// simple fetch wrapper (if needed later)
export async function fetchHistory() {
  const res = await fetch('/api/history');
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}
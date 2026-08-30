type Sender = (data: string) => void

const connections = new Map<string, Set<Sender>>()

export function registerSSE(bookingId: string, send: Sender) {
  if (!connections.has(bookingId)) connections.set(bookingId, new Set())
  connections.get(bookingId)!.add(send)
}

export function unregisterSSE(bookingId: string, send: Sender) {
  const set = connections.get(bookingId)
  if (!set) return
  set.delete(send)
  if (set.size === 0) connections.delete(bookingId)
}

export function broadcastToChat(bookingId: string, data: unknown) {
  const senders = connections.get(bookingId)
  if (!senders?.size) return
  const payload = JSON.stringify(data)
  for (const send of senders) {
    try { send(payload) } catch { /* connection closed */ }
  }
}

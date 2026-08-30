interface PresenceEntry {
  lastSeen: Date
  isTyping: boolean
  typingAt: Date | null
}

const store = new Map<string, PresenceEntry>()

export function upsertPresence(bookingId: string, userId: string, isTyping?: boolean) {
  const key = `${bookingId}::${userId}`
  const existing = store.get(key)
  const now = new Date()
  store.set(key, {
    lastSeen: now,
    isTyping: isTyping ?? existing?.isTyping ?? false,
    typingAt: isTyping === true ? now : (existing?.typingAt ?? null),
  })
}

export function getOtherPresence(bookingId: string, myUserId: string) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  for (const [key, entry] of store.entries()) {
    if (entry.lastSeen.getTime() < cutoff) {
      store.delete(key)
      continue
    }
    const sep = key.indexOf('::')
    const bId = key.slice(0, sep)
    const uId = key.slice(sep + 2)
    if (bId === bookingId && uId !== myUserId) {
      const isTypingFresh =
        entry.isTyping && entry.typingAt != null &&
        Date.now() - entry.typingAt.getTime() < 5000
      return {
        lastSeen: entry.lastSeen.toISOString(),
        isTyping: entry.isTyping,
        isTypingFresh,
      }
    }
  }
  return null
}

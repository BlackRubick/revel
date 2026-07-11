export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateEventSlug(name: string): string {
  const base = slugify(name)
  const timestamp = Date.now().toString(36)
  return `${base}-${timestamp}`
}

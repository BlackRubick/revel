import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export default defineNitroPlugin(() => {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    })
  }
})

export const prisma = global.prisma || new PrismaClient()

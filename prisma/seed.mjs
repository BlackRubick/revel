import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Packages
  await prisma.package.upsert({
    where: { type: 'BASIC' },
    update: {},
    create: {
      type: 'BASIC',
      name: 'Básico',
      price: 500,
      features: JSON.stringify([
        'Código QR',
        'Invitación digital',
        'Confirmación de asistencia',
        'Confirmación por WhatsApp',
        'Galería digital',
      ]),
    },
  })

  await prisma.package.upsert({
    where: { type: 'INTERMEDIATE' },
    update: {},
    create: {
      type: 'INTERMEDIATE',
      name: 'Intermedio',
      price: 750,
      features: JSON.stringify([
        'QR personalizado',
        'Invitación digital interactiva',
        'Confirmación vía plataforma',
        'Asignación de mesas',
        'Pase digital QR',
        'Galería digital',
      ]),
    },
  })

  await prisma.package.upsert({
    where: { type: 'ALL_INCLUSIVE' },
    update: {},
    create: {
      type: 'ALL_INCLUSIVE',
      name: 'All Inclusive',
      price: 1500,
      features: JSON.stringify([
        'Todo el plan Intermedio',
        'Proyección de fotos en tiempo real',
        'Acceso completo a la plataforma',
        'Experiencia personalizada',
        'Soporte prioritario',
      ]),
    },
  })

  await prisma.package.upsert({
    where: { type: 'ENTERPRISE' },
    update: {},
    create: {
      type: 'ENTERPRISE',
      name: 'Empresarial',
      price: 0,
      features: JSON.stringify([
        'Diseñado para wedding planners',
        'Múltiples eventos simultáneos',
        'API dedicada',
        'White label',
        'Soporte 24/7',
      ]),
    },
  })

  // Admin user
  const adminPassword = await hash('Admin1234!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@revel.mx' },
    update: {},
    create: {
      name: 'Administrador Rével',
      email: 'admin@revel.mx',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  // Demo organizer
  const orgPassword = await hash('Organizer123!', 12)
  await prisma.user.upsert({
    where: { email: 'organizador@revel.mx' },
    update: {},
    create: {
      name: 'Organizador Demo',
      email: 'organizador@revel.mx',
      passwordHash: orgPassword,
      role: 'ORGANIZER',
      isActive: true,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\nCredenciales de acceso:')
  console.log('Admin: admin@revel.mx / Admin1234!')
  console.log('Organizador: organizador@revel.mx / Organizer123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

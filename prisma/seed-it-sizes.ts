import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const itSizes = [
  '35', '35.5', '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5',
  '40', '40.5', '41', '41.5', '42', '42.5', '43', '43.5', '44', '44.5',
  '45', '45.5', '46', '46.5', '47', '47.5', '48'
]

async function main() {
  console.log('--- Start seeding IT sizes ---')
  for (const size of itSizes) {
    const result = await prisma.sizing.upsert({
      where: {
        size_type: {
          size: size,
          type: 'IT'
        }
      },
      update: {},
      create: {
        size: size,
        type: 'IT'
      }
    })
    console.log(`Size IT ${size}: ${result.id}`)
  }
  console.log('--- Seeding finished successfully ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

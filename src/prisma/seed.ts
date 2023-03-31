import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    "email": "jane.doe@example.com",
    "id": "34075a0d-0431-424b-add0-7c893c6fe0b5",
    "name": "Jane Doe",
    "bio": "Hello, I'm Jane!",
    "password": "$2b$10$KBPVsOCqVBJBCEEzI2S9n.2exIlJoQUX4l6KLjk5pSy5TbZdmo6.O"
  },
  {
    "email": "jane@example.com",
    "id": "6f839611-79c6-46dd-826b-1be858b4584f",
    "name": "Jane",
    "bio": "Hi, I'm Jane!",
    "password": "$2b$10$jZCE1DA9pu5JQR5pkWaMouLEMjslmvzCTO2gpYWS08wkZZicLH2/6"
  }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

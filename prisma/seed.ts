import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'João',
    email: 'joao@example.com',
    bio: 'Olá, eu sou o João!',
    posts: {
      create: [
        {
          title: 'Meu primeiro post',
          content: 'Este é o conteúdo do meu primeiro post.',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Maria',
    email: 'maria@example.com',
    bio: 'Oi, eu sou a Maria!',
    posts: {
      create: [
        {
          title: 'Meu segundo post',
          content: 'Este é o conteúdo do meu segundo post.',
          published: true,
        },
        {
          title: 'Meu terceiro post',
          content: 'Este é o conteúdo do meu terceiro post.',
          published: false,
        },
      ],
    },
  },
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

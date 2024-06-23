import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@prisma.io',
      },
    });

    await prisma.user.create({
      data: {
        name: 'Bob',
        email: 'bob@prisma.io',
      },
    });
    console.log("Database seeded!");
  } else {
    console.log("Database already has records, skipping seeding.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

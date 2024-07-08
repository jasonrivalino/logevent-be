import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@prisma.io',
        password: await hash('password', 10),
      },
    });

    await prisma.user.create({
      data: {
        name: 'Bob',
        email: 'bob@prisma.io',
        password: await hash('password', 10),
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

import { Order, Product, User, Vendor, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete all data
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // Create 1 Admin
  const hashedPassword = await hash('password', 10);
  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      phone: '1234567890',
      isAdmin: true,
    },
  });

  // Create 5 Users
  const userCount = 5;
  const users: User[] = [];
  for (let i = 0; i < userCount; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i+1}@gmail.com`,
        password: hashedPassword,
        name: `User ${i+1}`,
        phone: `123456789${i+1}`,
      },
    });
    users.push(user);
  }

  // Create 5 Vendors
  const vendorCount = 5;
  const vendors: Vendor[] = [];
  for (let i = 0; i < vendorCount; i++) {
    const vendor = await prisma.vendor.create({
      data: {
        name: `Vendor ${i+1}`,
        phone: users[Math.floor(Math.random() * userCount)].phone!,
        address: `Vendor Address ${i+1}`,
      },
    });
    vendors.push(vendor);
  }

  // Create 100 Products
  const productCount = 100;
  const products: Product[] = [];
  for (let i = 0; i < productCount; i++) {
    const product = await prisma.product.create({
      data: {
        vendorId: vendors[Math.floor(Math.random() * vendorCount)].id,
        name: `Product ${i+1}`,
        specification: `Specification ${i+1}`,
        category: `Category ${i+1}`,
        price: Math.floor(Math.random() * 100000),
        description: `Description ${i+1}`,
      },
    });
    products.push(product);
  }

  // Create 100 Orders
  const orderCount = 100;
  const orders: Order[] = [];
  for (let i = 0; i < orderCount; i++) {
    const user = users[Math.floor(Math.random() * userCount)];
    const order = await prisma.order.create({
      data: {
        productId: products[Math.floor(Math.random() * productCount)].id,
        name: user.name!,
        phone: user.phone!,
        email: user.email!,
        address: `Order Address ${i+1}`,
        usageDate: new Date(),
      },
    });
    orders.push(order);
  }

  // Create 100 Reviews
  const reviewCount = 100;
  for (let i = 0; i < reviewCount; i++) {
    await prisma.review.create({
      data: {
        orderId: orders[Math.floor(Math.random() * orderCount)].id,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `Comment ${i+1}`,
      },
    });
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

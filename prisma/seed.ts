// prisma/seed.ts

// dependency modules
import { Cart, Category, Event, Item, Product, User, Vendor, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete all data with no cascade
  await prisma.faq.deleteMany();
  await prisma.visit.deleteMany();
  
  // Delete all Cart related data
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.item.deleteMany();
  await prisma.cart.deleteMany();

  // Delete all Event related data
  await prisma.bundle.deleteMany();
  await prisma.event.deleteMany();

  // Delete all Product related data
  await prisma.album.deleteMany();
  await prisma.product.deleteMany();

  // Delete all data with cascade
  await prisma.category.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // Create 1 Admin
  const hashedPassword = await hash('password', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      phone: '1234567890',
      isAdmin: true,
      isVerified: true,
    },
  });

  // Create 1 Admin Vendor
  const adminVendor = await prisma.vendor.create({
    data: {
      email: 'vendoradmin@gmail.com',
      name: 'Vendor Admin',
      phone: '1234567890',
      address: 'Vendor Admin Address',
      instagram: 'vendoradmin',
      socialMedia: 'Vendor Admin Social Media',
      documentUrl: 'https://drive.google.com/file/d/1W1gWA621MB6zq-JU3xsPni2QB8VxmaCn/view?usp=drive_link',
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
        isVerified: true,
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
        email: `vendor${i+1}@gmail.com`,
        name: `Vendor ${i+1}`,
        phone: `123456789${i+1}`,
        address: `Vendor ${i+1} Address`,
        instagram: `vendor${i+1}`,
        socialMedia: `Vendor ${i+1} Social Media`,
        documentUrl: 'https://drive.google.com/file/d/1W1gWA621MB6zq-JU3xsPni2QB8VxmaCn/view?usp=drive_link',
      },
    });
    vendors.push(vendor);
  }

  // Create 5 Product Categories
  const productCategoryCount = 5;
  const productCategories: Category[] = [];
  for (let i = 0; i < productCategoryCount; i++) {
    const productCategory = await prisma.category.create({
      data: {
        name: `Product Category ${i+1}`,
        type: 'Product',
      },
    });
    productCategories.push(productCategory);
  }

  // Create 1 Event Organizer Product
  const eventOrganizerProduct = await prisma.product.create({
    data: {
      vendorId: adminVendor.id,
      categoryId: productCategories[Math.floor(Math.random() * productCategoryCount)].id,
      name: 'Event Organizer Product',
      specification: 'Event Organizer Product Specification',
      rate: 'Daily',
      price: 0,
      description: 'Event Organizer Product Description',
      productImage: '/Image/planetarium.jpg'
    },
  });

  // Create 1 Event Organizer Cart
  const eventOrganizerCart = await prisma.cart.create({
    data: {
      userId: admin.id,
      type: 'Product',
      cartStatus: 'Checked Out'
    },
  });

  // Create 1 Event Organizer Item
  const eventOrganizerItem = await prisma.item.create({
    data: {
      cartId: eventOrganizerCart.id,
      productId: eventOrganizerProduct.id,
    },
  });

  // Create 1 Event Organizer Order
  await prisma.order.create({
    data: {
      cartId: eventOrganizerCart.id,
      name: 'Event Organizer Order',
      phone: '1234567890',
      address: 'Event Organizer Order Address',
      notes: 'Event Organizer Order Notes',
      startDate: getRandomDateWithinPastTwoMonth(),
      endDate: getRandomDateWithinPastTwoMonth(),
      orderDate: getRandomDateWithinPastTwoMonth(),
      orderStatus: 'Completed'
    },
  });

  // Create 1 Event Organizer Review
  await prisma.review.create({
    data: {
      itemId: eventOrganizerItem.id,
      rating: 5,
      comment: 'Event Organizer Review Comment',
      tag: 'Event Organizer Review Tag',
    },
  });

  // Create 100 Products
  const rates = ["Quantity", "Hourly", "Daily"];
  const images = [
    "/Image/landingpage1.jpg",
    "/Image/landingpage2.jpg",
    "/Image/landingpage3.jpg",
    "/Image/planetarium.jpg",
    "/Image/partyevent.jpg"
  ];
  const productCount = 100;
  const products: Product[] = [];
  for (let i = 0; i < productCount; i++) {
    const product = await prisma.product.create({
      data: {
        vendorId: vendors[Math.floor(Math.random() * vendorCount)].id,
        categoryId: productCategories[Math.floor(Math.random() * productCategoryCount)].id,
        name: `Product ${i+1}`,
        specification: `Specification ${i+1}`,
        rate: rates[Math.floor(Math.random() * rates.length)],
        price: Math.floor(Math.random() * 1000000),
        capacity: Math.floor(Math.random() * 1000),
        description: `Description ${i+1}`,
        productImage: images[Math.floor(Math.random() * images.length)],
      },
    });
    products.push(product);
  }

  // Create 100 Product Albums
  const albumCount = 100;
  for (let i = 0; i < albumCount; i++) {
    await prisma.album.create({
      data: {
        productId: products[Math.floor(Math.random() * productCount)].id,
        albumImage: images[Math.floor(Math.random() * images.length)],
      },
    });
  }

  // Create 5 Event Categories
  const eventCategoryCount = 5;
  const eventCategories: Category[] = [];
  for (let i = 0; i < eventCategoryCount; i++) {
    const eventCategory = await prisma.category.create({
      data: {
        name: `Event Category ${i+1}`,
        type: 'Event',
      },
    });
    eventCategories.push(eventCategory);
  }

  // Create 100 Events
  const eventCount = 100;
  const events: Event[] = [];
  for (let i = 0; i < eventCount; i++) {
    const event = await prisma.event.create({
      data: {
        categoryId: eventCategories[Math.floor(Math.random() * eventCategoryCount)].id,
        name: `Event ${i+1}`,
        price: Math.floor(Math.random() * 10000000),
        capacity: Math.floor(Math.random() * 1000),
        description: `Description ${i+1}`,
        eventImage: images[Math.floor(Math.random() * images.length)],
      },
    });
    events.push(event);
  }

  // Create 100 Event Albums
  for (let i = 0; i < albumCount; i++) {
    await prisma.album.create({
      data: {
        eventId: events[Math.floor(Math.random() * eventCount)].id,
        albumImage: images[Math.floor(Math.random() * images.length)],
      },
    });
  }

  // Create 100 Bundles
  const bundleCount = 100;
  for (let i = 0; i < bundleCount; i++) {
    await prisma.bundle.create({
      data: {
        eventId: events[Math.floor(Math.random() * eventCount)].id,
        productId: products[Math.floor(Math.random() * productCount)].id,
      },
    });
  }

  // Create 100 Carts
  const types = ["Product", "Event"];
  const cartCount = 100;
  const carts: Cart[] = [];
  for (let i = 0; i < cartCount; i++) {
    const cart = await prisma.cart.create({
      data: {
        userId: users[Math.floor(Math.random() * userCount)].id,
        type: types[Math.floor(Math.random() * types.length)],
        cartStatus: 'Checked Out'
      },
    });
    carts.push(cart);
  }

  // Create 100 Product Items
  const productItemCount = 100;
  const productItems: Item[] = [];
  for (let i = 0; i < productItemCount; i++) {
    let cart = carts[Math.floor(Math.random() * cartCount)];
    while (cart.type !== "Product") {
      cart = carts[Math.floor(Math.random() * cartCount)];
    }

    let duration: number | null = null;
    let quantity: number | null = null;
    const product = products[Math.floor(Math.random() * productCount)];
    if (product.rate === "Quantity") {
      quantity = Math.floor(Math.random() * 100);
    } else if (product.rate === "Hourly") {
      duration = Math.floor(Math.random() * 24);
    }

    const productItem = await prisma.item.create({
      data: {
        cartId: cart.id,
        productId: products[Math.floor(Math.random() * productCount)].id,
        duration: duration,
        quantity: quantity
      },
    });
    productItems.push(productItem);
  }

  // Create 100 Event Items
  const eventItemCount = 100;
  const eventItems: Item[] = [];
  for (let i = 0; i < eventItemCount; i++) {
    let cart = carts[Math.floor(Math.random() * cartCount)];
    while (cart.type !== "Event") {
      cart = carts[Math.floor(Math.random() * cartCount)];
    }

    const eventItem = await prisma.item.create({
      data: {
        cartId: cart.id,
        eventId: events[Math.floor(Math.random() * eventCount)].id,
      },
    });
    eventItems.push(eventItem);
  }

  // Create 100 Orders
  const orderCount = 100;
  for (let i = 0; i < orderCount; i++) {
    await prisma.order.create({
      data: {
        cartId: carts[i].id,
        name: `Order ${i+1}`,
        phone: `123456789${i+1}`,
        address: `Order ${i+1} Address`,
        notes: `Order ${i+1} Notes`,
        startDate: getRandomDateWithinPastTwoMonth(),
        endDate: getRandomDateWithinPastTwoMonth(),
        orderDate: getRandomDateWithinPastTwoMonth(),
        orderStatus: 'Completed'
      },
    });
  }

  // Create 100 Product Reviews
  const productReviewCount = 100;
  for (let i = 0; i < productReviewCount; i++) {
    await prisma.review.create({
      data: {
        itemId: productItems[Math.floor(Math.random() * productItemCount)].id,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `Product Review Comment ${i+1}`,
        tag: `Product Review Tag ${i+1}`,
      },
    });
  }

  // Create 100 Event Reviews
  const eventReviewCount = 100;
  for (let i = 0; i < eventReviewCount; i++) {
    await prisma.review.create({
      data: {
        itemId: eventItems[Math.floor(Math.random() * eventItemCount)].id,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `Event Review Comment ${i+1}`,
        tag: `Event Review Tag ${i+1}`,
      },
    });
  }

  // Create 5 Faqs
  const faqCount = 5;
  for (let i = 0; i < faqCount; i++) {
    await prisma.faq.create({
      data: {
        question: `Question ${i+1}`,
        answer: `Answer ${i+1}`,
      },
    });
  }

  // Create 100 Visits
  const visitCount = 100;
  for (let i = 0; i < visitCount; i++) {
    await prisma.visit.create({
      data: {
        ipAddress: `192.168.1.${Math.floor(Math.random() * 256)}`,
        visitDate: getRandomDateWithinPastWeek(),
      },
    });
  }
}

function getRandomDateWithinPastWeek() {
  const currentDate = new Date();
  const pastWeek = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
  const randomTime = pastWeek.getTime() + Math.random() * (currentDate.getTime() - pastWeek.getTime());
  return new Date(randomTime);
}

function getRandomDateWithinPastTwoMonth() {
  const currentDate = new Date();
  const pastTwoMonth = new Date(currentDate.getTime() - (60 * 24 * 60 * 60 * 1000));
  const randomTime = pastTwoMonth.getTime() + Math.random() * (currentDate.getTime() - pastTwoMonth.getTime());
  return new Date(randomTime);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

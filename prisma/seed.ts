// prisma/seed.ts

// dependency modules
import { Cart, Category, City, Event, Item, Product, User, Vendor, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete all data with no cascade
  await prisma.admin.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.setting.deleteMany();
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

  // Delete all Vendor related data
  await prisma.vendor.deleteMany();
  await prisma.city.deleteMany();

  // Delete all data with cascade
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create 1 Admin
  const hashedPassword = await hash('password', 10);
  await prisma.user.create({
    data: {
      email: 'logevent.eo@gmail.com',
      password: hashedPassword,
      name: 'Admin LogEvent',
      phone: '6289520771715',
      isAdmin: true,
      isVerified: true,
    },
  });

  // Create 4 Cities
  const cityCount = 4;
  const cities: City[] = [];
  const sampleCities = [
    {
      name: 'Jakarta',
    },
    {
      name: 'Bandung',
    },
    {
      name: 'Yogyakarta',
    },
    {
      name: 'Surabaya',
    },
  ];
  for (let i = 0; i < cityCount; i++) {
    const city = await prisma.city.create({
      data: sampleCities[i],
    });
    cities.push(city);
  }

  // Create 1 Admin Vendor
  const adminVendor = await prisma.vendor.create({
    data: {
      cityId: cities[1].id,
      email: 'logevent.eo@gmail.com',
      name: 'LogEvent',
      phone: '6289520771715',
      address: 'Jl. Ganesa No. 10 Coblong, Kota Bandung, Jawa Barat Indonesia 40132',
      instagram: 'logevent.eo',
      documentUrl: 'https://drive.google.com/file/d/1W1gWA621MB6zq-JU3xsPni2QB8VxmaCn/view?usp=drive_link',
    },
  });

  // Create 3 Users
  const userCount = 3;
  const users: User[] = [];
  const sampleUsers = [
    {
      email: 'ahmadghulamilham@gmail.com',
      password: hashedPassword,
      name: 'Ahmad Ghulam Ilham',
      phone: '1234567891',
      isVerified: true,
    },
    {
      email: 'satrianababan@gmail.com',
      password: hashedPassword,
      name: 'Satria Octavianus Nababan',
      phone: '1234567892',
      isVerified: true,
    },
    {
      email: 'jasonrivalino@gmail.com',
      password: hashedPassword,
      name: 'Jason Rivalino',
      phone: '1234567893',
      isVerified: true,
    },
  ];
  for (let i = 0; i < userCount; i++) {
    const user = await prisma.user.create({
      data: sampleUsers[i],
    });
    users.push(user);
  }

  // Create 3 Vendors
  const vendorCount = 3;
  const vendors: Vendor[] = [];
  const sampleVendors = [
    {
      cityId: cities[0].id,
      email: 'freshflora@gmail.com',
      name: 'Fresh Flora',
      phone: '1234567894',
      address: '123 Blossom Street, Greenfield',
      instagram: 'freshflora',
      socialMedia: 'Fresh Flora Official',
      documentUrl: 'https://drive.google.com/file/d/1W1gWA621MB6zq-JU3xsPni2QB8VxmaCn/view?usp=drive_link',
    },
    {
      cityId: cities[2].id,
      email: 'urbanfeast@gmail.com',
      name: 'Urban Feast',
      phone: '1234567895',
      address: '456 Market Avenue, Downtown City',
      instagram: 'urban_feast',
      socialMedia: 'Urban Feast Eatery',
      documentUrl: 'https://drive.google.com/file/d/1W1gWA621MB6zq-JU3xsPni2QB8VxmaCn/view?usp=drive_link',
    },
    {
      cityId: cities[3].id,
      email: 'techvisionary@gmail.com',
      name: 'Tech Visionary',
      phone: '1234567896',
      address: '789 Innovation Park, Silicon Valley',
      instagram: 'techvisionary',
      socialMedia: 'Tech Visionary Solutions',
      documentUrl: 'https://drive.google.com/file/d/1W1gWA621MB6zq-JU3xsPni2QB8VxmaCn/view?usp=drive_link',
    },
  ];
  for (let i = 0; i < vendorCount; i++) {
    const vendor = await prisma.vendor.create({
      data: sampleVendors[i],
    });
    vendors.push(vendor);
  }

  // Create 1 Event Organizer Category
  const eventOrganizerCategory = await prisma.category.create({
    data: {
      name: 'Event Organizer',
      fee: 0,
      type: 'Event Organizer',
    },
  });

  // Create 1 Event Organizer Product
  const eventOrganizerProduct = await prisma.product.create({
    data: {
      vendorId: adminVendor.id,
      categoryId: eventOrganizerCategory.id,
      name: 'Event Organizer',
      specification: 'Event Organizer',
      rate: 'Daily',
      price: 0,
      description: 'LogEvent juga menawarkan jasa Event Organizer profesional yang siap merancang dan mengelola event impian Anda. Tim kami yang berpengalaman akan bekerja sama dengan Anda dari tahap perencanaan hingga eksekusi, memastikan setiap detail acara Anda tertata dengan sempurna.',
      productImage: 'https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/kop8wdcpriag8h2vtwel.png'
    },
  });

  // Create 3 Event Organizer Cart
  const eventOrganizerCartCount = 3;
  const eventOrganizerCarts: Cart[] = [];
  for (let i = 0; i < eventOrganizerCartCount; i++) {
    const eventOrganizerCart = await prisma.cart.create({
      data: {
        userId: users[i].id,
        type: 'Event Organizer',
        cartStatus: 'Checked Out'
      },
    });
    eventOrganizerCarts.push(eventOrganizerCart);
  }

  // Create 3 Event Organizer Item
  const eventOrganizerItemCount = 3;
  const eventOrganizerItems: Item[] = [];
  for (let i = 0; i < eventOrganizerItemCount; i++) {
    const eventOrganizerItem = await prisma.item.create({
      data: {
        cartId: eventOrganizerCarts[i].id,
        productId: eventOrganizerProduct.id,
      },
    });
    eventOrganizerItems.push(eventOrganizerItem);
  }

  // Create 3 Event Organizer Order
  const eventOrganizerOrderCount = 3;
  const startDate1 = getRandomDateWithinPastTwoMonth();
  const endDate1 = new Date(startDate1.getTime() + 24 * 60 * 60 * 1000);
  const orderDate1 = new Date(startDate1.getTime() - 24 * 60 * 60 * 1000);
  const startDate2 = getRandomDateWithinPastTwoMonth();
  const endDate2 = new Date(startDate2.getTime() + 2 * 24 * 60 * 60 * 1000);
  const orderDate2 = new Date(startDate2.getTime() - 2 * 24 * 60 * 60 * 1000);
  const startDate3 = getRandomDateWithinPastTwoMonth();
  const endDate3 = new Date(startDate3.getTime() + 3 * 24 * 60 * 60 * 1000);
  const orderDate3 = new Date(startDate3.getTime() - 3 * 24 * 60 * 60 * 1000);
  const eventOrganizerOrderSample = [
    {
      cartId: eventOrganizerCarts[0].id,
      name: 'Ahmad Ghulam Ilham',
      phone: '1234567897',
      address: 'Jl. Sudirman No. 1, Jakarta',
      notes: 'Mohon datang 30 menit sebelum acara dimulai',
      startDate: startDate1,
      endDate: endDate1,
      orderDate: orderDate1,
      orderTotal: 2500000,
      orderStatus: 'Completed',
    },
    {
      cartId: eventOrganizerCarts[1].id,
      name: 'Satria Octavianus Nababan',
      phone: '1234567898',
      address: 'Jl. Malioboro No. 22, Yogyakarta',
      notes: 'Acara diadakan di ruang konferensi utama',
      startDate: startDate2,
      endDate: endDate2,
      orderDate: orderDate2,
      orderTotal: 4500000,
      orderStatus: 'Completed',
    },
    {
      cartId: eventOrganizerCarts[2].id,
      name: 'Jason Rivalino',
      phone: '1234567899',
      address: 'Jl. Diponegoro No. 33, Bandung',
      notes: 'Pesanan untuk acara peluncuran produk',
      startDate: startDate3,
      endDate: endDate3,
      orderDate: orderDate3,
      orderTotal: 7500000,
      orderStatus: 'Completed',
    },
  ];
  for (let i = 0; i < eventOrganizerOrderCount; i++) {
    await prisma.order.create({
      data: eventOrganizerOrderSample[i],
    });
  }

  // Create 3 Event Organizer Review
  const eventOrganizerReviewCount = 3;
  const eventOrganizerReviewSample = [
    {
      itemId: eventOrganizerItems[0].id,
      rating: 5,
      comment: 'Pelayanan sangat memuaskan, acara berjalan lancar!',
      tag: 'Pelayanan Memuaskan',
    },
    {
      itemId: eventOrganizerItems[1].id,
      rating: 5,
      comment: 'Terima kasih, acara sangat terorganisir dan sukses.',
      tag: 'Acara Sukses',
    },
    {
      itemId: eventOrganizerItems[2].id,
      rating: 5,
      comment: 'Tim yang sangat profesional dan mudah diajak kerja sama.',
      tag: 'Tim Profesional',
    },
  ];
  for (let i = 0; i < eventOrganizerReviewCount; i++) {
    await prisma.review.create({
      data: eventOrganizerReviewSample[i],
    });
  }

  // Create 3 Product Categories
  const productCategoryCount = 3;
  const productCategorySample = [
    {
      name: 'Gedung',
      fee: 1.5,
      type: 'Product',
    },
    {
      name: 'Catering',
      fee: 1.0,
      type: 'Product',
    },
    {
      name: 'Sound System',
      fee: 0.5,
      type: 'Product',
    },
  ];
  const productCategories: Category[] = [];
  for (let i = 0; i < productCategoryCount; i++) {
    const productCategory = await prisma.category.create({
      data: productCategorySample[i],
    });
    productCategories.push(productCategory);
  }

  // Create 3 Products
  const productCount = 3;
  const productSample = [
    {
      vendorId: vendors[0].id,
      categoryId: productCategories[0].id,
      name: 'Balai Sartika',
      specification: 'Multifunction Hall',
      rate: 'Daily',
      price: 2500000,
      capacity: 500,
      description: 'Balai Sartika adalah gedung serbaguna yang cocok untuk berbagai macam acara seperti seminar, konser, dan pameran.',
      productImage: 'https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/Sound_System_fueh16.png',
    },
    {
      vendorId: vendors[1].id,
      categoryId: productCategories[1].id,
      name: 'Catering Bu Daffa',
      specification: 'Food & Beverage',
      rate: 'Quantity',
      price: 30000,
      description: 'Catering Bu Daffa menyediakan berbagai macam menu makanan dan minuman untuk acara Anda.',
      productImage: 'https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/Catering_z6wsa0.png',
    },
    {
      vendorId: vendors[2].id,
      categoryId: productCategories[2].id,
      name: 'Home Theater Harman Kardon',
      specification: 'Sound System',
      rate: 'Hourly',
      price: 150000,
      description: 'Sound System adalah perangkat audio profesional yang cocok untuk acara besar seperti konser dan festival.',
      productImage: 'https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/Balai_dcrq40.png',
    },
  ];
  const products: Product[] = [];
  for (let i = 0; i < productCount; i++) {
    const product = await prisma.product.create({
      data: productSample[i],
    });
    products.push(product);
  }

  // Create 3 Product Carts
  const productCartCount = 3;
  const productCarts: Cart[] = [];
  for (let i = 0; i < productCartCount; i++) {
    const cart = await prisma.cart.create({
      data: {
        userId: users[i].id,
        type: 'Product',
        cartStatus: 'Checked Out'
      },
    });
    productCarts.push(cart);
  }

  // Create 3 Product Items
  const productItemCount = 3;
  const productItems: Item[] = [];
  for (let i = 0; i < productItemCount; i++) {
    const cart = productCarts[i];
    let duration: number | null = null;
    let quantity: number | null = null;

    const product = products[i];
    if (product.rate === "Quantity") {
      quantity = Math.floor(Math.random() * 100);
    } else if (product.rate === "Hourly") {
      duration = Math.floor(Math.random() * 24);
    }

    const productItem = await prisma.item.create({
      data: {
        cartId: cart.id,
        productId: products[i].id,
        duration: duration,
        quantity: quantity
      },
    });
    productItems.push(productItem);
  }

  // Create 3 Product Orders
  const productOrderCount = 3;
  const startDate4 = getRandomDateWithinPastTwoMonth();
  const endDate4 = new Date(startDate1.getTime() + 24 * 60 * 60 * 1000);
  const orderDate4 = new Date(startDate1.getTime() - 24 * 60 * 60 * 1000);
  const startDate5 = getRandomDateWithinPastTwoMonth();
  const endDate5 = new Date(startDate2.getTime() + 2 * 24 * 60 * 60 * 1000);
  const orderDate5 = new Date(startDate2.getTime() - 2 * 24 * 60 * 60 * 1000);
  const startDate6 = getRandomDateWithinPastTwoMonth();
  const endDate6 = new Date(startDate3.getTime() + 3 * 24 * 60 * 60 * 1000);
  const orderDate6 = new Date(startDate3.getTime() - 3 * 24 * 60 * 60 * 1000);
  const productOrderSample = [
    {
      cartId: productCarts[0].id,
      name: 'Ahmad Ghulam Ilham',
      phone: '1234567894',
      address: 'Jl. Sudirman No. 1, Jakarta',
      notes: 'Mohon Balai Sartika disiapkan untuk acara seminar',
      startDate: startDate4,
      endDate: endDate4,
      orderDate: orderDate4,
      orderTotal: products[0].price * (1 + productCategories[0].fee / 100),
      orderStatus: 'Completed',
    },
    {
      cartId: productCarts[1].id,
      name: 'Satria Octavianus Nababan',
      phone: '1234567895',
      address: 'Jl. Malioboro No. 22, Yogyakarta',
      notes: 'Mohon Catering datang 1 jam sebelum acara dimulai',
      startDate: startDate5,
      endDate: endDate5,
      orderDate: orderDate5,
      orderTotal: products[1].price * productItems[1].quantity! * (1 + productCategories[1].fee / 100),
      orderStatus: 'Completed',
    },
    {
      cartId: productCarts[2].id,
      name: 'Jason Rivalino',
      phone: '1234567896',
      address: 'Jl. Diponegoro No. 33, Bandung',
      notes: 'Mohon Home Theater Harman Kardon disiapkan untuk acara konser',
      startDate: startDate6,
      endDate: endDate6,
      orderDate: orderDate6,
      orderTotal: products[2].price * productItems[2].duration! * (1 + productCategories[2].fee / 100),
      orderStatus: 'Completed',
    },
  ];
  for (let i = 0; i < productOrderCount; i++) {
    await prisma.order.create({
      data: productOrderSample[i],
    });
  }

  // Create 3 Product Reviews
  const productReviewCount = 3;
  const productReviewSample = [
    {
      itemId: productItems[0].id,
      rating: 5,
      comment: 'Balai Sartika sangat nyaman dan cocok untuk acara seminar.',
      tag: 'Kenyamanan Gedung',
    },
    {
      itemId: productItems[1].id,
      rating: 5,
      comment: 'Catering Bu Daffa sangat enak dan pelayanan sangat baik.',
      tag: 'Kualitas Makanan',
    },
    {
      itemId: productItems[2].id,
      rating: 5,
      comment: 'Home Theater Harman Kardon memiliki kualitas suara yang sangat baik.',
      tag: 'Kualitas Suara',
    },
  ];
  for (let i = 0; i < productReviewCount; i++) {
    await prisma.review.create({
      data: productReviewSample[i],
    });
  }

  // Create 3 Event Categories
  const eventCategoryCount = 3;
  const eventCategorySample = [
    {
      name: 'Konser',
      fee: 1.5,
      type: 'Event',
    },
    {
      name: 'Pesta',
      fee: 1.0,
      type: 'Event',
    },
    {
      name: 'Seminar',
      fee: 0.5,
      type: 'Event',
    },
  ];
  const eventCategories: Category[] = [];
  for (let i = 0; i < eventCategoryCount; i++) {
    const eventCategory = await prisma.category.create({
      data: eventCategorySample[i],
    });
    eventCategories.push(eventCategory);
  }

  // Create 3 Events
  const eventCount = 3;
  const eventSample = [
    {
      categoryId: eventCategories[0].id,
      name: 'Konser Musik Indie',
      price: 3000000,
      capacity: 1000,
      description: 'Konser Musik Indie adalah acara musik yang menampilkan band-band indie terkenal di Indonesia.',
      eventImage: 'https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/Show_grvzif.png',
    },
    {
      categoryId: eventCategories[1].id,
      name: 'Ulang Tahun Minimalis',
      price: 1500000,
      capacity: 300,
      description: 'Ulang Tahun Minimalis adalah pesta ulang tahun yang sederhana namun berkesan.',
      eventImage: 'https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/Birthday_gfapbf.png',
    },
    {
      categoryId: eventCategories[2].id,
      name: 'Seminar Kewirausahaan',
      price: 4000000,
      capacity: 200,
      description: 'Seminar Kewirausahaan adalah seminar yang membahas tentang kewirausahaan dan peluang bisnis di Indonesia.',
      eventImage: 'https://res.cloudinary.com/dfauyfqjn/image/upload/v1723522709/Meeting_q87sj8.png',
    },
  ];
  const events: Event[] = [];
  for (let i = 0; i < eventCount; i++) {
    const event = await prisma.event.create({
      data: eventSample[i],
    });
    events.push(event);
  }

  // Create 3 Event Bundles
  const eventBundleCount = 3;
  const eventBundleSample = [
    {
      eventId: events[0].id,
      productId: products[0].id,
    },
    {
      eventId: events[1].id,
      productId: products[1].id,
    },
    {
      eventId: events[2].id,
      productId: products[2].id,
    },
  ];
  for (let i = 0; i < eventBundleCount; i++) {
    await prisma.bundle.create({
      data: eventBundleSample[i],
    });
  }

  // Create 3 Event Carts
  const eventCartCount = 3;
  const eventCarts: Cart[] = [];
  for (let i = 0; i < eventCartCount; i++) {
    const cart = await prisma.cart.create({
      data: {
        userId: users[i].id,
        type: 'Event',
        cartStatus: 'Checked Out'
      },
    });
    eventCarts.push(cart);
  }

  // Create 3 Event Items
  const eventItemCount = 3;
  const eventItems: Item[] = [];
  for (let i = 0; i < eventItemCount; i++) {
    let cart = eventCarts[i]

    const eventItem = await prisma.item.create({
      data: {
        cartId: cart.id,
        eventId: events[i].id,
      },
    });
    eventItems.push(eventItem);
  }

  // Create 3 Event Orders
  const eventOrderCount = 3;
  const startDate7 = getRandomDateWithinPastTwoMonth();
  const endDate7 = new Date(startDate1.getTime() + 24 * 60 * 60 * 1000);
  const orderDate7 = new Date(startDate1.getTime() - 24 * 60 * 60 * 1000);
  const startDate8 = getRandomDateWithinPastTwoMonth();
  const endDate8 = new Date(startDate2.getTime() + 2 * 24 * 60 * 60 * 1000);
  const orderDate8 = new Date(startDate2.getTime() - 2 * 24 * 60 * 60 * 1000);
  const startDate9 = getRandomDateWithinPastTwoMonth();
  const endDate9 = new Date(startDate3.getTime() + 3 * 24 * 60 * 60 * 1000);
  const orderDate9 = new Date(startDate3.getTime() - 3 * 24 * 60 * 60 * 1000);
  const eventOrderSample = [
    {
      cartId: eventCarts[0].id,
      name: 'Ahmad Ghulam Ilham',
      phone: '1234567897',
      address: 'Jl. Sudirman No. 1, Jakarta',
      notes: 'Mohon Konser Musik Indie dimulai tepat waktu',
      startDate: startDate7,
      endDate: endDate7,
      orderDate: orderDate7,
      orderTotal: events[0].price * (1 + eventCategories[0].fee / 100),
      orderStatus: 'Completed',
    },
    {
      cartId: eventCarts[1].id,
      name: 'Satria Octavianus Nababan',
      phone: '1234567898',
      address: 'Jl. Malioboro No. 22, Yogyakarta',
      notes: 'Mohon Ulang Tahun Minimalis disiapkan dekorasi minimalis',
      startDate: startDate8,
      endDate: endDate8,
      orderDate: orderDate8,
      orderTotal: 2 * events[1].price * (1 + eventCategories[1].fee / 100),
      orderStatus: 'Completed',
    },
    {
      cartId: eventCarts[2].id,
      name: 'Jason Rivalino',
      phone: '1234567899',
      address: 'Jl. Diponegoro No. 33, Bandung',
      notes: 'Pesanan untuk Seminar Kewirausahaan',
      startDate: startDate9,
      endDate: endDate9,
      orderDate: orderDate9,
      orderTotal: 3 * events[2].price * (1 + eventCategories[2].fee / 100),
      orderStatus: 'Completed',
    },
  ];
  for (let i = 0; i < eventOrderCount; i++) {
    await prisma.order.create({
      data: eventOrderSample[i],
    });
  }

  // Create 3 Event Reviews
  const eventReviewCount = 3;
  const eventReviewSample = [
    {
      itemId: eventItems[0].id,
      rating: 5,
      comment: 'Konser Musik Indie sangat seru dan penuh kejutan!',
      tag: 'Acara Seru',
    },
    {
      itemId: eventItems[1].id,
      rating: 5,
      comment: 'Ulang Tahun Minimalis sangat sederhana dan berkesan.',
      tag: 'Pesta Sederhana',
    },
    {
      itemId: eventItems[2].id,
      rating: 5,
      comment: 'Seminar Kewirausahaan sangat informatif dan bermanfaat.',
      tag: 'Seminar Bermanfaat',
    },
  ];
  for (let i = 0; i < eventReviewCount; i++) {
    await prisma.review.create({
      data: eventReviewSample[i],
    });
  }

  // Create 2 Faqs
  const faqCount = 2;
  const sampleFaqs = [
    {
      question: 'Apa itu LogEvent?',
      answer: 'LogEvent adalah penyedia jasa EventOrganizer, pemesanan logistik vendor dan Paket Logistik Event yang terintegrasi dalam sebuah  website.',
    },
    {
      question: 'Bagaimana cara menjadi mitra vendor LogEvent?',
      answer: 'Lakukan pendaftaran dengan melakukan klik pada  tombol Menjadi Vendor, lalu Anda akan diarahkan ke Admin kami untuk kesepakatan kerjasama.',
    },
  ];
  for (let i = 0; i < faqCount; i++) {
    await prisma.faq.create({
      data: sampleFaqs[i],
    });
  }

  // Create 3 Visits
  const visitCount = 3;
  for (let i = 0; i < visitCount; i++) {
    await prisma.visit.create({
      data: {
        ipAddress: `192.168.1.${i+1}`,
        visitDate: getRandomDateWithinPastWeek(),
      },
    });
  }

  // Create 1 Setting
  await prisma.setting.create({
    data: {
      description: 'Kami menghadirkan pengalaman terbaik untuk penyewaan vendor logistik event secara praktis. Dengan pilihan vendor yang handal dan produk yang berkualitas tinggi, kami memastikan bahwa setiap event Anda berjalan lancar dan sesuai harapan.',
      youtubeUrl: 'https://www.youtube.com/embed/ZZl2uAkUfHA',
      vendorCount: 3,
      productCount: 3,
      orderCount: 9,
    },
  });

  // Create 3 Admin Email
  const adminEmailCount = 3;
  const adminEmailSample = [
    {
      email: 'ahmadghulamilham@gmail.com',
    },
    {
      email: 'Satriaoctavianus28@gmail.com',
    },
    {
      email: '13521168@std.stei.itb.ac.id',
    },
  ];
  for (let i = 0; i < adminEmailCount; i++) {
    await prisma.admin.create({
      data: adminEmailSample[i],
    });
  }
}

function getRandomDateWithinPastWeek(): Date {
  const currentDate = new Date();
  const pastWeek = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
  const randomTime = pastWeek.getTime() + Math.random() * (currentDate.getTime() - pastWeek.getTime());
  return new Date(randomTime);
}

function getRandomDateWithinPastTwoMonth(): Date {
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

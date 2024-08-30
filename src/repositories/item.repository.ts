// src/repositories/item.repository.ts

// dependency modules
import { Item } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";
import { ItemEventDetail, ItemProductDetail } from "../utils/types";

class ItemRepository {
  async findAllItems(): Promise<Item[]> {
    return prisma.item.findMany();
  }

  async findAllItemsEventDetails(): Promise<ItemEventDetail[]> {
    const items = await prisma.item.findMany();
    return Promise.all(items.map(item => this.createItemEventDetail(item)));
  }

  async findAllItemsProductDetails(): Promise<ItemProductDetail[]> {
    const items = await prisma.item.findMany();
    return Promise.all(items.map(item => this.createItemProductDetail(item)));
  }

  async findItemsByCartId(cartId: number): Promise<Item[]> {
    return prisma.item.findMany({ where: { cartId } });
  }

  async findItemsEventDetailsByCartId(cartId: number): Promise<ItemEventDetail[]> {
    const items = await prisma.item.findMany({ where: { cartId } });
    return Promise.all(items.map(item => this.createItemEventDetail(item)));
  }

  async findItemsProductDetailsByCartId(cartId: number): Promise<ItemProductDetail[]> {
    const items = await prisma.item.findMany({ where: { cartId } });
    return Promise.all(items.map(item => this.createItemProductDetail(item)));
  }

  async findItemById(id: number): Promise<Item | null> {
    return prisma.item.findUnique({ where: { id } });
  }

  async createItem(data: {
    eventId: number | null;
    productId: number | null;
    cartId: number;
    duration: number | null;
    quantity: number | null;
  }): Promise<Item> {
    return prisma.item.create({ data });
  }

  async updateItem(id: number, data: Record<string, any>): Promise<Item> {
    return prisma.item.update({ where: { id }, data });
  }

  async deleteItemsByCartId(cartId: number): Promise<Item[]> {
    const itemsToDelete = await prisma.item.findMany({ where: { cartId } });
    await prisma.item.deleteMany({ where: { cartId } });
    return itemsToDelete;
  }

  async deleteItem(id: number): Promise<Item> {
    return prisma.item.delete({ where: { id } });
  }

  async createItemEventDetail(item: Item): Promise<ItemEventDetail> {
    const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    if (!item.eventId) {
      throw new Error("Item is not an event");
    }

    const event = await prisma.event.findUnique({ where: { id: item.eventId } });
    if (!event) {
      throw new Error("Event not found");
    }

    const category = await prisma.category.findUnique({ where: { id: event.categoryId } });

    const eventBundles = await prisma.bundle.findMany({ where: { eventId: event.id } });
    const productBundles = eventBundles.map((bundle) => bundle.productId);
    const bundles = await prisma.product.findMany({ where: { id: { in: productBundles } } });

    const items = await prisma.item.findMany({ where: { eventId: event.id } });
    const itemIds = items.map((item) => item.id);
    const reviews = await prisma.review.findMany({ where: { itemId: { in: itemIds } } });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    let eventRating = 0;
    if (reviews.length !== 0) {
      eventRating = totalRating / reviews.length;
    }

    const review = await prisma.review.findFirst({ where: { itemId: item.id } });
    const isReviewed = review ? true : false;

    return {
      id: item.id,
      cartId: item.cartId,
      eventId: item.eventId,
      eventName: event.name,
      eventPrice: event.price,
      eventDescription: event.description,
      eventImage: event.eventImage,
      eventBundles: bundles.map((bundle) => bundle.name).join(", "),
      eventRating: eventRating,
      categoryName: category ? category.name : "",
      categoryFee: category ? category.fee : 0,
      isReviewed,
    }
  }

  async createItemProductDetail(item: Item): Promise<ItemProductDetail> {
    const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    if (!item.productId) {
      throw new Error("Item is not a product");
    }

    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) {
      throw new Error("Product not found");
    }

    const category = await prisma.category.findUnique({ where: { id: product.categoryId } });

    const vendor = await prisma.vendor.findUnique({ where: { id: product.vendorId } });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const items = await prisma.item.findMany({ where: { productId: product.id } });
    const itemIds = items.map((item) => item.id);
    const reviews = await prisma.review.findMany({ where: { itemId: { in: itemIds } } });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    let productRating = 0;
    if (reviews.length !== 0) {
      productRating = totalRating / reviews.length;
    }

    const review = await prisma.review.findFirst({ where: { itemId: item.id } });
    const isReviewed = review ? true : false;

    return {
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      productName: product.name,
      productSpecification: product.specification,
      productPrice: product.price,
      productImage: product.productImage,
      productRating: productRating,
      vendorId: product.vendorId,
      vendorAddress: vendor.address,
      categoryName: category ? category.name : "",
      categoryFee: category ? category.fee : 0,
      duration: item.duration,
      quantity: item.quantity,
      isReviewed,
    }
  }
}

export default new ItemRepository();

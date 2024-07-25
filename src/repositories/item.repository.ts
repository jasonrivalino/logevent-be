// src/repositories/item.repository.ts

// dependency modules
import { Item } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";
import { ItemDetail } from "../utils/types";

class ItemRepository {
  async findAllItems(): Promise<Item[]> {
    return prisma.item.findMany();
  }

  async findAllItemDetails(): Promise<ItemDetail[]> {
    const items = await prisma.item.findMany();
    return Promise.all(items.map(item => this.createItemDetail(item)));
  }

  async findItemById(id: number): Promise<Item | null> {
    return prisma.item.findUnique({ where: { id } });
  }

  async findItemDetailById(id: number): Promise<ItemDetail | null> {
    const item = await prisma.item.findUnique({ where: { id } });
    return item ? this.createItemDetail(item) : null;
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

  async deleteItem(id: number): Promise<Item> {
    return prisma.item.delete({ where: { id } });
  }

  async createItemDetail(item: Item): Promise<ItemDetail> {
    const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const order = await prisma.order.findUnique({ where: { id: cart.id } });
    if (!order) {
      throw new Error("Order not found");
    }

    let subtotal = 0;
    const orderRange = Math.floor((order.endDate.getTime() - order.startDate.getTime()) / (1000 * 3600 * 24));
    if (item.eventId) {
      const event = await prisma.event.findUnique({ where: { id: item.eventId } });
      if (item.duration) {
        subtotal += event ? event.price * item.duration : 0;
      } else if (item.quantity) {
        subtotal += event ? event.price * item.quantity : 0;
      } else {
        subtotal += event ? event.price * orderRange : 0;
      }
    } else if (item.productId) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (item.duration) {
        subtotal += product ? product.price * item.duration : 0;
      } else if (item.quantity) {
        subtotal += product ? product.price * item.quantity : 0;
      } else {
        subtotal += product ? product.price * orderRange : 0;
      }
    }

    return {
      id: item.id,
      eventId: item.eventId,
      productId: item.productId,
      cartId: item.cartId,
      duration: item.duration,
      quantity: item.quantity,
      orderRange,
      subtotal
    }
  }
}

export default new ItemRepository();

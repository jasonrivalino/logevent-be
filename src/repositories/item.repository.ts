import { Item } from "@prisma/client";
import orderRepository from "./order.repository";
import userRepository from "./user.repository";
import { ItemDetails } from "../utils/types";
import prisma from "../utils/prisma";

class ItemRepository {
  async findAllItems(): Promise<ItemDetails[]> {
    const items = await prisma.item.findMany();
    return Promise.all(items.map((item) => this.createItemDetails(item)));
  }

  async findItemById(id: number): Promise<ItemDetails | null> {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return null;
    return this.createItemDetails(item);
  }

  async findItemsByOrderId(orderId: number): Promise<ItemDetails[]> {
    const items = await prisma.item.findMany({ where: { orderId } });
    return Promise.all(items.map((item) => this.createItemDetails(item)));
  }

  async findItemsByProductId(productId: number): Promise<ItemDetails[]> {
    const items = await prisma.item.findMany({ where: { productId } });
    return Promise.all(items.map((item) => this.createItemDetails(item)));
  }

  async createItem(data: {
    productId: number;
    orderId: number;
  }): Promise<Item> {
    return prisma.item.create({ data });
  }

  async updateItem(id: number, data: Record<string, any>): Promise<Item> {
    return prisma.item.update({ where: { id }, data });
  }

  async deleteItem(id: number): Promise<Item> {
    return prisma.item.delete({ where: { id } });
  }

  async getAverageRatingByProductId(productId: number): Promise<number> {
    const items = await this.findItemsByProductId(productId);
    const reviewedItems = items.filter((item) => item.reviewRating !== null);
    if (reviewedItems.length === 0) return 0;
    const totalRating = reviewedItems.reduce((acc, item) => acc + item.reviewRating!, 0);
    return totalRating / reviewedItems.length;
  }

  async getReviewCountByProductId(productId: number): Promise<number> {
    const items = await this.findItemsByProductId(productId);
    const reviews = items.filter((item) => item.reviewRating !== null);
    return reviews.length;
  }

  async getReviewByProductId(productId: number): Promise<ItemDetails[]> {
    const items = await this.findItemsByProductId(productId);
    return items.filter((item) => item.reviewRating !== null);
  }

  async createItemDetails(item: Item): Promise<ItemDetails> {
    const order = await orderRepository.findOrderById(item.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const user = await userRepository.findUserById(order.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: item.id,
      productId: item.productId,
      orderId: item.orderId,
      userName: user.name,
      userPicture: user.picture,
      reviewRating: item.reviewRating,
      reviewComment: item.reviewComment,
      reviewDate: item.reviewDate,
    };
  }
}

export default new ItemRepository();

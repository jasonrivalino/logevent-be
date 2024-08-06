// src/repositories/cart.repository.ts

// dependency modules
import { Cart } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class CartRepository {
  async findAllCarts(): Promise<Cart[]> {
    return prisma.cart.findMany();
  }

  async findCartsByUserId(userId: number): Promise<Cart[]> {
    return prisma.cart.findMany({ where: { userId } });
  }

  async findActiveEventCartByUserId(userId: number): Promise<Cart | null> {
    return prisma.cart.findFirst({
      where: {
        userId,
        type: "Event",
        cartStatus: "Active",
      },
    });
  }

  async findActiveProductCartByUserId(userId: number): Promise<Cart | null> {
    return prisma.cart.findFirst({
      where: {
        userId,
        type: "Product",
        cartStatus: "Active",
      },
    });
  }

  async findCartById(id: number): Promise<Cart | null> {
    return prisma.cart.findUnique({ where: { id } });
  }

  async createCart(data: {
    userId: number;
    type: string;
  }): Promise<Cart> {
    return prisma.cart.create({ data });
  }

  async updateCart(id: number, data: Record<string, any>): Promise<Cart> {
    return prisma.cart.update({ where: { id }, data });
  }

  async deleteCart(id: number): Promise<Cart> {
    return prisma.cart.delete({ where: { id } });
  }
}

export default new CartRepository();

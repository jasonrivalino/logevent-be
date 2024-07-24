// src/repositories/cart.repository.ts

// dependency modules
import { Cart } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class CartRepository {
  async findAllCarts(): Promise<Cart[]> {
    return prisma.cart.findMany();
  }

  async findCartById(id: number): Promise<Cart | null> {
    return prisma.cart.findUnique({ where: { id } });
  }

  async findCartByUserId(userId: number): Promise<Cart[]> {
    return prisma.cart.findMany({ where: { userId } });
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

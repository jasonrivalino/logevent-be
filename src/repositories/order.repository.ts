import { Order } from "@prisma/client";
import prisma from "../utils/prisma";

class OrderRepository {
  async findAllOrders(): Promise<Order[]> {
    return prisma.order.findMany();
  }

  async findOrderById(id: number): Promise<Order | null> {
    return prisma.order.findUnique({ where: { id } });
  }

  async findOrdersByProductId(productId: number): Promise<Order[]> {
    return prisma.order.findMany({ where: { productId } });
  }

  async createOrder(data: {
    productId: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    usageDate: Date;
    orderImage: string | null;
  }): Promise<Order> {
    return prisma.order.create({ data });
  }

  async updateOrder(id: number, data: Record<string, any>): Promise<Order> {
    return prisma.order.update({ where: { id }, data });
  }

  async deleteOrder(id: number): Promise<Order> {
    return prisma.order.delete({ where: { id } });
  }
}

export default new OrderRepository();

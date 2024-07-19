import { Order } from "@prisma/client";
import userRepository from "./user.repository";
import { OrderDetails } from "../utils/types";
import prisma from "../utils/prisma";

class OrderRepository {
  async findAllOrders(): Promise<OrderDetails[]> {
    const orders = await prisma.order.findMany();
    return Promise.all(orders.map((order) => this.createOrderDetails(order)));
  }

  async findOrderById(id: number): Promise<OrderDetails | null> {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return null;
    return this.createOrderDetails(order);
  }

  async findOrdersByUserId(userId: number): Promise<OrderDetails[]> {
    const orders = await prisma.order.findMany({ where: { userId } });
    return Promise.all(orders.map((order) => this.createOrderDetails(order)));
  }

  async createOrder(data: {
    userId: number;
    address: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Order> {
    return prisma.order.create({ data });
  }

  async updateOrder(id: number, data: Record<string, any>): Promise<Order> {
    return prisma.order.update({ where: { id }, data });
  }

  async deleteOrder(id: number): Promise<Order> {
    return prisma.order.delete({ where: { id } });
  }

  async createOrderDetails(order: Order): Promise<OrderDetails> {
    const user = await userRepository.findUserById(order.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: order.id,
      userId: order.userId,
      userEmail: user.email,
      userName: user.name,
      userPhone: user.phone,
      address: order.address,
      startDate: order.startDate,
      endDate: order.endDate,
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
    };
  }
}

export default new OrderRepository();

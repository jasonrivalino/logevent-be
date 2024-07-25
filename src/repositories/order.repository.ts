// src/repositories/order.repository.ts

// dependency modules
import { Order } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";
import { OrderDetail } from "../utils/types";

class OrderRepository {
  async findAllOrders(): Promise<Order[]> {
    return prisma.order.findMany();
  }

  async findAllOrderDetails(): Promise<OrderDetail[]> {
    const orders = await prisma.order.findMany();
    return Promise.all(orders.map((order) => this.createOrderDetail(order)));
  }

  async findOrdersByUserId(userId: number): Promise<Order[]> {
    const carts = await prisma.cart.findMany({ where: { userId } });
    return prisma.order.findMany({ where: { cartId: { in: carts.map((cart) => cart.id) } } });
  }

  async findOrderDetailsByUserId(userId: number): Promise<OrderDetail[]> {
    const carts = await prisma.cart.findMany({ where: { userId } });
    const orders = await prisma.order.findMany({ where: { cartId: { in: carts.map((cart) => cart.id) } } });
    return Promise.all(orders.map((order) => this.createOrderDetail(order)));
  }

  async findPastMonthOrders(): Promise<Order[]> {
    return prisma.order.findMany({
      where: {
        orderDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });
  }

  async findPastMonthOrderDetails(chosenDate: Date): Promise<OrderDetail[]> {
    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: new Date(chosenDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });
    return Promise.all(orders.map((order) => this.createOrderDetail(order)));
  }

  async findOrderById(id: number): Promise<Order | null> {
    return prisma.order.findUnique({ where: { id } });
  }

  async findOrderDetailById(id: number): Promise<OrderDetail | null> {
    const order = await prisma.order.findUnique({ where: { id } });
    return order ? this.createOrderDetail(order) : null;
  }

  async createOrder(data: {
    cartId: number;
    name: string;
    phone: string;
    address: string;
    notes: string | null;
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

  async createOrderDetail(order: Order): Promise<OrderDetail> {
    const cart = await prisma.cart.findUnique({ where: { id: order.cartId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const user = await prisma.user.findUnique({ where: { id: cart.userId } });
    if (!user) {
      throw new Error("User not found");
    }

    let orderTotal = 0;
    const orderRange = Math.floor((order.endDate.getTime() - order.startDate.getTime()) / (1000 * 3600 * 24));
    const items = await prisma.item.findMany({ where: { cartId: cart.id } });
    for (const item of items) {
      if (item.eventId) {
        const event = await prisma.event.findUnique({ where: { id: item.eventId } });
        if (item.duration) {
          orderTotal += event ? event.price * item.duration : 0;
        } else if (item.quantity) {
          orderTotal += event ? event.price * item.quantity : 0;
        } else {
          orderTotal += event ? event.price * orderRange : 0;
        }
      } else if (item.productId) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (item.duration) {
          orderTotal += product ? product.price * item.duration : 0;
        } else if (item.quantity) {
          orderTotal += product ? product.price * item.quantity : 0;
        } else {
          orderTotal += product ? product.price * orderRange : 0;
        }
      }
    }

    return {
      id: order.id,
      cartId: order.cartId,
      cartType: cart.type,
      userId: cart.userId,
      userEmail: user.email,
      userName: user.name,
      userPhone: user.phone,
      name: order.name,
      phone: order.phone,
      address: order.address,
      notes: order.notes,
      startDate: order.startDate,
      endDate: order.endDate,
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
      orderTotal: orderTotal
    };
  }
}

export default new OrderRepository();

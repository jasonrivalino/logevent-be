// src/repositories/order.repository.ts

// dependency modules
import { Order } from "@prisma/client";
import { toZonedTime, format } from 'date-fns-tz';
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

  async findPastTwoMonthOrderDetails(chosenDate: Date): Promise<OrderDetail[]> {
    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: new Date(chosenDate.getTime() - 60 * 24 * 60 * 60 * 1000),
        },
      },
    });
    return Promise.all(orders.map((order) => this.createOrderDetail(order)));
  }

  async findOrderById(id: number): Promise<Order | null> {
    return prisma.order.findUnique({ where: { id } });
  }

  async findOrderAvailabilityByCartId(cartId: number): Promise<string[]> {
    const cart = await prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const productIds: Set<number> = new Set();
    if (cart.type === 'Event') {
      const items = await prisma.item.findMany({
        where: { cartId: cartId, eventId: { not: null } },
        include: { event: true },
      });
      for (const item of items) {
        if (item.eventId) {
          const bundles = await prisma.bundle.findMany({ where: { eventId: item.eventId } });
          bundles.forEach(bundle => productIds.add(bundle.productId));
        }
      }
    } else if (cart.type === 'Product' || cart.type === 'Event Organizer') {
      const items = await prisma.item.findMany({
        where: { cartId: cartId, productId: { not: null } },
        include: { product: true },
      });
      for (const item of items) {
        if (item.productId) {
          productIds.add(item.productId);
        }
      }
    }

    const upcomingOrders = await prisma.order.findMany({
      where: {
        endDate: {
          gte: new Date(),
        },
        orderStatus: {
          not: 'Cancelled',
        },
      },
      include: {
        cart: {
          include: { items: true },
        },
      },
    });

    const bookedDates: Set<string> = new Set();
    for (const order of upcomingOrders) {
      for (const orderItem of order.cart.items) {
        const bundleProductIds = new Set<number>();
        if (orderItem.eventId) {
          const bundles = await prisma.bundle.findMany({ where: { eventId: orderItem.eventId } });
          bundles.forEach(bundle => bundleProductIds.add(bundle.productId));
        }
  
        if ((orderItem.productId && productIds.has(orderItem.productId)) || 
            [...bundleProductIds].some(id => productIds.has(id))) {
          let currentDate = new Date(order.startDate);
          while (currentDate <= order.endDate) {
            bookedDates.add(format(toZonedTime(currentDate, 'Asia/Jakarta'), 'yyyy-MM-dd'));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      }
    }

    return Array.from(bookedDates);
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
    orderTotal: number;
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
      orderTotal: order.orderTotal,
    };
  }

  async calculateOrderTotal(cartId: number, startDate: Date, endDate: Date): Promise<number> {
    let orderTotal = 0;
    const orderRange = 1 + Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const items = await prisma.item.findMany({ where: { cartId } });

    for (const item of items) {
      if (item.eventId) {
        const event = await prisma.event.findUnique({
          where: { id: item.eventId },
          include: { category: true },
        });
        const feeMultiplier = event ? 1 + (event.category.fee / 100) : 1;
        orderTotal += event ? event.price * orderRange * feeMultiplier : 0;
      } else if (item.productId) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: true },
        });
        const feeMultiplier = product ? 1 + (product.category.fee / 100) : 1;
        if (item.duration) {
          orderTotal += product ? product.price * item.duration * feeMultiplier : 0;
        } else if (item.quantity) {
          orderTotal += product ? product.price * item.quantity * feeMultiplier : 0;
        } else {
          orderTotal += product ? product.price * orderRange * feeMultiplier : 0;
        }
      }
    }

    return Math.ceil(orderTotal);
  };
}

export default new OrderRepository();

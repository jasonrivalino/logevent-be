// src/controllers/order.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import bundleRepository from "../repositories/bundle.repository";
import cartRepository from "../repositories/cart.repository";
import itemRepository from "../repositories/item.repository";
import orderRepository from "../repositories/order.repository";
import userRepository from "../repositories/user.repository";
import jwtUtils from "../utils/jwt";
import nodemailerUtils from "../utils/nodemailer";

class OrderController {
  async readAllOrders(req: Request, res: Response) {
    try {
      const orders = await orderRepository.findAllOrderDetails();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readPastTwoMonthOrders(req: Request, res: Response) {
    try {
      const chosenDate = req.params.date;
      if (!chosenDate) {
        return res.status(400).json({ message: "Please provide a date" });
      }

      const orders = await orderRepository.findPastTwoMonthOrderDetails(new Date(chosenDate));
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readOrdersByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const orders = await orderRepository.findOrderDetailsByUserId(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readOrderById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const order = await orderRepository.findOrderDetailById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readProductOrderAvailabilityByCartId(req: Request, res: Response) {
    try {
      const cartId = Number(req.params.cartId);
      const cart = await cartRepository.findCartById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      console.log("Cart:", cart);

      const productIds: Set<number> = new Set();
      if (cart.type === 'Event') {
        const eventItems = await itemRepository.findItemsEventDetailsByCartId(cartId);
        console.log("Event Items:", eventItems);
        for (const eventItem of eventItems) {
          const eventBundles = await bundleRepository.findBundlesByEventId(eventItem.eventId);
          console.log("Event Bundles:", eventBundles);
          for (const eventBundle of eventBundles) {
            productIds.add(eventBundle.productId);
          }
        }
      } else if (cart.type === 'Product') {
        const productItems = await itemRepository.findItemsProductDetailsByCartId(cartId);
        console.log("Product Items:", productItems);
        for (const productItem of productItems) {
          productIds.add(productItem.productId);
        }
      }

      const upcomingOrders = await orderRepository.findUpcomingOrders();
      console.log("Upcoming Orders:", upcomingOrders);
      const upcomingCarts = [];
      for (const upcomingOrder of upcomingOrders) {
        const upcomingCart = await cartRepository.findCartById(upcomingOrder.cartId);
        console.log("Upcoming Cart:", upcomingCart);
        if (upcomingCart) {
          upcomingCarts.push(upcomingCart);
        }
      }

      const upcomingProductIds: Set<number> = new Set();
      for (const upcomingCart of upcomingCarts) {
        if (upcomingCart.type === 'Event') {
          const upcomingEventItems = await itemRepository.findItemsEventDetailsByCartId(upcomingCart.id);
          console.log("Upcoming Event Items:", upcomingEventItems);
          for (const upcomingEventItem of upcomingEventItems) {
            const upcomingEventBundles = await bundleRepository.findBundlesByEventId(upcomingEventItem.eventId);
            console.log("Upcoming Event Bundles:", upcomingEventBundles);
            for (const upcomingEventBundle of upcomingEventBundles) {
              upcomingProductIds.add(upcomingEventBundle.productId);
            }
          }
        } else if (upcomingCart.type === 'Product') {
          const upcomingProductItems = await itemRepository.findItemsProductDetailsByCartId(upcomingCart.id);
          console.log("Upcoming Product Items:", upcomingProductItems);
          for (const upcomingProductItem of upcomingProductItems) {
            upcomingProductIds.add(upcomingProductItem.productId);
          }
        }
      }

      return res.status(200).json({ productIds: Array.from(productIds), upcomingProductIds: Array.from(upcomingProductIds) });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { cartId, name, phone, address, notes, startDate, endDate } = req.body;
      const newOrder = await orderRepository.createOrder({
        cartId,
        name,
        phone,
        address,
        notes,
        startDate,
        endDate
      });

      const cart = await cartRepository.findCartById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const user = await userRepository.findUserById(cart.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userId = cart.userId;
      const userEmail = user.email;
      const token = jwtUtils.sign({ id: userId });
      await nodemailerUtils.sendNewOrderEmail(userEmail, newOrder.id, token);

      res.status(201).json(newOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const order = await orderRepository.findOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const { cartId, name, phone, address, notes, startDate, endDate, orderDate, orderStatus } = req.body;
      const updatedOrder = await orderRepository.updateOrder(id, {
        cartId: cartId || order.cartId,
        name: name || order.name,
        phone: phone || order.phone,
        address: address || order.address,
        notes: notes || order.notes,
        startDate: startDate || order.startDate,
        endDate: endDate || order.endDate,
        orderDate: orderDate || order.orderDate,
        orderStatus: orderStatus || order.orderStatus
      });

      res.status(200).json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const order = await orderRepository.findOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      await orderRepository.deleteOrder(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllOrders)
      .get("/read/past-two-month/:date", this.readPastTwoMonthOrders)
      .get("/read/user/:userId", this.readOrdersByUserId)
      .get("/read/availability/:cartId", this.readProductOrderAvailabilityByCartId)
      .get("/read/:id", this.readOrderById)
      .post("/create", this.createOrder)
      .put("/update/:id", this.updateOrder)
      .delete("/delete/:id", this.deleteOrder);
  }
}

export default new OrderController();

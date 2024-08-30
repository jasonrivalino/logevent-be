// src/controllers/order.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import cartRepository from "../repositories/cart.repository";
import itemRepository from "../repositories/item.repository";
import orderRepository from "../repositories/order.repository";
import userRepository from "../repositories/user.repository";
import nodemailerUtils from "../utils/nodemailer";
import { ItemEventDetail, ItemProductDetail } from '../utils/types';

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

  async readOrderAvailabilityByCartId(req: Request, res: Response) {
    try {
      const cartId = Number(req.params.cartId);
      const bookedDates = await orderRepository.findOrderAvailabilityByCartId(cartId);
      res.status(200).json(bookedDates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // TODO: Fix Create Order
  async createOrder(req: Request, res: Response) {
    try {
      const { cartId, name, phone, address, notes, startDate, endDate } = req.body;
      const orderTotal = await orderRepository.calculateOrderTotal(cartId, startDate, endDate);
      const newOrder = await orderRepository.createOrder({
        cartId,
        name,
        phone,
        address,
        notes,
        startDate,
        endDate,
        orderTotal: orderTotal,
      });

      const cart = await cartRepository.findCartById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const user = await userRepository.findUserById(cart.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userEmail = user.email;
      const orderDetail = await orderRepository.findOrderDetailById(newOrder.id);
      if (!orderDetail) {
        return res.status(404).json({ message: "Order not found" });
      }

      let items: (ItemEventDetail | ItemProductDetail)[] = [];
      if (cart.type === "Event") {
        items = await itemRepository.findItemsEventDetailsByCartId(cartId);
        await nodemailerUtils.sendNewOrderEmail(userEmail, orderDetail, items);
      } else if (cart.type === "Product") {
        items = await itemRepository.findItemsProductDetailsByCartId(cartId);
        await nodemailerUtils.sendNewOrderEmail(userEmail, orderDetail, items);
      }

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

  async confirmEventOrganizer(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { newOrderTotal } = req.body;
      const order = await orderRepository.findOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updatedOrder = await orderRepository.updateOrder(id, {
        orderTotal: newOrderTotal,
        orderStatus: "Pending"
      });

      const cart = await cartRepository.findCartById(order.cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const user = await userRepository.findUserById(cart.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userEmail = user.email;
      const orderDetail = await orderRepository.findOrderDetailById(updatedOrder.id);
      if (!orderDetail) {
        return res.status(404).json({ message: "Order not found" });
      }

      const items = await itemRepository.findItemsProductDetailsByCartId(order.cartId);
      await nodemailerUtils.sendNewOrderEmail(userEmail, orderDetail, items);

      res.status(200).json(updatedOrder);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async confirmOrderPayment(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const order = await orderRepository.findOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updatedOrder = await orderRepository.updateOrder(id, {
        orderStatus: "Completed"
      });

      const cart = await cartRepository.findCartById(order.cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const user = await userRepository.findUserById(cart.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userEmail = user.email;
      const orderDetail = await orderRepository.findOrderDetailById(updatedOrder.id);
      if (!orderDetail) {
        return res.status(404).json({ message: "Order not found" });
      }

      let items: (ItemEventDetail | ItemProductDetail)[] = [];
      if (cart.type === "Event") {
        items = await itemRepository.findItemsEventDetailsByCartId(order.cartId);
      } else if (cart.type === "Product") {
        items = await itemRepository.findItemsProductDetailsByCartId(order.cartId);
      }

      await nodemailerUtils.sendPaidOrderEmail(userEmail, orderDetail, items);
      res.status(200).json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async cancelOrder(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { cancelMessage } = req.body;
      const order = await orderRepository.findOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updatedOrder = await orderRepository.updateOrder(id, {
        orderStatus: "Cancelled"
      });

      const cart = await cartRepository.findCartById(order.cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const user = await userRepository.findUserById(cart.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userEmail = user.email;
      const orderDetail = await orderRepository.findOrderDetailById(updatedOrder.id);
      if (!orderDetail) {
        return res.status(404).json({ message: "Order not found" });
      }

      await nodemailerUtils.sendCancelOrderEmail(userEmail, orderDetail, cancelMessage);
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
      .get("/read/availability/:cartId", this.readOrderAvailabilityByCartId)
      .get("/read/:id", this.readOrderById)
      .post("/create", this.createOrder)
      .put("/update/:id", this.updateOrder)
      .put("/confirm-payment/:id", this.confirmOrderPayment)
      .put("/cancel/:id", this.cancelOrder)
      .delete("/delete/:id", this.deleteOrder);
  }
}

export default new OrderController();

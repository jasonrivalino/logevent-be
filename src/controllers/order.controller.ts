import orderRepository from "../repositories/order.repository";
import jwtUtils from "../utils/jwt";
import nodemailerUtils from "../utils/nodemailer";
import { Request, Response } from "express";
import { Router } from "express";

class OrderController {
  async readAllOrder(req: Request, res: Response) {
    try {
      const orders = await orderRepository.findAllOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readOrderById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const order = await orderRepository.findOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { productId, userId, address, startDate, endDate, orderImage } = req.body;
      const newOrder = await orderRepository.createOrder({
        productId,
        userId,
        address,
        startDate,
        endDate,
        orderImage
      });

      res.status(201).json(newOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async confirmOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const order = await orderRepository.findOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const userEmail = order.userEmail;
      const userId = order.userId;
      const token = jwtUtils.sign({ id: userId });
      await nodemailerUtils.sendOrderConfirmationEmail(userEmail, orderId, token);

      res.status(200).json({ message: "Order confirmed" });
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

      const { productId, userId, address, startDate, endDate, orderDate, orderImage, orderStatus } = req.body;
      const updatedOrder = await orderRepository.updateOrder(id, {
        productId: productId || order.productId,
        userId: userId || order.userId,
        address: address || order.address,
        startDate: startDate || order.startDate,
        endDate: endDate || order.endDate,
        orderDate: orderDate || order.orderDate,
        orderImage: orderImage || order.orderImage,
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
      res.status(204).json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllOrder)
      .get("/read/:id", this.readOrderById)
      .post("/create", this.createOrder)
      .put("/update/:id", this.updateOrder)
      .delete("/delete/:id", this.deleteOrder);
  }
}

export default new OrderController();

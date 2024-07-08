import orderRepository from "../repositories/order.repository";
import { Request, Response } from "express";
import { Router } from "express";

class OrderController {
  async readAllOrder(req: Request, res: Response) {
    try {
      const orders = await orderRepository.findAllOrders();
      res.json(orders);
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
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { productId, name, phone, email, address, usageDate, orderImage } = req.body;
      const order = await orderRepository.createOrder({
        productId,
        name,
        phone,
        email,
        address,
        usageDate,
        orderImage
      });
      res.json(order);
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
      const { productId, name, phone, email, address, usageDate, orderImage } = req.body;
      const updatedOrder = await orderRepository.updateOrder(id, {
        productId: productId || order.productId,
        name: name || order.name,
        phone: phone || order.phone,
        email: email || order.email,
        address: address || order.address,
        usageDate: usageDate || order.usageDate,
        orderImage: orderImage || order.orderImage
      });
      res.json(updatedOrder);
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
      res.json(order);
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

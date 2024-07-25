// src/controllers/item.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import itemRepository from "../repositories/item.repository";

class ItemController {
  async readAllItems(req: Request, res: Response) {
    try {
      const items = await itemRepository.findAllItemDetails();
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readItemsByCartId(req: Request, res: Response) {
    try {
      const cartId = Number(req.params.cartId);
      const items = await itemRepository.findItemDetailsByCartId(cartId);
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readItemById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await itemRepository.findItemDetailById(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json(item);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createItem(req: Request, res: Response) {
    try {
      const { eventId, productId, cartId, duration, quantity } = req.body;
      const newItem = await itemRepository.createItem({
        eventId,
        productId,
        cartId,
        duration,
        quantity
      });

      res.status(201).json(newItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await itemRepository.findItemDetailById(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const { eventId, productId, cartId, duration, quantity } = req.body;
      const updatedItem = await itemRepository.updateItem(id, {
        eventId: eventId || item.eventId,
        productId: productId || item.productId,
        cartId: cartId || item.cartId,
        duration: duration || item.duration,
        quantity: quantity || item.quantity
      });

      res.status(200).json(updatedItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteItem(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await itemRepository.findItemDetailById(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      await itemRepository.deleteItem(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/", this.readAllItems)
      .get("/:id", this.readItemById)
      .post("/", this.createItem)
      .put("/:id", this.updateItem)
      .delete("/:id", this.deleteItem);
  }
}

export default new ItemController();

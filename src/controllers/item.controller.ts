// src/controllers/item.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import itemRepository from "../repositories/item.repository";

class ItemController {
  async readAllEventItems(req: Request, res: Response) {
    try {
      const items = await itemRepository.findAllItemsEventDetails();
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readAllProductItems(req: Request, res: Response) {
    try {
      const items = await itemRepository.findAllItemsProductDetails();
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readEventItemsByCartId(req: Request, res: Response) {
    try {
      const cartId = Number(req.params.cartId);
      const items = await itemRepository.findItemsEventDetailsByCartId(cartId);
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readProductItemsByCartId(req: Request, res: Response) {
    try {
      const cartId = Number(req.params.cartId);
      const items = await itemRepository.findItemsProductDetailsByCartId(cartId);
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readEventItemById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await itemRepository.findItemEventDetailById(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json(item);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readProductItemById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await itemRepository.findItemProductDetailById(id);
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
      const { cartId, eventId, productId, duration, quantity } = req.body;
      const newItem = await itemRepository.createItem({
        cartId,
        eventId,
        productId,
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
      const item = await itemRepository.findItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const { cartId, eventId, productId, duration, quantity } = req.body;
      const updatedItem = await itemRepository.updateItem(id, {
        cartId: cartId || item.cartId,
        eventId: eventId || item.eventId,
        productId: productId || item.productId,
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
      const item = await itemRepository.findItemById(id);
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
      .get("/read/event", this.readAllEventItems)
      .get("/read/product", this.readAllProductItems)
      .get("/read/event/:cartId", this.readEventItemsByCartId)
      .get("/read/product/:cartId", this.readProductItemsByCartId)
      .get("/read/event/:id", this.readEventItemById)
      .get("/read/product/:id", this.readProductItemById)
      .post("/create", this.createItem)
      .put("/update/:id", this.updateItem)
      .delete("/delete/:id", this.deleteItem);
  }
}

export default new ItemController();

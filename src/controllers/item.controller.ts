import itemRepository from "../repositories/item.repository";
import { Request, Response } from "express";
import { Router } from "express";

class ItemController {
  async readAllItem(req: Request, res: Response) {
    try {
      const items = await itemRepository.findAllItems();
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readItemById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await itemRepository.findItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json(item);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readItemByProductId(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const items = await itemRepository.findItemsByProductId(productId);
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readItemByOrderId(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      const items = await itemRepository.findItemsByOrderId(orderId);
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readReviewByProductId(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const reviews = await itemRepository.getReviewByProductId(productId);
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createItem(req: Request, res: Response) {
    try {
      const { productId, orderId } = req.body;
      const newItem = await itemRepository.createItem({
        productId,
        orderId,
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

      const { productId, orderId, reviewRating, reviewComment, reviewDate } = req.body;
      const updatedItem = await itemRepository.updateItem(id, {
        productId: productId || item.productId,
        orderId: orderId || item.orderId,
        reviewRating: reviewRating || item.reviewRating,
        reviewComment: reviewComment || item.reviewComment,
        reviewDate: reviewDate || item.reviewDate,
      });

      res.status(200).json(updatedItem);
    }
    catch (error: any) {
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
      res.status(204).json(item);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllItem)
      .get("/read/:id", this.readItemById)
      .get("/read/product/:productId", this.readItemByProductId)
      .get("/read/order/:orderId", this.readItemByOrderId)
      .get("/read/review/:productId", this.readReviewByProductId)
      .post("/create", this.createItem)
      .put("/update/:id", this.updateItem)
      .delete("/delete/:id", this.deleteItem);
  }
}

export default new ItemController();

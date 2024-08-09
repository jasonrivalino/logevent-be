// src/controllers/wishlist.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import WishlistRepository from "../repositories/wishlist.repository";

class WishlistController {
  async readAllEventWishlists(req: Request, res: Response) {
    try {
      const wishlists = await WishlistRepository.findAllWishlistsEventDetails();
      res.status(200).json(wishlists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readAllProductWishlists(req: Request, res: Response) {
    try {
      const wishlists = await WishlistRepository.findAllWishlistProductDetails();
      res.status(200).json(wishlists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readEventWishlistsByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const wishlists = await WishlistRepository.findWishlistsEventDetailsByUserId(userId);
      res.status(200).json(wishlists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readProductWishlistsByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const wishlists = await WishlistRepository.findWishlistsProductDetailsByUserId(userId);
      res.status(200).json(wishlists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readWishlistById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const wishlist = await WishlistRepository.findWishlistById(id);
      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }

      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createWishlist(req: Request, res: Response) {
    try {
      const { userId, eventId, productId } = req.body;
      const newWishlist = await WishlistRepository.createWishlist({ 
        userId,
        eventId,
        productId
      });

      res.status(201).json(newWishlist);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteWishlist(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const wishlist = await WishlistRepository.findWishlistById(id);
      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }

      await WishlistRepository.deleteWishlist(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read/event", this.readAllEventWishlists)
      .get("/read/product", this.readAllProductWishlists)
      .get("/read/event/:userId", this.readEventWishlistsByUserId)
      .get("/read/product/:userId", this.readProductWishlistsByUserId)
      .get("/read/:id", this.readWishlistById)
      .post("/create", this.createWishlist)
      .delete("/delete/:id", this.deleteWishlist);
  }
}

export default new WishlistController();

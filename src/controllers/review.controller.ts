// src/controllers/review.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import reviewRepository from "../repositories/review.repository";

class ReviewController {
  async readAllReviews(req: Request, res: Response) {
    try {
      const reviews = await reviewRepository.findAllReviewDetails();
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readReviewsByEventId(req: Request, res: Response) {
    try {
      const eventId = Number(req.params.eventId);
      const reviews = await reviewRepository.findReviewDetailsByEventId(eventId);
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readReviewsByProductId(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const reviews = await reviewRepository.findReviewDetailsByProductId(productId);
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readReviewByItemId(req: Request, res: Response) {
    try {
      const itemId = Number(req.params.itemId);
      const review = await reviewRepository.findReviewDetailByItemId(itemId);
      res.status(200).json(review);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const { itemId, rating, comment, tag } = req.body;
      const newReview = await reviewRepository.createReview({
        itemId,
        rating,
        comment,
        tag
      });

      res.status(201).json(newReview);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllReviews)
      .get("/read/event/:eventId", this.readReviewsByEventId)
      .get("/read/product/:productId", this.readReviewsByProductId)
      .get("/read/item/:itemId", this.readReviewByItemId)
      .post("/create", this.createReview)
  }
}

export default new ReviewController();

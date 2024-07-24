// src/controllers/review.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import reviewRepository from "../repositories/review.repository";

class ReviewController {
  async readAllReview(req: Request, res: Response) {
    try {
      const reviews = await reviewRepository.findAllReviews();
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const { itemId, rating, comment, reviewDate } = req.body;
      const newReview = await reviewRepository.createReview({
        itemId,
        rating,
        comment,
        reviewDate
      });

      res.status(201).json(newReview);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllReview)
      .post("/create", this.createReview)
  }
}

export default new ReviewController();

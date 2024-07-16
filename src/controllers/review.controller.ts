import reviewRepository from "../repositories/review.repository";
import { Request, Response } from "express";
import { Router } from "express";

class ReviewController {
  async readAllReview(req: Request, res: Response) {
    try {
      const reviews = await reviewRepository.findAllReviews();
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readReviewById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const review = await reviewRepository.findReviewById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json(review);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readReviewByProductId(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const reviews = await reviewRepository.findReviewsByProductId(productId);
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const { orderId, rating, comment } = req.body;
      const newReview = await reviewRepository.createReview({
        orderId,
        rating,
        comment,
      });

      res.status(201).json(newReview);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const review = await reviewRepository.findReviewById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      const { orderId, rating, comment } = req.body;
      const updatedReview = await reviewRepository.updateReview(id, {
        orderId: orderId || review.orderId,
        rating: rating || review.rating,
        comment: comment || review.comment,
      });

      res.status(200).json(updatedReview);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const review = await reviewRepository.findReviewById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      await reviewRepository.deleteReview(id);
      res.status(204).json(review);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllReview)
      .get("/read/:id", this.readReviewById)
      .get("/read/product/:productId", this.readReviewByProductId)
      .post("/create", this.createReview)
      .put("/update/:id", this.updateReview)
      .delete("/delete/:id", this.deleteReview);
  }
}

export default new ReviewController();

// src/reposities/review.repository.ts

// dependency modules
import { Review } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class ReviewRepository {
  async findAllReviews(): Promise<Review[]> {
    return prisma.review.findMany();
  }

  async createReview(data: {
    itemId: number;
    rating: number;
    comment: string;
    reviewDate: Date;
  }): Promise<Review> {
    return prisma.review.create({ data });
  }
}

export default new ReviewRepository();

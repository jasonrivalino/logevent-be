import { Review } from "@prisma/client";
import prisma from "../utils/prisma";

class ReviewRepository {
  async findAllReviews(): Promise<Review[]> {
    return prisma.review.findMany();
  }

  async findReviewById(id: number): Promise<Review | null> {
    return prisma.review.findUnique({ where: { id } });
  }

  async findReviewsByOrderId(orderId: number): Promise<Review[]> {
    return prisma.review.findMany({ where: { orderId } });
  }

  async createReview(data: {
    orderId: number;
    rating: number;
    comment: string;
  }): Promise<Review> {
    return prisma.review.create({ data });
  }

  async updateReview(id: number, data: Record<string, any>): Promise<Review> {
    return prisma.review.update({ where: { id }, data });
  }

  async deleteReview(id: number): Promise<Review> {
    return prisma.review.delete({ where: { id } });
  }
}

export default new ReviewRepository();

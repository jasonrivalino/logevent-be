import { Review } from "@prisma/client";
import orderRepository from "./order.repository";
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

  async getAverageRatingByProductId(productId: number): Promise<number> {
    const orders = await orderRepository.findOrdersByProductId(productId);
    const reviewsNested = await Promise.all(orders.map((order) => this.findReviewsByOrderId(order.id)));
    const reviews = reviewsNested.flat();
    const ratings = reviews.map((review) => review.rating);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return sum / ratings.length;
  }
}

export default new ReviewRepository();

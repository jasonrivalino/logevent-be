// src/reposities/review.repository.ts

// dependency modules
import { Review } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";
import { ReviewDetail } from "../utils/types";

class ReviewRepository {
  async findAllReviews(): Promise<Review[]> {
    return prisma.review.findMany();
  }

  async findAllReviewDetails(): Promise<ReviewDetail[]> {
    const reviews = await prisma.review.findMany();
    return Promise.all(reviews.map((review) => this.createReviewDetail(review)));
  }

  async findReviewsByEventId(eventId: number): Promise<Review[]> {
    const items = await prisma.item.findMany({ where: { eventId } });
    const itemIds = items.map((item) => item.id);
    return prisma.review.findMany({ where: { itemId: { in: itemIds } } });
  }

  async findReviewDetailsByEventId(eventId: number): Promise<ReviewDetail[]> {
    const items = await prisma.item.findMany({ where: { eventId } });
    const itemIds = items.map((item) => item.id);
    const reviews = await prisma.review.findMany({ where: { itemId: { in: itemIds } } });
    return Promise.all(reviews.map((review) => this.createReviewDetail(review)));
  }

  async findReviewsByProductId(productId: number): Promise<Review[]> {
    const items = await prisma.item.findMany({ where: { productId } });
    const itemIds = items.map((item) => item.id);
    return prisma.review.findMany({ where: { itemId: { in: itemIds } } });
  }

  async findReviewDetailsByProductId(productId: number): Promise<ReviewDetail[]> {
    const items = await prisma.item.findMany({ where: { productId } });
    const itemIds = items.map((item) => item.id);
    const reviews = await prisma.review.findMany({ where: { itemId: { in: itemIds } } });
    return Promise.all(reviews.map((review) => this.createReviewDetail(review)));
  }

  async findReviewByItemId(itemId: number): Promise<Review | null> {
    return prisma.review.findFirst({ where: { itemId } });
  }

  async findReviewDetailByItemId(itemId: number): Promise<ReviewDetail | null> {
    const review = await prisma.review.findFirst({ where: { itemId } });
    return review ? this.createReviewDetail(review) : null;
  }
  
  async createReview(data: {
    itemId: number;
    rating: number;
    comment: string | null;
    tag: string | null;
  }): Promise<Review> {
    return prisma.review.create({ data });
  }

  async createReviewDetail(review: Review): Promise<ReviewDetail> {
    const item = await prisma.item.findUnique({ where: { id: review.itemId } });
    if (!item) {
      throw new Error("Item not found");
    }

    const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const user = await prisma.user.findUnique({ where: { id: cart.userId } });
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: review.id,
      itemId: review.itemId,
      cartId: item.cartId,
      userId: cart.userId,
      userName: user.name,
      userPicture: user.picture,
      eventId: item.eventId,
      productId: item.productId,
      rating: review.rating,
      comment: review.comment,
      tag: review.tag,
      reviewDate: review.reviewDate,
    };
  }
}

export default new ReviewRepository();

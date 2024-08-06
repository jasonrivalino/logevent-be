// src/repositories/wishlist.repository.ts

// dependency modules
import { Wishlist } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";
import { WishlistEventDetail, WishlistProductDetail } from "../utils/types";

class WishlistRepository {
  async findAllWishlists(): Promise<Wishlist[]> {
    return prisma.wishlist.findMany();
  }

  async findAllWishlistsEventDetails(): Promise<WishlistEventDetail[]> {
    const wishlists = await prisma.wishlist.findMany();
    return Promise.all(wishlists.map(wishlist => this.createWishlistEventDetail(wishlist)));
  }

  async findAllWishlistProductDetails(): Promise<WishlistProductDetail[]> {
    const wishlists = await prisma.wishlist.findMany();
    return Promise.all(wishlists.map(wishlist => this.createWishlistProductDetail(wishlist)));
  }

  async findWishlistsByUserId(userId: number): Promise<Wishlist[]> {
    return prisma.wishlist.findMany({ where: { userId } });
  }

  async findWishlistsEventDetailsByUserId(userId: number): Promise<WishlistEventDetail[]> {
    const wishlists = await prisma.wishlist.findMany({ where: { userId, eventId: { not: null } } });
    return Promise.all(wishlists.map(wishlist => this.createWishlistEventDetail(wishlist)));
  }

  async findWishlistsProductDetailsByUserId(userId: number): Promise<WishlistProductDetail[]> {
    const wishlists = await prisma.wishlist.findMany({ where: { userId, productId: { not: null } } });
    return Promise.all(wishlists.map(wishlist => this.createWishlistProductDetail(wishlist)));
  }

  async findWishlistById(id: number): Promise<Wishlist | null> {
    return prisma.wishlist.findUnique({ where: { id } });
  }

  async createWishlist(data: {
    userId: number;
    eventId: number | null;
    productId: number | null;
  }): Promise<Wishlist> {
    return prisma.wishlist.create({ data });
  }

  async deleteWishlist(id: number): Promise<Wishlist> {
    return prisma.wishlist.delete({ where: { id } });
  }

  async createWishlistEventDetail(wishlist: Wishlist): Promise<WishlistEventDetail> {
    if (!wishlist.eventId) {
      throw new Error("Event not found");
    }

    const event = await prisma.event.findUnique({ where: { id: wishlist.eventId } });
    if (!event) {
      throw new Error("Event not found");
    }

    const eventBundles = await prisma.bundle.findMany({ where: { eventId: event.id } });
    const productBundles = eventBundles.map((bundle) => bundle.productId);
    const bundles = await prisma.product.findMany({ where: { id: { in: productBundles } } });

    const items = await prisma.item.findMany({ where: { eventId: event.id } });
    const itemIds = items.map((item) => item.id);
    const reviews = await prisma.review.findMany({ where: { itemId: { in: itemIds } } });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    let eventRating = 0;
    if (reviews.length !== 0) {
      eventRating = totalRating / reviews.length;
    }

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      eventId: event.id,
      eventName: event.name,
      eventPrice: event.price,
      eventDescription: event.description,
      eventImage: event.eventImage,
      eventBundles: bundles.map((bundle) => bundle.name).join(", "),
      eventRating: eventRating
    }
  }

  async createWishlistProductDetail(wishlist: Wishlist): Promise<WishlistProductDetail> {
    if (!wishlist.productId) {
      throw new Error("Product not found");
    }

    const product = await prisma.product.findUnique({ where: { id: wishlist.productId } });
    if (!product) {
      throw new Error("Product not found");
    }

    const vendor = await prisma.vendor.findUnique({ where: { id: product.vendorId } });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const items = await prisma.item.findMany({ where: { productId: product.id } });
    const itemIds = items.map((item) => item.id);
    const reviews = await prisma.review.findMany({ where: { itemId: { in: itemIds } } });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    let productRating = 0;
    if (reviews.length !== 0) {
      productRating = totalRating / reviews.length;
    }

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      productId: product.id,
      productName: product.name,
      productSpecification: product.specification,
      productPrice: product.price,
      productImage: product.productImage,
      productRating: productRating,
      vendorId: product.vendorId,
      vendorAddress: vendor.address,
    }
  }
}

export default new WishlistRepository();

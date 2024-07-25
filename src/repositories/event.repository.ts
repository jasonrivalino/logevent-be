// src/repositories/event.repository.ts

// dependency modules
import { Event } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";
import { EventDetail } from "../utils/types";

class EventRepository {
  async findAllEvents(): Promise<Event[]> {
    return prisma.event.findMany({ where: { isDeleted: false } });
  }

  async findAllEventDetails(): Promise<EventDetail[]> {
    const events = await prisma.event.findMany({ where: { isDeleted: false } });
    return Promise.all(events.map((event) => this.createEventDetail(event)));
  }

  async findEventById(id: number): Promise<Event | null> {
    return prisma.event.findUnique({ 
      where: { 
        id,
        isDeleted: false
      }
     });
  }

  async findEventDetailById(id: number): Promise<EventDetail | null> {
    const event = await prisma.event.findUnique({ 
      where: { 
        id,
        isDeleted: false
      }
     });
    return event ? this.createEventDetail(event) : null;
  }

  async createEvent(data: {
    categoryId: number;
    name: string;
    rate: string;
    price: number;
    capacity: number | null;
    description: string | null;
    eventImage: string | null;
  }): Promise<Event> {
    return prisma.event.create({ data });
  }

  async updateEvent(id: number, data: Record<string, any>): Promise<Event> {
    return prisma.event.update({ where: { id }, data });
  }

  async deleteEvent(id: number): Promise<Event> {
    return prisma.event.update({ where: { id }, data: { isDeleted: true } });
  }

  async createEventDetail(event: Event): Promise<EventDetail> {
    const category = await prisma.category.findUnique({ where: { id: event.categoryId } });
    if (!category) {
      throw new Error("Category not found");
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
      id: event.id,
      categoryId: event.categoryId,
      categoryName: category.name,
      name: event.name,
      rate: event.rate,
      price: event.price,
      capacity: event.capacity,
      description: event.description,
      eventImage: event.eventImage,
      isDeleted: event.isDeleted,
      bundles: bundles.map((bundle) => bundle.name).join(", "),
      rating: eventRating,
      reviewCount: reviews.length
    }
  }
}

export default new EventRepository();

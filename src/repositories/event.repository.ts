// src/repositories/event.repository.ts

// dependency modules
import { Event } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class EventRepository {
  async findAllEvents(): Promise<Event[]> {
    return prisma.event.findMany();
  }

  async findEventById(id: number): Promise<Event | null> {
    return prisma.event.findUnique({ where: { id } });
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
    return prisma.event.delete({ where: { id } });
  }
}

export default new EventRepository();

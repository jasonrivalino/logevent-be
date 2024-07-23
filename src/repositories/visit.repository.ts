// src/repositories/visit.repository.ts

// dependency modules
import { Visit } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class VisitRepository {
  async findAllVisits(): Promise<Visit[]> {
    return prisma.visit.findMany();
  }

  async findVisitById(id: number): Promise<Visit | null> {
    return prisma.visit.findUnique({ where: { id } });
  }

  async findPastMonthVisits(): Promise<Visit[]> {
    return prisma.visit.findMany({
      where: {
        visitDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });
  }

  async createVisit(data: {
    userId: number | null;
    productId: number | null;
    ipAddress: string | null;
  }): Promise<Visit> {
    return prisma.visit.create({ data });
  }

  async deleteVisit(id: number): Promise<Visit> {
    return prisma.visit.delete({ where: { id } });
  }
}

export default new VisitRepository();

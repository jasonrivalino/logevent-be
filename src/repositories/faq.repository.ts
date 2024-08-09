// src/repositories/faq.repository.ts

// dependency modules
import { Faq } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class FaqRepository {
  async findAllFaqs(): Promise<Faq[]> {
    return prisma.faq.findMany();
  }

  async findFaqById(id: number): Promise<Faq | null> {
    return prisma.faq.findUnique({ where: { id } });
  }

  async createFaq(data: {
    question: string;
    answer: string;
  }): Promise<Faq> {
    return prisma.faq.create({ data });
  }

  async updateFaq(id: number, data: Record<string, any>): Promise<Faq> {
    return prisma.faq.update({ where: { id }, data });
  }

  async deleteFaq(id: number): Promise<Faq> {
    return prisma.faq.delete({ where: { id } });
  }
}

export default new FaqRepository();

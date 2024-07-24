// src/repositories/bundle.repository.ts

// dependency modules
import { Bundle } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class BundleRepository {
  async findAllBundles(): Promise<Bundle[]> {
    return prisma.bundle.findMany();
  }

  async findBundleById(id: number): Promise<Bundle | null> {
    return prisma.bundle.findUnique({ where: { id } });
  }

  async findBundlesByProductId(productId: number): Promise<Bundle[]> {
    return prisma.bundle.findMany({ where: { productId } });
  }

  async createBundle(data: {
    eventId: number;
    productId: number;
  }): Promise<Bundle> {
    return prisma.bundle.create({ data });
  }

  async updateBundle(id: number, data: Record<string, any>): Promise<Bundle> {
    return prisma.bundle.update({ where: { id }, data });
  }

  async deleteBundle(id: number): Promise<Bundle> {
    return prisma.bundle.delete({ where: { id } });
  }
}

export default new BundleRepository();

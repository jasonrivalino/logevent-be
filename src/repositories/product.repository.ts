import { Product } from "@prisma/client";
import prisma from "../utils/prisma";

class ProductRepository {
  async findAllProducts(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async findProductById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async findProductsByCategory(category: string): Promise<Product[]> {
    return prisma.product.findMany({ where: { category } });
  }

  async createProduct(data: {
    vendorId: number;
    name: string;
    specification: string;
    category: string;
    price: number;
    description: string | null;
  }): Promise<Product> {
    return prisma.product.create({ data });
  }

  async updateProduct(id: number, data: Record<string, any>): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: number): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  }
}

export default new ProductRepository();

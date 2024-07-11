import { Product, Vendor } from "@prisma/client";
import vendorRepository from "./vendor.repository";
import reviewRepository from "./review.repository";
import prisma from "../utils/prisma";

type ProductDetails = {
  vendorId: number;
  vendorAddress: string;
  name: string;
  specification: string;
  category: string;
  price: number;
  description: string | null;
  rating: number | null;
};

class ProductRepository {
  async findAllProducts(): Promise<ProductDetails[]> {
    const products = await prisma.product.findMany();
    return Promise.all(products.map((product) => this.createProductDetails(product)));
  }

  async findProductById(id: number): Promise<ProductDetails | null> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    return this.createProductDetails(product);
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

  async createProductDetails(product: Product): Promise<ProductDetails> {
    const vendor = await vendorRepository.findVendorById(product.vendorId) as Vendor;
    const productRating = await reviewRepository.getAverageRatingByProductId(product.id);
    return {
      vendorId: product.vendorId,
      vendorAddress: vendor.address,
      name: product.name,
      specification: product.specification,
      category: product.category,
      price: product.price,
      description: product.description,
      rating: productRating || null
    };
  }
}

export default new ProductRepository();

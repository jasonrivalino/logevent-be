// src/repositories/product.repository.ts

// dependency modules
import { Product } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";
import { ProductDetail } from "../utils/types";

class ProductRepository {
  async findAllProducts(): Promise<Product[]> {
    return prisma.product.findMany({ where: { isDeleted: false } });
  }

  async findAllProductDetails(): Promise<ProductDetail[]> {
    const products = await prisma.product.findMany({ where: { isDeleted: false } });
    return Promise.all(products.map((product) => this.createProductDetail(product)));
  }

  async findProductsByVendorId(vendorId: number): Promise<Product[]> {
    return prisma.product.findMany({ 
      where: { 
        vendorId,
        isDeleted: false
      }
     });
  }

  async findProductDetailsByVendorId(vendorId: number): Promise<ProductDetail[]> {
    const products = await prisma.product.findMany({ 
      where: { 
        vendorId,
        isDeleted: false
      }
     });
    return Promise.all(products.map((product) => this.createProductDetail(product)));
  }
  
  async findProductById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({ 
      where: { 
        id,
        isDeleted: false
      }
     });
  }

  async findProductDetailById(id: number): Promise<ProductDetail | null> {
    const product = await prisma.product.findUnique({ 
      where: { 
        id,
        isDeleted: false
      }
     });
    return product ? this.createProductDetail(product) : null;
  }

  async getTopProductDetails(): Promise<ProductDetail[]> {
    const products = await prisma.product.findMany({ where: { isDeleted: false } });
    const productDetailsPromises = products.map(async (product) => {
      const productDetails = await this.createProductDetail(product);
      const score = productDetails.rating * productDetails.reviewCount;
      return {
        ...productDetails,
        score
      };
    });

    const detailedProducts = await Promise.all(productDetailsPromises);
    const filteredProducts = detailedProducts.filter(product => product.rating > 4.0);
    const sortedProducts = filteredProducts.sort((a, b) => b.score - a.score);
    return sortedProducts.slice(0, 8);
  }

  async createProduct(data: {
    vendorId: number;
    categoryId: number;
    name: string;
    specification: string;
    rate: string;
    price: number;
    capacity: number | null;
    description: string | null;
    productImage: string | null;
  }): Promise<Product> {
    return prisma.product.create({ data });
  }

  async updateProduct(id: number, data: Record<string, any>): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: number): Promise<Product> {
    return prisma.product.update({ where: { id }, data: { isDeleted: true } });
  }

  async createProductDetail(product: Product): Promise<ProductDetail> {
    const vendor = await prisma.vendor.findUnique({ where: { id: product.vendorId } });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const category = await prisma.category.findUnique({ where: { id: product.categoryId } });
    if (!category) {
      throw new Error("Category not found");
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
      id: product.id,
      vendorId: product.vendorId,
      vendorPhone: vendor.phone,
      vendorAddress: vendor.address,
      categoryId: product.categoryId,
      categoryName: category.name,
      name: product.name,
      specification: product.specification,
      rate: product.rate,
      price: product.price,
      description: product.description,
      productImage: product.productImage,
      isDeleted: product.isDeleted,
      rating: productRating,
      reviewCount: reviews.length
    };
  }
}

export default new ProductRepository();

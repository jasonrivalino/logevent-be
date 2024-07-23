// src/repositories/vendor.repository.ts

// dependency modules
import { Vendor } from "@prisma/client";
// self-defined modules
import productRepository from "./product.repository";
import prisma from "../utils/prisma";
import { VendorDetails } from "../utils/types";

class VendorRepository {
  async findAllVendors(): Promise<VendorDetails[]> {
    const vendors = await prisma.vendor.findMany();
    return Promise.all(vendors.map((vendor) => this.createVendorDetails(vendor)));
  }

  async findVendorById(id: number): Promise<VendorDetails | null> {
    const vendor = await prisma.vendor.findUnique({ where: { id } });
    return vendor ? this.createVendorDetails(vendor) : null;
  }

  async findVendorByName(name: string): Promise<VendorDetails | null> {
    const vendor = await prisma.vendor.findFirst({ where: { name } });
    return vendor ? this.createVendorDetails(vendor) : null
  }

  async createVendor(data: {
    email: string;
    name: string;
    phone: string;
    address: string;
    picture: string | null;
  }): Promise<Vendor> {
    return prisma.vendor.create({ data });
  }

  async updateVendor(id: number, data: Record<string, any>): Promise<Vendor> {
    return prisma.vendor.update({ where: { id }, data });
  }

  async deleteVendor(id: number): Promise<Vendor> {
    return prisma.vendor.delete({ where: { id } });
  }

  async createVendorDetails(vendor: Vendor): Promise<VendorDetails> {
    const products = await productRepository.findProductsByVendorId(vendor.id);
    return {
      id: vendor.id,
      email: vendor.email,
      name: vendor.name,
      phone: vendor.phone,
      address: vendor.address,
      picture: vendor.picture,
      productCount: products.length,
    };
  }
}

export default new VendorRepository();

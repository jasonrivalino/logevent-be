import { Vendor } from "@prisma/client";
import prisma from "../utils/prisma";

class VendorRepository {
  async findAllVendors(): Promise<Vendor[]> {
    return prisma.vendor.findMany();
  }

  async findVendorById(id: number): Promise<Vendor | null> {
    return prisma.vendor.findUnique({ where: { id } });
  }

  async findVendorByName(name: string): Promise<Vendor | null> {
    return prisma.vendor.findFirst({ where: { name } });
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
}

export default new VendorRepository();

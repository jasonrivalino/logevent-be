// src/repositories/vendor.repository.ts

// dependency modules
import { Vendor } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";
import { VendorDetail } from "../utils/types";

class VendorRepository {
  async findAllVendors(): Promise<Vendor[]> {
    return prisma.vendor.findMany({ where: { isDeleted: false } });
  }

  async findAllVendorDetails(): Promise<VendorDetail[]> {
    const vendors = await prisma.vendor.findMany({ where: { isDeleted: false } });
    return Promise.all(vendors.map((vendor) => this.createVendorDetail(vendor)));
  }

  async findVendorById(id: number): Promise<Vendor | null> {
    return prisma.vendor.findUnique({ 
      where: { 
        id,
        isDeleted: false
      } 
     });
  }

  async findVendorDetailById(id: number): Promise<VendorDetail | null> {
    const vendor = await prisma.vendor.findUnique({ 
      where: { 
        id,
        isDeleted: false
      } 
    });

    return vendor ? this.createVendorDetail(vendor) : null;
  }

  async createVendor(data: {
    cityId: number;
    email: string;
    name: string;
    phone: string;
    address: string;
    instagram: string | null;
    socialMedia: string | null;
    documentUrl: string | null;
  }): Promise<Vendor> {
    return prisma.vendor.create({ data });
  }

  async updateVendor(id: number, data: Record<string, any>): Promise<Vendor> {
    return prisma.vendor.update({ where: { id }, data });
  }

  async deleteVendor(id: number): Promise<Vendor> {
    return prisma.vendor.update({ where: { id }, data: { isDeleted: true } });
  }

  async createVendorDetail(vendor: Vendor): Promise<VendorDetail> {
    const city = await prisma.city.findUnique({ where: { id: vendor.cityId } });
    if (!city) {
      throw new Error("City not found");
    }

    const products = await prisma.product.findMany({ 
      where: { 
        vendorId: vendor.id,
        isDeleted: false
      }
     });
    
    return {
      id: vendor.id,
      cityId: vendor.cityId,
      cityName: city.name,
      email: vendor.email,
      name: vendor.name,
      phone: vendor.phone,
      address: vendor.address,
      instagram: vendor.instagram,
      socialMedia: vendor.socialMedia,
      documentUrl: vendor.documentUrl,
      joinDate: vendor.joinDate,
      isDeleted: vendor.isDeleted,
      productCount: products.length,
    };
  }
}

export default new VendorRepository();

// src/controllers/vendor.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import vendorRepository from "../repositories/vendor.repository";

class VendorController {
  async readAllVendors(req: Request, res: Response) {
    try {
      const vendors = await vendorRepository.findAllVendorDetails();
      res.status(200).json(vendors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readVendorById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vendor = await vendorRepository.findVendorDetailById(id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      res.status(200).json(vendor);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createVendor(req: Request, res: Response) {
    try {
      const { cityId, email, name, phone, address, instagram, socialMedia, documentUrl } = req.body;
      const newVendor = await vendorRepository.createVendor({
        cityId,
        email,
        name,
        phone,
        address,
        instagram,
        socialMedia,
        documentUrl
      });

      res.status(201).json(newVendor);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateVendor(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vendor = await vendorRepository.findVendorById(id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const { cityId, email, name, phone, address, instagram, socialMedia, documentUrl } = req.body;
      const updatedVendor = await vendorRepository.updateVendor(id, {
        cityId: cityId || vendor.cityId,
        email: email || vendor.email,
        name: name || vendor.name,
        phone: phone || vendor.phone,
        address: address || vendor.address,
        instagram: instagram || vendor.instagram,
        socialMedia: socialMedia || vendor.socialMedia,
        documentUrl: documentUrl || vendor.documentUrl
      });

      res.status(200).json(updatedVendor);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteVendor(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vendor = await vendorRepository.findVendorById(id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      await vendorRepository.deleteVendor(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllVendors)
      .get("/read/:id", this.readVendorById)
      .post("/create", this.createVendor)
      .put("/update/:id", this.updateVendor)
      .delete("/delete/:id", this.deleteVendor);
  }
}

export default new VendorController();

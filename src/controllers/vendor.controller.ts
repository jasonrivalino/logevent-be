import vendorRepository from "../repositories/vendor.repository";
import { Request, Response } from "express";
import { Router } from "express";

class VendorController {
  async readAllVendor(req: Request, res: Response) {
    try {
      const vendors = await vendorRepository.findAllVendors();
      res.status(200).json(vendors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readVendorById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vendor = await vendorRepository.findVendorById(id);
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
      const { name, phone, address, picture } = req.body;
      const newVendor = await vendorRepository.createVendor({
        name,
        phone,
        address,
        picture
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

      const { name, phone, address, picture } = req.body;
      const updatedVendor = await vendorRepository.updateVendor(id, {
        name: name || vendor.name,
        phone: phone || vendor.phone,
        address: address || vendor.address,
        picture: picture || vendor.picture
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
      res.status(204).json(vendor);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllVendor)
      .get("/read/:id", this.readVendorById)
      .post("/create", this.createVendor)
      .put("/update/:id", this.updateVendor)
      .delete("/delete/:id", this.deleteVendor);
  }
}

export default new VendorController();

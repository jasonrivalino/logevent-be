// src/controllers/admin.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import adminRepository from "../repositories/admin.repository";

class AdminController {
  async readAllAdmins(req: Request, res: Response) {
    try {
      const admins = await adminRepository.findAllAdmins();
      res.status(200).json(admins);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readAdminById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const admin = await adminRepository.findAdminById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json(admin);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createAdmin(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const newAdmin = await adminRepository.createAdmin({ email });

      res.status(201).json(newAdmin);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateAdmin(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const admin = await adminRepository.findAdminById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const { email } = req.body;
      const updatedAdmin = await adminRepository.updateAdmin(id, { email: email || admin.email });
      
      res.status(200).json(updatedAdmin);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteAdmin(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const admin = await adminRepository.findAdminById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      await adminRepository.deleteAdmin(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllAdmins)
      .get("/read/:id", this.readAdminById)
      .post("/create", this.createAdmin)
      .put("/update/:id", this.updateAdmin)
      .delete("/delete/:id", this.deleteAdmin);
  }
}

export default new AdminController();

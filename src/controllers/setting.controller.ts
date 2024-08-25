// src/controllers/setting.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import settingRepository from "../repositories/setting.repository";

class SettingController {
  async findLatestSetting(req: Request, res: Response) {
    try {
      const setting = await settingRepository.findLatestSetting();
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      res.status(200).json(setting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createSetting(req: Request, res: Response) {
    try {
      const { description, youtubeUrl, vendorCount, productCount, orderCount } = req.body;
      const newSetting = await settingRepository.createSetting({
        description,
        youtubeUrl,
        vendorCount,
        productCount,
        orderCount
      });
      res.status(201).json(newSetting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateSetting(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const setting = await settingRepository.findLatestSetting();
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      const { description, youtubeUrl, vendorCount, productCount, orderCount } = req.body;
      const updatedSetting = await settingRepository.updateSetting(id, {
        description: description || setting.description,
        youtubeUrl: youtubeUrl || setting.youtubeUrl,
        vendorCount: vendorCount || setting.vendorCount,
        productCount: productCount || setting.productCount,
        orderCount: orderCount || setting.orderCount
      });

      res.status(200).json(updatedSetting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteSetting(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const setting = await settingRepository.findLatestSetting();
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      await settingRepository.deleteSetting(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.findLatestSetting)
      .post("/create", this.createSetting)
      .put("/update/:id", this.updateSetting)
      .delete("/delete/:id", this.deleteSetting);
  }
}

export default new SettingController();

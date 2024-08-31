// src/controllers/setting.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import settingRepository from "../repositories/setting.repository";

class SettingController {
  async readSetting(req: Request, res: Response) {
    try {
      const setting = await settingRepository.readSetting();
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      res.status(200).json(setting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateSetting(req: Request, res: Response) {
    try {
      const setting = await settingRepository.readSetting();
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      let { description, youtubeUrl, vendorCount, productCount, orderCount } = req.body;
      if (youtubeUrl && youtubeUrl.includes('/watch?v=')) {
        const videoId = youtubeUrl.split('/watch?v=')[1];
        youtubeUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      const updatedSetting = await settingRepository.updateSetting(setting.id, {
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

  getRoutes() {
    return Router()
      .get("/read", this.readSetting)
      .put("/update", this.updateSetting)
  }
}

export default new SettingController();

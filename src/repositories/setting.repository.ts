// src/repositories/setting.repository.ts

// dependency modules
import { Setting } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class SettingRepository {
  async findLatestSetting(): Promise<Setting | null> {
    return prisma.setting.findFirst({ orderBy: { id: "desc" } });
  }

  async createSetting(data: {
    description: string | null;
    youtubeUrl: string | null;
    vendorCount: number;
    productCount: number;
    orderCount: number;
  }): Promise<Setting> {
    return prisma.setting.create({ data });
  }

  async updateSetting(id: number, data: Record<string, any>): Promise<Setting> {
    return prisma.setting.update({ where: { id }, data });
  }

  async deleteSetting(id: number): Promise<Setting> {
    return prisma.setting.delete({ where: { id } });
  }
}

export default new SettingRepository();

// src/repositories/setting.repository.ts

// dependency modules
import { Setting } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class SettingRepository {
  async findSetting(): Promise<Setting | null> {
    return prisma.setting.findFirst();
  }

  async updateSetting(id: number, data: Record<string, any>): Promise<Setting> {
    return prisma.setting.update({ where: { id }, data });
  }
}

export default new SettingRepository();

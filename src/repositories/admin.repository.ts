// src/repositories/admin.repository.ts

// dependency modules
import { Admin } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class AdminRepository {
  async findAllAdmins(): Promise<Admin[]> {
    return prisma.admin.findMany();
  }

  async findAdminById(id: number): Promise<Admin | null> {
    return prisma.admin.findUnique({ where: { id } });
  }

  async createAdmin(data: {
    email: string;
  }): Promise<Admin> {
    return prisma.admin.create({ data });
  }

  async updateAdmin(id: number, data: Record<string, any>): Promise<Admin> {
    return prisma.admin.update({ where: { id }, data });
  }

  async deleteAdmin(id: number): Promise<Admin> {
    return prisma.admin.delete({ where: { id } });
  }
}

export default new AdminRepository();

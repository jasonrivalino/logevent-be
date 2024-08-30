// src/repositories/city.repository.ts

// dependency modules
import { City } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class CityRepository {
  async findAllCities(): Promise<City[]> {
    return prisma.city.findMany();
  }

  async findCityById(id: number): Promise<City | null> {
    return prisma.city.findUnique({ where: { id } });
  }

  async createCity(data: {
    name: string;
  }): Promise<City> {
    return prisma.city.create({ data });
  }

  async updateCity(id: number, data: Record<string, any>): Promise<City> {
    return prisma.city.update({ where: { id }, data });
  }

  async deleteCity(id: number): Promise<City> {
    return prisma.city.delete({ where: { id } });
  }
}

export default new CityRepository();

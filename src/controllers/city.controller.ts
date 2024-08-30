// src/controllers/city.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import cityRepository from "../repositories/city.repository";

class CityController {
  async readAllCities(req: Request, res: Response) {
    try {
      const cities = await cityRepository.findAllCities();
      res.status(200).json(cities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readCityById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const city = await cityRepository.findCityById(id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }

      res.status(200).json(city);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createCity(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const newCity = await cityRepository.createCity({ name });

      res.status(201).json(newCity);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCity(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const city = await cityRepository.findCityById(id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }

      const { name } = req.body;
      const updatedCity = await cityRepository.updateCity(id, { name: name || city.name });
      
      res.status(200).json(updatedCity);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCity(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const city = await cityRepository.findCityById(id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }

      await cityRepository.deleteCity(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllCities)
      .get("/read/:id", this.readCityById)
      .post("/create", this.createCity)
      .put("/update/:id", this.updateCity)
      .delete("/delete/:id", this.deleteCity);
  }
}

export default new CityController();

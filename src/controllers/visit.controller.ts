// src/controllers/visit.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import middleware from "../middleware";
import visitRepository from "../repositories/visit.repository";

class VisitController {
  async readAllVisits(req: Request, res: Response) {
    try {
      const visits = await visitRepository.findAllVisits();
      res.status(200).json(visits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readPastWeekVisits(req: Request, res: Response) {
    try {
      const chosenDate = req.params.chosenDate;
      if (!chosenDate) {
        return res.status(400).json({ message: "Please provide a date" });
      }

      const visits = await visitRepository.findPastWeekVisits(new Date(chosenDate));
      res.status(200).json(visits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createVisit(req: Request, res: Response) {
    try {
      const ipAddress = req.ip ?? null;
      const newVisit = await visitRepository.createVisit({ ipAddress });

      res.status(201).json(newVisit);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllVisits)
      .get("/read/past-week/:date", this.readPastWeekVisits)
      .post("/create", middleware.visitRateLimit, this.createVisit)
  }
}

export default new VisitController();

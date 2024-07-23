// src/controllers/visit.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import middleware from "../middleware";
import visitRepository from "../repositories/visit.repository";

class VisitController {
  async readAllVisit(req: Request, res: Response) {
    try {
      const visits = await visitRepository.findAllVisits();
      res.status(200).json(visits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readPastMonthVisit(req: Request, res: Response) {
    try {
      const visits = await visitRepository.findPastMonthVisits();
      res.status(200).json(visits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createVisit(req: Request, res: Response) {
    try {
      const { userId, productId } = req.body;
      const ipAddress = req.ip ?? null;
      const newVisit = await visitRepository.createVisit({
        userId,
        productId,
        ipAddress
      });

      res.status(201).json(newVisit);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteVisit(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const visit = await visitRepository.findVisitById(id);
      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }

      await visitRepository.deleteVisit(id);
      res.status(204).json(visit);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllVisit)
      .get("/read/past-month", this.readPastMonthVisit)
      .post("/create", middleware.visitRateLimit, this.createVisit)
      .delete("/delete/:id", this.deleteVisit);
  }
}

export default new VisitController();

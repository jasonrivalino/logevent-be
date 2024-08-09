// src/controllers/event.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import eventRepository from "../repositories/event.repository";

class EventController {
  async readAllEvents(req: Request, res: Response) {
    try {
      const events = await eventRepository.findAllEventDetails();
      res.status(200).json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readEventById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const event = await eventRepository.findEventDetailById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json(event);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const { categoryId, name, price, capacity, description, eventImage } = req.body;
      const newEvent = await eventRepository.createEvent({
        categoryId,
        name,
        price,
        capacity,
        description,
        eventImage
      });

      res.status(201).json(newEvent);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const event = await eventRepository.findEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const { categoryId, name, price, capacity, description, eventImage } = req.body;
      const updatedEvent = await eventRepository.updateEvent(id, {
        categoryId: categoryId || event.categoryId,
        name: name || event.name,
        price: price || event.price,
        capacity: capacity || event.capacity,
        description: description || event.description,
        eventImage: eventImage || event.eventImage
      });

      res.status(200).json(updatedEvent);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const event = await eventRepository.findEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      await eventRepository.deleteEvent(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllEvents)
      .get("/read/:id", this.readEventById)
      .post("/create", this.createEvent)
      .put("/update/:id", this.updateEvent)
      .delete("/delete/:id", this.deleteEvent);
  }
}

export default new EventController();

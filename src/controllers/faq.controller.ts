// src/controllers/faq.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import faqRepository from "../repositories/faq.repository";

class FaqController {
  async readAllFaqs(req: Request, res: Response) {
    try {
      const faqs = await faqRepository.findAllFaqs();
      res.status(200).json(faqs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readFaqById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const faq = await faqRepository.findFaqById(id);
      if (!faq) {
        return res.status(404).json({ message: "Faq not found" });
      }

      res.status(200).json(faq);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createFaq(req: Request, res: Response) {
    try {
      const { question, answer } = req.body;
      const newFaq = await faqRepository.createFaq({
        question,
        answer
      });

      res.status(201).json(newFaq);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateFaq(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const faq = await faqRepository.findFaqById(id);
      if (!faq) {
        return res.status(404).json({ message: "Faq not found" });
      }

      const { question, answer } = req.body;
      const updatedFaq = await faqRepository.updateFaq(id, {
        question: question || faq.question,
        answer: answer || faq.answer
      });

      res.status(200).json(updatedFaq);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteFaq(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const faq = await faqRepository.findFaqById(id);
      if (!faq) {
        return res.status(404).json({ message: "Faq not found" });
      }

      await faqRepository.deleteFaq(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/", this.readAllFaqs)
      .get("/:id", this.readFaqById)
      .post("/", this.createFaq)
      .put("/:id", this.updateFaq)
      .delete("/:id", this.deleteFaq);
  }
}

export default new FaqController();

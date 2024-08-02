// src/controllers/bundle.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import bundleRepository from "../repositories/bundle.repository";

class BundleController {
  async readAllBundles(req: Request, res: Response) {
    try {
      const bundles = await bundleRepository.findAllBundles();
      res.status(200).json(bundles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readBundlesByProductId(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const bundles = await bundleRepository.findBundlesByProductId(productId);
      res.status(200).json(bundles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readBundlesByEventId(req: Request, res: Response) {
    try {
      const eventId = Number(req.params.eventId);
      const bundles = await bundleRepository.findBundlesByEventId(eventId);
      res.status(200).json(bundles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readBundleById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const bundle = await bundleRepository.findBundleById(id);
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }

      res.status(200).json(bundle);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createBundle(req: Request, res: Response) {
    try {
      const { eventId, productId } = req.body;
      const newBundle = await bundleRepository.createBundle({
        eventId,
        productId
      });

      res.status(201).json(newBundle);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateBundle(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const bundle = await bundleRepository.findBundleById(id);
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }

      const { eventId, productId } = req.body;
      const updatedBundle = await bundleRepository.updateBundle(id, {
        eventId: eventId || bundle.eventId,
        productId: productId || bundle.productId
      });

      res.status(200).json(updatedBundle);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteBundle(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const bundle = await bundleRepository.findBundleById(id);
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }

      await bundleRepository.deleteBundle(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllBundles)
      .get("/read/product/:productId", this.readBundlesByProductId)
      .get("/read/event/:eventId", this.readBundlesByEventId)
      .get("/read/:id", this.readBundleById)
      .post("/create", this.createBundle)
      .put("/update/:id", this.updateBundle)
      .delete("/delete/:id", this.deleteBundle);
  }
}

export default new BundleController();

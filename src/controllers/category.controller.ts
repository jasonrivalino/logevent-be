// src/controllers/category.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import categoryRepository from "../repositories/category.repository";

class CategoryController {
  async readAllCategories(req: Request, res: Response) {
    try {
      const categories = await categoryRepository.findAllCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readProductCategories(req: Request, res: Response) {
    try {
      const categories = await categoryRepository.findProductCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readEventCategories(req: Request, res: Response) {
    try {
      const categories = await categoryRepository.findEventCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readCategoryById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const category = await categoryRepository.findCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json(category);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const { name, fee, type } = req.body;
      const newCategory = await categoryRepository.createCategory({
        name,
        fee,
        type
      });

      res.status(201).json(newCategory);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const category = await categoryRepository.findCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const { name, fee, type } = req.body;
      const updatedCategory = await categoryRepository.updateCategory(id, {
        name: name || category.name,
        fee: fee || category.fee,
        type: type || category.type
      });
      
      res.status(200).json(updatedCategory);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const category = await categoryRepository.findCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await categoryRepository.deleteCategory(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllCategories)
      .get("/read/product", this.readProductCategories)
      .get("/read/event", this.readEventCategories)
      .get("/read/:id", this.readCategoryById)
      .post("/create", this.createCategory)
      .put("/update/:id", this.updateCategory)
      .delete("/delete/:id", this.deleteCategory);
  }
}

export default new CategoryController();

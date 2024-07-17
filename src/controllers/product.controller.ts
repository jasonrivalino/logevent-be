import productRepository from "../repositories/product.repository";
import { Request, Response } from "express";
import { Router } from "express";

class ProductController {
  async readAllProduct(req: Request, res: Response) {
    try {
      const products = await productRepository.findAllProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productRepository.findProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const { vendorId, name, specification, category, price, description, productImage } = req.body;
      const newProduct = await productRepository.createProduct({
        vendorId,
        name,
        specification,
        category,
        price,
        description,
        productImage
      });

      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productRepository.findProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const { vendorId, name, specification, category, price, description, productImage } = req.body;
      const updatedProduct = await productRepository.updateProduct(id, {
        vendorId: vendorId || product.vendorId,
        name: name || product.name,
        specification: specification || product.specification,
        category: category || product.category,
        price: price || product.price,
        description: description || product.description,
        productImage: productImage || product.productImage
      });

      res.status(200).json(updatedProduct);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productRepository.findProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await productRepository.deleteProduct(id);
      res.status(204).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllProduct)
      .get("/read/:id", this.readProductById)
      .post("/create", this.createProduct)
      .put("/update/:id", this.updateProduct)
      .delete("/delete/:id", this.deleteProduct);
  }
}

export default new ProductController();

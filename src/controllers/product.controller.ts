// src/controllers/product.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import productRepository from "../repositories/product.repository";
import cloudinaryUtils from "../utils/cloudinary";

class ProductController {
  async readAllProducts(req: Request, res: Response) {
    try {
      const products = await productRepository.findAllProductDetails();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readTopProducts(req: Request, res: Response) {
    try {
      const products = await productRepository.getTopProductDetails();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readEventOrganizerProduct(req: Request, res: Response) {
    try {
      const eventOrganizerProduct = await productRepository.findEventOrganizerProductDetails();
      if (!eventOrganizerProduct) {
        return res.status(404).json({ message: "Event Organizer Product not found" });
      }

      res.status(200).json(eventOrganizerProduct);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readProductsByVendorId(req: Request, res: Response) {
    try {
      const vendorId = Number(req.params.vendorId);
      const products = await productRepository.findProductDetailsByVendorId(vendorId);
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productRepository.findProductDetailById(id);
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
      const { vendorId, categoryId, name, specification, rate, price, capacity, description, productImage } = req.body;
      const productImageUrl = productImage ? await cloudinaryUtils.uploadFile(productImage) : null;
      const newProduct = await productRepository.createProduct({
        vendorId,
        categoryId,
        name,
        specification,
        rate,
        price,
        capacity,
        description,
        productImage: productImageUrl
      });

      res.status(201).json(newProduct);
    } catch (error: any) {
      console.log(error);
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

      const { vendorId, categoryId, name, specification, rate, price, capacity, description, productImage } = req.body;
      if (product.productImage && !productImage) {
        await cloudinaryUtils.deleteFile(product.productImage);
      }

      const productImageUrl = productImage ? await cloudinaryUtils.uploadFile(productImage) : null;
      if (product.productImage && productImageUrl) {
        await cloudinaryUtils.deleteFile(product.productImage);
      }

      const updatedProduct = await productRepository.updateProduct(id, {
        vendorId: vendorId || product.vendorId,
        categoryId: categoryId || product.categoryId,
        name: name || product.name,
        specification: specification || product.specification,
        rate: rate || product.rate,
        price: price || product.price,
        capacity: capacity || product.capacity,
        description: description || product.description,
        productImage: productImageUrl || product.productImage
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

      if (product.productImage) {
        await cloudinaryUtils.deleteFile(product.productImage);
      }

      await productRepository.deleteProduct(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllProducts)
      .get("/read/top", this.readTopProducts)
      .get("/read/event-organizer", this.readEventOrganizerProduct)
      .get("/read/vendor/:vendorId", this.readProductsByVendorId)
      .get("/read/:id", this.readProductById)
      .post("/create", this.createProduct)
      .put("/update/:id", this.updateProduct)
      .delete("/delete/:id", this.deleteProduct);
  }
}

export default new ProductController();

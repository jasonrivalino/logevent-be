// src/controllers/album.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import albumRepository from "../repositories/album.repository";

class AlbumController {
  async readAllAlbum(req: Request, res: Response) {
    try {
      const albums = await albumRepository.findAllAlbums();
      res.status(200).json(albums);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readAlbumById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const album = await albumRepository.findAlbumById(id);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }

      res.status(200).json(album);
    }
    catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readAlbumByProductId(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const albums = await albumRepository.findAlbumsByProductId(productId);
      res.status(200).json(albums);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createAlbum(req: Request, res: Response) {
    try {
      const { productId, albumImage } = req.body;
      const newAlbum = await albumRepository.createAlbum({
        productId,
        albumImage
      });

      res.status(201).json(newAlbum);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateAlbum(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const album = await albumRepository.findAlbumById(id);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }

      const { productId, albumImage } = req.body;
      const updatedAlbum = await albumRepository.updateAlbum(id, {
        productId: productId || album.productId,
        albumImage: albumImage || album.albumImage
      });

      res.status(200).json(updatedAlbum);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteAlbum(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const album = await albumRepository.findAlbumById(id);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }

      await albumRepository.deleteAlbum(id);
      res.status(204).json(album);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllAlbum)
      .get("/read/:id", this.readAlbumById)
      .get("/read/product/:productId", this.readAlbumByProductId)
      .post("/create", this.createAlbum)
      .put("/update/:id", this.updateAlbum)
      .delete("/delete/:id", this.deleteAlbum);
  }
}

export default new AlbumController();

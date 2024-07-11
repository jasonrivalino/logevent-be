import albumRepository from "../repositories/album.repository";
import { Request, Response } from "express";
import { Router } from "express";

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

  async createAlbum(req: Request, res: Response) {
    try {
      const { productId, productImage } = req.body;
      const newAlbum = await albumRepository.createAlbum({
        productId,
        productImage
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

      const { productId, productImage } = req.body;
      const updatedAlbum = await albumRepository.updateAlbum(id, {
        productId: productId || album.productId,
        productImage: productImage || album.productImage
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
      .post("/create", this.createAlbum)
      .put("/update/:id", this.updateAlbum)
      .delete("/delete/:id", this.deleteAlbum);
  }
}

export default new AlbumController();

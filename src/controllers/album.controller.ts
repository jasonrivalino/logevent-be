// src/controllers/album.controller.ts

// dependency modules
import { Request, Response, Router } from "express";
// self-defined modules
import albumRepository from "../repositories/album.repository";
import cloudinaryUtils from "../utils/cloudinary";

class AlbumController {
  async readAllAlbums(req: Request, res: Response) {
    try {
      const albums = await albumRepository.findAllAlbums();
      res.status(200).json(albums);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readAlbumsByEventId(req: Request, res: Response) {
    try {
      const eventId = Number(req.params.eventId);
      const albums = await albumRepository.findAlbumsByEventId(eventId);
      res.status(200).json(albums);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async readAlbumsByProductId(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const albums = await albumRepository.findAlbumsByProductId(productId);
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
      const { eventId, productId, albumImage } = req.body;
      const albumImageUrl = albumImage ? await cloudinaryUtils.uploadFile(albumImage) : null;
      const newAlbum = await albumRepository.createAlbum({
        eventId,
        productId,
        albumImage: albumImageUrl
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

      const { eventId, productId, albumImage } = req.body;
      if (album.albumImage && !albumImage) {
        await cloudinaryUtils.deleteFile(album.albumImage);
      }

      const albumImageUrl = albumImage ? await cloudinaryUtils.uploadFile(albumImage) : null;
      if (album.albumImage && albumImageUrl) {
        await cloudinaryUtils.deleteFile(album.albumImage);
      }

      const updatedAlbum = await albumRepository.updateAlbum(id, {
        eventId: eventId || album.eventId,
        productId: productId || album.productId,
        albumImage: albumImageUrl || album.albumImage
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

      if (album.albumImage) {
        await cloudinaryUtils.deleteFile(album.albumImage);
      }

      await albumRepository.deleteAlbum(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllAlbums)
      .get("/read/event/:eventId", this.readAlbumsByEventId)
      .get("/read/product/:productId", this.readAlbumsByProductId)
      .get("/read/:id", this.readAlbumById)
      .post("/create", this.createAlbum)
      .put("/update/:id", this.updateAlbum)
      .delete("/delete/:id", this.deleteAlbum);
  }
}

export default new AlbumController();

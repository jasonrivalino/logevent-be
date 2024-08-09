// src/repositories/album.repository.ts

// dependency modules
import { Album } from "@prisma/client";
// self-defined modules
import prisma from "../utils/prisma";

class AlbumRepository {
  async findAllAlbums(): Promise<Album[]> {
    return prisma.album.findMany();
  }

  async findAlbumById(id: number): Promise<Album | null> {
    return prisma.album.findUnique({ where: { id } });
  }

  async findAlbumsByEventId(eventId: number): Promise<Album[]> {
    return prisma.album.findMany({ where: { eventId } });
  }

  async findAlbumsByProductId(productId: number): Promise<Album[]> {
    return prisma.album.findMany({ where: { productId } });
  }

  async createAlbum(data: {
    eventId: number | null;
    productId: number | null;
    albumImage: string | null;
  }): Promise<Album> {
    return prisma.album.create({ data });
  }

  async updateAlbum(id: number, data: Record<string, any>): Promise<Album> {
    return prisma.album.update({ where: { id }, data });
  }

  async deleteAlbum(id: number): Promise<Album> {
    return prisma.album.delete({ where: { id } });
  }
}

export default new AlbumRepository();

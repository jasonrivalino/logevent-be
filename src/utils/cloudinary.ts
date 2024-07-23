// src/utils/cloudinary.ts

// dependency modules
import { v2 } from 'cloudinary';

class CloudinaryUtils {
  private cloudinary = v2;

  constructor() {
    this.cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(base64File: string) {
    return new Promise<string>((resolve, reject) => {
      this.cloudinary.uploader.upload(
        base64File,
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve((result as { secure_url: string }).secure_url);
          }
        }
      );
    });
  }
}

export default new CloudinaryUtils();

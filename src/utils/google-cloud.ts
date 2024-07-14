import { Storage, Bucket } from '@google-cloud/storage';

class GoogleCloudUtils {
  private storage: Storage;
  private bucket: Bucket;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEYFILE,
    });
    this.bucket = this.storage.bucket(process.env.GCP_BUCKET ?? 'default-bucket');
  }

  async uploadFile(file: Buffer, filename: string) {
    const blob = this.bucket.file(filename);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise<string>((resolve, reject) => {
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.end(file);
    });
  }
}

export default new GoogleCloudUtils();

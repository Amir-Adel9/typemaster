import type { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function uploadImage(
  imageBase64Code: string
): Promise<UploadApiResponse> {
  try {
    const imageData = cloudinary.uploader.upload(imageBase64Code);
    return imageData;
  } catch (error) {
    return error as UploadApiResponse;
  }
}

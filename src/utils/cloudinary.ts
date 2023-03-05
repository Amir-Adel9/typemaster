// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function uploadImage(imageBase64Code: string) {
  try {
    const imageData = cloudinary.uploader.upload(imageBase64Code);
    return imageData;
  } catch (error) {
    return error;
  }
}

import QRCode from 'qrcode';
import cloudinary from 'cloudinary';
import ErrorResponse from '../utils/ErrorResponse.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Generate QR code and upload to Cloudinary
export const generateQR = async data => {
  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(data), {
      width: 400,
      margin: 2
    });

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(qrDataUrl, {
      folder: 'nexus-portal/qrcodes',
      use_filename: true,
      unique_filename: false
    });

    return result.secure_url;
  } catch (err) {
    console.error(err);
    throw new ErrorResponse('Error generating QR code', 500);
  }
};
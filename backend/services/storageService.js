import cloudinary from '../config/cloudinary.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// Upload file to Cloudinary
export const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: `nexus-portal/${folder}`,
      use_filename: true,
      unique_filename: false,
      resource_type: 'auto'
    });

    return result;
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    throw new ErrorResponse('File upload failed', 500);
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary Delete Error:', err);
    throw new ErrorResponse('File deletion failed', 500);
  }
};
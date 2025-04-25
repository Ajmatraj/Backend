import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload files to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded to Cloudinary:", response.secure_url);

    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);

    // Return both URL and public_id
    return {
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    // Remove local file if upload fails
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };

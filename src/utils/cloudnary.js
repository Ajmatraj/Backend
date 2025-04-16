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
        if (!localFilePath) return null;  // Ensure the file path is provided

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"  // Automatically detect resource type (image, video, etc.)
        });

        console.log("File uploaded to Cloudinary:", response.secure_url);  // Log the URL
        fs.unlinkSync(localFilePath);  // Clean up the local file
        return response.secure_url;  // Return the URL of the uploaded image
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);  // Log any errors
        if (localFilePath) fs.unlinkSync(localFilePath);  // Delete the local file if upload fails
        return null;  // Return null if the upload failed
    }
}

// Example for uploading from a URL
cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" },
  function(error, result) { console.log(result); });  // Log the result from Cloudinary

export { uploadOnCloudinary };

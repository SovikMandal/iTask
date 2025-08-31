import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (filePath, publicId = null) => {
    try {
        const options = {};
        if (publicId) options.public_id = publicId;
        const result = await cloudinary.uploader.upload(filePath, options);
        return result;
    } catch (error) {
        throw error;
    }
};
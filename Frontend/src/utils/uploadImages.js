import  { API_PATHS } from "./apiPaths.js";
import axiosInstance from "./axiosInstance.js";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });

        return response.data;
    } catch(error) {
        console.error("Image upload failed:", error);
        throw new Error("Failed to upload image. Please try again.");
    }
}

export default uploadImage;
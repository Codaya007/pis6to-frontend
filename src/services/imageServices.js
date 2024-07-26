import axios from "axios";
import { BACKEND_BASEURL } from "../constants";

export const updateImageToS3 = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${BACKEND_BASEURL}/ms8/media`, formData);
    // console.log(response.data.url);
    const imageUrl = response.data.url;

    return imageUrl;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
};

export const uploadImageToS3 = updateImageToS3;

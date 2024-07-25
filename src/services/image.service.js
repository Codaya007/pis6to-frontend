import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms8/media`;

export const uploadImageToS3 = async (body) => {
  const { data } = await axios.post(BASEURL, body);

  return data;
};

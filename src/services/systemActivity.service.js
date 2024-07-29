import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms6/system-activities`;

export const getAllSystemActivities = async (token, skip, limit) => {
  // Construir la URL base con skip y limit
  let url = `${BASEURL}?skip=${skip}&limit=${limit}&populate=true`;

  // Hacer la solicitud GET con axios
  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(data);

  return data;
};

export const getSystemActivityById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.results;
};

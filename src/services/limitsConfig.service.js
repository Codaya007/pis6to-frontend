import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms2/limits-config`;

export const getLimitsConfig = async (token) => {
  // Construir la URL base con skip y limit
  let url = `${BASEURL}/one`;

  // Hacer la solicitud GET con axios
  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateLimitsConfigById = async (token, id, body) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.put(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

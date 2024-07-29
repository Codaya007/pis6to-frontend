import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms3/climate-datas`;

export const CLIMATEDATA_SOCKET_URL = BASEURL;

export const getAllClimateData = async (
  token,
  skip = 0,
  limit = 10,
  filters = {}
) => {
  // Construir la URL base con skip y limit
  let url = `${BASEURL}?skip=${skip}&limit=${limit}`;

  // Añadir filtros a la URL
  for (const [key, value] of Object.entries(filters)) {
    url += `&${key}=${encodeURIComponent(value)}`;
  }

  // Hacer la solicitud GET con axios
  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getClimateDataById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

// ms3 / climate - datas / nodes;
export const getClimateDataByNodes = async (monitoringStation) => {
  let url = `${BASEURL}/nodes`;

  if (monitoringStation) url += `?monitoringStation=${monitoringStation}`;

  const { data } = await axios.get(url);

  console.log(data);

  return data.results;
};

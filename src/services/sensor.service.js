import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms2/sensors`;

export const createSensor = async (body, token) => {
  const url = `${BASEURL}`;
  console.log("body");
  console.log(body);

  const { data: sensorResponse } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(sensorResponse);
  return sensorResponse;
};

export const updateSensor = async (id, body, token) => {
  const url = `${BASEURL}/${id}`;
  console.log(`urlll ${url}`);
  console.log("bodyyy");

  const { data } = await axios.put(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(data);
  return data;
};

export const getAllSensors = async (token, skip = 10, limit = 10) => {
  const url = `${BASEURL}?skip=${skip}&limit=${limit}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getSensorById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(data);
  return data;
};

export const deleteSensorById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

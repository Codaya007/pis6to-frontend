import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms2/monitoring-stations`;

export const createMonitoringStation = async (body, token) => {
  const url = `${BASEURL}`;
  console.log("body");
  console.log(body);

  const { data: montoringStationResponse } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(montoringStationResponse);
  return montoringStationResponse;
};

export const updateMonitoringStation = async (id, body, token) => {
  const url = `${BASEURL}/${id}`;
  console.log(`urlll ${url}`);
  console.log("bodyyy");
  console.log(body);
  // const {data} = await axios.put(url, body, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  const { data } = await axios.put(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("dataaaa");
  console.log(data);
  return data;
};

export const getAllMonitoringStation = async (token, skip = 10, limit = 10) => {
  const url = `${BASEURL}?skip=${skip}&limit=${limit}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getMonitoringStationById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(data);
  return data;
};

export const deleteMonitoringStationById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

// export const forgotPassword = async (body) => {
//   const url = `${BASEURL}/forgot-password`;

//   const { data } = await axios.post(url, body);

//   return data;
// };

// export const recoveryPassword = async (token, body) => {
//   const url = `${BASEURL}/reset-password/${token}`;

//   const { data } = await axios.post(url, body);

//   return data;
// };

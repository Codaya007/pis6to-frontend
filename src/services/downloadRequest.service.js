import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";
// import { headers } from "next/headers";

const BASEURL = `${BACKEND_BASEURL}/ms5/download-requests`;

export const createDownloadRequest = async (body, token) => {
  const url = `${BASEURL}`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(url, body, config);

  return data;
};

export const getAllDownloadRequests = async (token, skip = 0, limit = 10) => {
  const url = `${BASEURL}?skip=${skip}&limit=${limit}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getAllUserDownloadRequests = async (
  token,
  skip = 0,
  limit = 10
) => {
  const url = `${BASEURL}/user?skip=${skip}&limit=${limit}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getDownloadRequestById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateDownloadRequestById = async (token, id, body) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.put(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

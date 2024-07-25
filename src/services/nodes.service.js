import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms2/nodes`;

export const createNode = async (body) => {
  const url = `${BASEURL}`;

  const { data } = await axios.post(url, body);

  return data;
};

export const updateNode = async (id, body, token) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.put(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getAllNodes = async (token, skip = 0, limit = 10) => {
  const url = `${BASEURL}?skip=${skip}&limit=${limit}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getNodeById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const deleteNodeById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateNodeById = async (token, id, body) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.put(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms1/researchers`;

export const createResearcher = async (body, token) => {
  const url = `${BASEURL}`;

  const { data } = await axios.post(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateResearcher = async (id, body, token) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.put(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getAllResearchers = async (token, skip = 0, limit = 10) => {
  const url = `${BASEURL}?skip=${skip}&limit=${limit}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const getResearcherById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const deleteResearcherById = async (token, id) => {
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

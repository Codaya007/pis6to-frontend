import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms4/alerts`;

export const getAllAlerts = async (token, skip = 0, limit = 10) => {
  const url = `${BASEURL}?skip=${skip}&limit=${limit}&populate=true`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const muteAlert = async (id, body, token) => {
  const url = `${BASEURL}/mute/${id}`;
  console.log(`body`);
  console.log(body);
  const { data } = await axios.put(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`data ${data}`);

  return data;
};

export const resolveAlert = async (id, body, token) => {
  const url = `${BASEURL}/resolve/${id}`;
  const { data } = await axios.put(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // const { data } = await axios.put(url, body);
  console.log(data);

  return data;
};

export const getAlertById = async (token, id) => {
  console.log("dentro de alertts");
  console.log(token);
  const url = `${BASEURL}/${id}`;

  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("alerta");
  console.log(data);
  return data;
};

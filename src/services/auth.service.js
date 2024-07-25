import axios from "axios";
import { BACKEND_BASEURL } from "../constants/index";

const BASEURL = `${BACKEND_BASEURL}/ms1/auth`;

export const login = async (body) => {
  const url = `${BASEURL}/login`;

  const { data: loginResponse } = await axios.post(url, body);

  console.log("Response: ", loginResponse);

  return loginResponse;
};

export const forgotPassword = async (body) => {
  const url = `${BASEURL}/forgot-password`;

  const { data } = await axios.post(url, body);

  return data;
};

export const recoveryPassword = async (token, body) => {
  const url = `${BASEURL}/reset-password/${token}`;

  const { data } = await axios.post(url, body);

  return data;
};

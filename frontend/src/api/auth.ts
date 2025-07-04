// src/api/auth.ts
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = 'http://localhost:8000/api';

export const loginUser = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/token/`, {
      username,
      password,
    });

    Cookies.set('access_token', res.data.access, { expires: 1 });  // 1 day
    Cookies.set('refresh_token', res.data.refresh, { expires: 7 }); // 7 days

    return true;
  } catch (err) {
    console.error('login error', err);
    return false;
  }
};

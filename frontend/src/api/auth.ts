import axios from "axios";
import Cookies from "js-cookie";


const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginUser = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${BASE_URL}token/`, {
      username,
      password,
    });

    Cookies.set('access_token', res.data.access, { expires: 1 });
    Cookies.set('refresh_token', res.data.refresh, { expires: 7 });
    return true;
  } catch (err) {
    console.error('login error', err);
    return false;
  }
};

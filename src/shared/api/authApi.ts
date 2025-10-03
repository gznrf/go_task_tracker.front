import axios from "axios";
import { API_CONFIG } from "@/shared/config/apiConfig";

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
});

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const res = await api.post("/login", data);
    return res.data;
  },
  register: async (data: { email: string; password: string }) => {
    const res = await api.post("/register", data);
    return res.data;
  },
};

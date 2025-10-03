const dev = "http://localhost:3000/api";
const prod = "https://myapp.com/api";

export const API_CONFIG = {
  baseUrl: import.meta.env.MODE === "production" ? prod : dev,
};
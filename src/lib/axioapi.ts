 import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
      window.location.href = "/";
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    try {
      const originalRequest = error.config as AxiosRequestConfig;
      if (error.response?.status === 401 ) {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
      
      } 
    } catch (err) {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
      window.location.href = '/';
      return Promise.reject(err);
    }
  }
);
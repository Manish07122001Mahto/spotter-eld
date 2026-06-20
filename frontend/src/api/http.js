import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message;
    if (error.code === "ECONNABORTED") {
      message = "Request timed out. Please try again.";
    } else if (!error.response) {
      message = "Unable to reach the server. Please check your connection.";
    } else {
      message =
        error.response.data?.error || error.message || "Something went wrong.";
    }
    return Promise.reject(new Error(message));
  },
);

export default http;

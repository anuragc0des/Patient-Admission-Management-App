import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8123",
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(error, resource = "request") {
  if (error.response) {
    const detail = error.response.data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).join(" ")
      : detail || error.message;
    return `Could not load ${resource} (HTTP ${error.response.status}): ${message}`;
  }

  if (error.request) {
    return `Could not connect to the API while loading ${resource}. Check that the backend is running at ${
      api.defaults.baseURL || "the current origin"
    } and that VITE_API_URL is configured correctly.`;
  }

  return error.message || `Could not load ${resource}.`;
}

export default api;

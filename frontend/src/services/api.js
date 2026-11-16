
import axios from "axios";

// Backend API configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});

// Common API error handler
const handleApiError = (error) => {
  const message =
    error.response?.data?.detail ||
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again.";

  console.error("API Error:", message);
  throw new Error(message);
};

// Backend Health Check
export const checkBackend = async () => {
  try {
    const response = await API.get("/api/health");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Document Agent - PDF, JPG, PNG Upload
export const uploadDocument = async (file, onUploadProgress) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await API.post(
      "/api/documents/upload",
      formData,
      {
        onUploadProgress: (event) => {
          if (onUploadProgress && event.total) {
            const percentage = Math.round(
              (event.loaded * 100) / event.total
            );

            onUploadProgress(percentage);
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Eligibility Agent
export const checkEligibility = async (details) => {
  try {
    const response = await API.post(
      "/api/eligibility/check",
      details
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// AI Assistant - Gemini
export const sendChatMessage = async (
  question,
  language = "English"
) => {
  try {
    const response = await API.post(
      "/api/assistant/chat",
      {
        question,
        language,
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export default API;

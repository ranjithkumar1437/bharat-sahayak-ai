
import axios from "axios";

// ==========================================
// BACKEND API CONFIGURATION
// ==========================================

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000",

  timeout: 60000,

  headers: {
    Accept: "application/json",
  },
});

// ==========================================
// COMMON API ERROR HANDLER
// ==========================================

const handleApiError = (error) => {
  const message =
    error.response?.data?.detail ||
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again.";

  console.error("API Error:", message);

  throw new Error(message);
};

// ==========================================
// BACKEND HEALTH CHECK
// ==========================================

export const checkBackend = async () => {
  try {
    const response = await API.get("/api/health");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ==========================================
// DOCUMENT AGENT - PDF, JPG, PNG UPLOAD
// ==========================================

export const uploadDocument = async (
  file,
  onUploadProgress
) => {
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

// ==========================================
// ELIGIBILITY AGENT
// ==========================================

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

// ==========================================
// GOVERNMENT SCHEMES - GET ALL / SEARCH
// ==========================================

export const getSchemes = async (
  search = "",
  category = "All"
) => {
  try {
    const response = await API.get("/api/schemes/", {
      params: {
        search: search.trim(),
        category,
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ==========================================
// GOVERNMENT SCHEMES - GET BY ID
// ==========================================

export const getSchemeById = async (schemeId) => {
  try {
    const response = await API.get(
      `/api/schemes/${encodeURIComponent(schemeId)}`
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ==========================================
// AI ASSISTANT - GEMINI
// ==========================================

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

// ==========================================
// DEFAULT API EXPORT
// ==========================================

export default API;

import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiFetch(path, options = {}) {
  const { method = "GET", body, headers = {}, skipAuthRedirect = false } = options;

  try {
    const response = await axiosInstance({
      url: path,
      method,
      data: body,
      headers,
    });

    return {
      status: response.status,
      data: response.data,
      ok: response.status >= 200 && response.status < 300,
    };
  } catch (error) {
    // Handle axios errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Auth errors → redirect (unless explicitly skipped for login/signup pages)
      if ((status === 401 || status === 403) && !skipAuthRedirect) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      return {
        status,
        data,
        ok: false,
      };
    } else if (error.request) {
      // Network errors (backend offline, no internet, etc.)
      return {
        status: 0,
        data: null,
        ok: false,
        error: {
          message: error.message,
          isNetworkError: true,
          isOffline: !navigator.onLine,
        }
      };
    } else {
      // Something else went wrong
      return {
        status: 0,
        data: null,
        ok: false,
        error: {
          message: error.message,
          isNetworkError: false,
          isOffline: false,
        }
      };
    }
  }
}

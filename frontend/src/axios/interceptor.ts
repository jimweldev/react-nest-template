import useAuthStore from "@/store/authStore";
import axios from "axios";

// PRIVATE INSTANCE
const privateInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

privateInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh the token
async function refreshToken() {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );

    useAuthStore.setState({
      user: response.data.user,
      accessToken: response.data.accessToken,
    });

    return response.data.accessToken;
  } catch (error) {
    useAuthStore.getState().removeAuth();
    throw error;
  }
}

privateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateInstance(originalRequest);
      } catch (error) {
        // Handle token refresh failure (e.g., redirect to login)
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// PUBLIC INSTANCE
const publicInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export { privateInstance, publicInstance };

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// handle logout and prevent infinite loop
const handleLogout = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// handle adding a new access token queued requests
const subscriberTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// execute queued requests after refresh
const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

// handling the api requests
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// handling expire token and refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscriberTokenRefresh(() => resolve(axiosInstance(originalRequest)));
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/refresh-user-token`,
          {},
          { withCredentials: true }
        );
        isRefreshing = false;
        onRefreshSuccess();

        return axiosInstance(originalRequest);
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

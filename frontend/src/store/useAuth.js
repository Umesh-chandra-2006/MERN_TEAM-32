import { create } from "zustand";
import axios from "axios";

// Create axios instance with base URL and credentials
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Interceptor to handle specific behaviors (optional, can be empty if no refresh needed)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, ensure local state is cleared
      // but only if it's not a checkAuth call that we expect might fail
      if (!error.config?._skipRetry) {
         useAuth.getState().logout({ silent: true });
      }
    }
    return Promise.reject(error);
  }
);

export const useAuth = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  authReady: false,
  error: null,
  login: async (userCred) => {
    set({ loading: true, error: null });
    try {
      let response = await api.post("/common-api/login", userCred);
      set({
        isAuthenticated: true,
        loading: false,
        authReady: true,
        error: null,
        currentUser: response.data.payload,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to Login. Please try again.";
      set({
        error: errorMessage,
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });
    }
  },
  logout: async (options = {}) => {
    try {
      if (!options.silent) set({ loading: true, error: null });
      await api.get("/common-api/logout");
    } catch (_error) {
      if (!options.silent) {
        set({
          error: "Failed to Logout. Please try again.",
        });
      }
    } finally {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        authReady: true,
        error: options.silent ? null : useAuth.getState().error,
      });
    }
  },
  checkAuth: async () => {
    set({ loading: true });
    try {
      // _skipRetry is used here as a hint to the interceptor or just to identify this call.
      // We use it to potentially suppress error logging or handling in a way that keeps console clean.
      let response = await api.get("/common-api/get-user", { _skipRetry: true });
      set({
        isAuthenticated: true,
        currentUser: response.data.payload,
        loading: false,
        authReady: true,
        error: null,
      });
    } catch (_error) {
      set({
        isAuthenticated: false,
        currentUser: null,
        loading: false,
        authReady: true,
      });
    }
  },
  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch("/common-api/profile", profileData);
      set({
        currentUser: response.data.payload,
        loading: false,
      });
      return response.data.payload;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update profile",
        loading: false,
      });
      throw error;
    }
  }
}));

export { api };

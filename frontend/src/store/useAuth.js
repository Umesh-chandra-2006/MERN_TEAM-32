import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async (userObj) => {
    //set loading true
    set({ loading: true, error: null });
    //make api call
    try {
      let response = await axios.post(
        "http://localhost:3000/common-api/login",
        userObj,
        { withCredentials: true },
      );
      console.log("Response object is: ", response);

      let res = response.data;

      set({
        isAuthenticated: true,
        loading: false,
        error: null,
        currentUser: res.payload,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to Login. Please try again.";
      set({
        error: errorMessage,
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });
      console.error("Error during Login: ", error);
    }
    //udate state
  },
  logout: async () => {
    try {
      set({ loading: true, error: null });
      await axios.get("http://localhost:3000/common-api/logout ", {
        withCredentials: true,
      });

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: null,
      });
    } catch (error) {
      set({
        error: "Failed to Logout. Please try again.",
        loading: false,
      });
      console.error("Error during Logout: ", error);
    }
  },
  checkAuth: async () => {
    set({ loading: true });
    try {
      let response = await axios.get(
        "http://localhost:3000/common-api/get-user",
        { withCredentials: true }
      );
      set({
        isAuthenticated: true,
        currentUser: response.data.payload,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        currentUser: null,
        loading: false,
      });
    }
  },
}));

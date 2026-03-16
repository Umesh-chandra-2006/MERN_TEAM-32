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
        "http://localhost:3000/common-api/login ",
        userObj,
        { withCredentials: true },
      );
      console.log("Response object is: ", response);

      let res = await response.data;

      set({
        isAuthenticated: true,
        loading: false,
        error: null,
        currentUser: res.payload,
      });
      console.log("Current user in state: ", useAuth.getState().currentUser);
    } catch (error) {
      set({
        error: "Failed to Login. Please try again.",
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
}));

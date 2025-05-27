import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


/****** With this function, we can check if the user is authenticated or not wherever we call this ******/
export const useAuthStore = create((set) => ({

    authUser:null, /****** Initialize authUser as null, because we don't know if the user is authenticated or not ******/

    isSigningUp: false,

    isLoggingIn: false,

    isUpdatingProfile: false,


    isCheckingAuth: true, /****** Set it true because as soon as we refresh our page, we will start checking if the user is authenticated *****/

    checkAuth: async () => {
        try {

            const res = await axiosInstance.get("/auth/check");

            set({ authUser:res.data });

        } catch (error) {

            console.log("Error in checkAuth", error);
            set({ authUser:null });

        } finally {
            /****** Set isCheckingAuth to false because we have finished checking if the user is authenticated or not ******/
            set({ isCheckingAuth:false }); 
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data });
            toast.success("Account created successfully");

        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isSigningUp: false });
        }
    }
}));
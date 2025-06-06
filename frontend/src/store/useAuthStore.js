import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "../../../backend/src/lib/socket";

const BASE_URL = "http://localhost:5001";

/****** With this function, we can check if the user is authenticated or not wherever we call this ******/
export const useAuthStore = create((set, get) => ({ /****** The get method is used to get any state or function inside this file, just like the self:: or $this-> in PHP ******/

    authUser: null, /****** Initialize authUser as null, because we don't know if the user is authenticated or not ******/

    isSigningUp: false,

    isLoggingIn: false,

    isUpdatingProfile: false,

    onlineUsers: [],

    socket: null,


    isCheckingAuth: true, /****** Set it true because as soon as we refresh our page, we will start checking if the user is authenticated *****/

    /****** We called this function whenever we refresh our page to check the user authentication ******/
    checkAuth: async () => {
        try {

            const res = await axiosInstance.get("/auth/check");

            set({ authUser:res.data });

            /****** Connect to the websocket once the user is authenticated every time ******/
            get().connectSocket();

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

            /****** Connect to the websocket once signed up ******/
            get().connectSocket();


        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post("/auth/login", data);
            set({ authUser: response.data });
            toast.success("Logged in successfully");

            /****** Connect to the websocket once logged in ******/
            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");

            get.disconnectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: response.data }); /****** Set the authUser to be the newly updated data ******/
            toast.success("Profile updated successfully");

        } catch (error ) {
            console.log("error in updating profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {

        const { authUser } = get();

        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();

        set({ socket:socket });

        /****** Listen for online users updates ******/
        socket.on("onlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    },
}));
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            // const res = await axiosInstance.get("/messages/users");

            const dummyUsers = [
                {
                  _id: "abcde",
                  name: "John Doe",
                  fullName: "John Doe",
                  email: "john.doe@example.com",
                  profilePic: "/avatar.jpg",
                },
                {
                  _id: "fghij",
                  name: "Jane Doe",
                  fullName: "Jane Doe",
                  email: "jane.doe@example.com",
                  profilePic: "/avatar.jpg",
                },
                {
                  _id: "klmno",
                  name: "Bob Smith",
                  fullName: "Bob Smith",
                  email: "bob.smith@example.com",
                  profilePic: "/avatar.jpg",
                },
            ];

            set({ users: dummyUsers });
            // set({ users: res.data });

        } catch (error) {
            // toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get(); /****** The "get()" method is used to Get the selectedUser and messages from the state  ******/
        try {
            const res = await axiosInstance.post("/messages/send/"+selectedUser._id, messageData);
            set({ messages: [...messages, res.data] }); /****** The ... is used to expand the messages array ******/
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),

}))
/****** Store the theme in the local storage, so even if the user refreshes the page, the theme will be the same ******/
/****** ******/
import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "cupcake",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    },
}));
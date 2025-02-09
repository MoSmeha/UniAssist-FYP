import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      setAuthUser: (user) => set({ authUser: user }),
    }),
    {
      name: "chat-user-storage",
      getStorage: () => localStorage,
    }
  )
);

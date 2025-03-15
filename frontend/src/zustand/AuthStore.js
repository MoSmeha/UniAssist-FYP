import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      loading: true, // Initially loading
      setAuthUser: (user) => set({ authUser: user, loading: false }),
    }),
    {
      name: "chat-user-storage",
      getStorage: () => localStorage,
    }
  )
);

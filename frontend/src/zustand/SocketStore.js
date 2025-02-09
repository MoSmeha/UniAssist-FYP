import { create } from "zustand";

export const useSocketStore = create((set) => ({
  socket: null,
  onlineUsers: [],
  actions: {
    setSocket: (socket) => set({ socket }),
    setOnlineUsers: (users) => set({ onlineUsers: users }),
  },
}));

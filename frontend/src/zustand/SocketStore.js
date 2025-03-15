import { create } from "zustand";
// componnet la ybayen min l online in real time
export const useSocketStore = create((set) => ({
  socket: null,
  onlineUsers: [],
  actions: {
    setSocket: (socket) => set({ socket }),
    setOnlineUsers: (users) => set({ onlineUsers: users }),
  },
}));

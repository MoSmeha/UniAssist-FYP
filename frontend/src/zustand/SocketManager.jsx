import { useEffect } from "react";
import { useAuthStore } from "./AuthStore";
import { useSocketStore } from "./SocketStore";
import io from "socket.io-client";
export const SocketManager = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const { socket } = useSocketStore();
  const { setSocket, setOnlineUsers } = useSocketStore(
    (state) => state.actions
  );

  useEffect(() => {
    if (authUser) {
      const newSocket = io("https://chatapp-lb.onrender.com/", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [authUser]);

  return null;
};

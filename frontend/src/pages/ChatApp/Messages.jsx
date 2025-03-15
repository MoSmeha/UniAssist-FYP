// Messages.jsx
import { useEffect, useRef } from "react";
import { Box, CircularProgress } from "@mui/material";
import useGetMessages from "../../hooks/useGetMessages";
import useListenMessages from "../../hooks/useListenMessages";
import Message from "./Message";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "calc(100vh - 230px)", // Adjust this value based on your header/footer heights
        backgroundColor: "#1a1a1a",
        overflowY: "auto",
        p: 2,
        gap: 2,
        flexGrow: 1,
        position: "relative", // For centering the loading spinner
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <CircularProgress sx={{ color: "grey.500" }} />
        </Box>
      ) : messages.length > 0 ? (
        messages.map((message, index) => (
          <Message
            key={message._id}
            message={message}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          />
        ))
      ) : (
        <Box
          sx={{
            color: "grey.500",
            textAlign: "center",
            mt: 2,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Send a message to start the conversation
        </Box>
      )}
    </Box>
  );
};

export default Messages;

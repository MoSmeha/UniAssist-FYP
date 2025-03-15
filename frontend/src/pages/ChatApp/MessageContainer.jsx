// MessageContainer.js
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import useConversation from "../../zustand/useConversation";
import { Box } from "@mui/material";

const MessageContainer = () => {
  const { selectedConversation } = useConversation();

  if (!selectedConversation) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Messages List */}
      <Box sx={{ flexGrow: 1, width: "100%", overflowY: "auto" }}>
        <Messages />
      </Box>

      {/* Message Input */}
      <Box sx={{ width: "100%", p: 2 }}>
        <MessageInput />
      </Box>
    </Box>
  );
};

export default MessageContainer;

import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthStore } from "../../zustand/AuthStore";
import "./Messages.css";
const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="chat-window">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="chat-header">
            <span className="chat-header-label">To:</span>{" "}
            <span className="chat-header-username">
              {selectedConversation.fullName}
            </span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

const NoChatSelected = () => {
  const { authUser } = useAuthStore();
  return (
    <div className="no-chat-placeholder">
      <div className="no-chat-content">
        <p>Welcome 👋 {authUser.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="no-chat-icon" />
      </div>
    </div>
  );
};

export default MessageContainer;

import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";

import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import "./Messages.css";
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
    <div className="messages-list">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {!loading && messages.length === 0 && (
        <p className="no-messages-text">
          Send a message to start the conversation
        </p>
      )}
    </div>
  );
};
export default Messages;

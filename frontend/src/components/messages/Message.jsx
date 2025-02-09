import { useAuthStore } from "../../zustand/AuthStore";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import "./Messages.css";
const Message = ({ message }) => {
  const authUser = useAuthStore((state) => state.authUser);
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatAlignment = fromMe
    ? "message-container--right"
    : "message-container--left";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  const bubbleColor = fromMe ? "message-bubble--blue" : "message-bubble--gray";
  const shakeClass = message.shouldShake ? "message-bubble--shake" : "";

  return (
    <div className={`message-container ${chatAlignment}`}>
      <div className="message-avatar">
        <div className="avatar-image">
          <img alt="Chat user avatar" src={profilePic} />
        </div>
      </div>
      <div className="message-content">
        <div className={`message-bubble ${bubbleColor} ${shakeClass}`}>
          {message.message}
        </div>
        <div className="message-timestamp">{formattedTime}</div>
      </div>
    </div>
  );
};
export default Message;

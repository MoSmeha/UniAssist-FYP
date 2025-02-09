import useConversation from "../../zustand/useConversation";
import { useSocketStore } from "../../zustand/SocketStore";
import "./Sidebar.css";
const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;

  // Use Zustand to get onlineUsers
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <div
        className={`conversation-item ${isSelected ? "selected" : ""}`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="avatar-image">
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>

        <div className="conversation-details">
          <div className="converstation-person">
            <p
              className={`conversation-name ${
                isSelected ? "selected-name" : ""
              }`}
            >
              {conversation.fullName}
            </p>
            <span className="conversation-emoji">{emoji}</span>
          </div>
        </div>
      </div>

      {!lastIdx && <div />}
    </>
  );
};

export default Conversation;

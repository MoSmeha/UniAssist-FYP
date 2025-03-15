import { useState } from "react";
import useConversation from "../../zustand/useConversation";
import TopBar from "./TopBarChat";
import MessageContainer from "./MessageContainer";
import Conversations from "./Conversations";

function ChatApp() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {selectedConversation ? (
        <>
          <TopBar
            contact={selectedConversation}
            onBack={() => {
              setSelectedConversation(null);
              setSearchTerm(""); // Clear search when going back
            }}
          />
          <MessageContainer contact={selectedConversation} />
        </>
      ) : (
        <>
          <TopBar setSearchTerm={setSearchTerm} />
          <Conversations
            setSelectedContact={setSelectedConversation}
            searchTerm={searchTerm}
          />
        </>
      )}
    </>
  );
}

export default ChatApp;

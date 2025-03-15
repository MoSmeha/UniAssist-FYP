import { List, Box, CircularProgress, Typography } from "@mui/material";
import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = ({ setSelectedContact, searchTerm }) => {
  const { loading, conversations } = useGetConversations();

  // Filter conversations based on searchTerm
  const filteredConversations = searchTerm
    ? conversations.filter((conversation) => {
        const fullName = `${conversation.firstName} ${conversation.lastName}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : conversations;

  return (
    <Box sx={{ width: "100%" }}>
      {filteredConversations.length === 0 && !loading && searchTerm && (
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
        >
          No users found matching "{searchTerm}"
        </Typography>
      )}

      <List>
        {filteredConversations.map((conversation, idx) => (
          <Conversation
            key={conversation._id}
            conversation={conversation}
            lastIdx={idx === filteredConversations.length - 1}
            setSelectedContact={setSelectedContact}
          />
        ))}
      </List>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default Conversations;

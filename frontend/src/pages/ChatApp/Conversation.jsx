import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Divider,
  Typography,
} from "@mui/material";
import { useSocketStore } from "../../zustand/SocketStore";
import useConversation from "../../zustand/useConversation"; // Import Zustand store

const Conversation = ({ conversation, lastIdx }) => {
  // console.log(conversation);
  const { setSelectedConversation } = useConversation(); // Zustand function
  const onlineUsers = useSocketStore((state) => state.onlineUsers); // Get online users
  const isOnline = onlineUsers.includes(conversation._id); // Check if user is online

  return (
    <>
      <ListItem button onClick={() => setSelectedConversation(conversation)}>
        {" "}
        {/* Use Zustand setter */}
        <ListItemAvatar>
          <Badge
            color="success"
            variant="dot"
            invisible={!isOnline}
            overlap="circular"
          >
            <Avatar
              src={conversation.profilePic}
              alt="user avatar"
              sx={{ bgcolor: "transparent" }}
            />
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={conversation.firstName + " " + conversation.lastName}
          secondary={
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.75rem" }}
            >
              {conversation.role +
                " - Department of " +
                conversation.Department}
            </Typography>
          }
        />
      </ListItem>
      {!lastIdx && <Divider variant="inset" component="li" />}
    </>
  );
};

export default Conversation;

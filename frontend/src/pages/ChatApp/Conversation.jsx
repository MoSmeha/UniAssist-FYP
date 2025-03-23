import {
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Divider,
  Typography,
  ListItemButton,
} from "@mui/material";
import { useSocketStore } from "../../zustand/SocketStore";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx }) => {
  const { setSelectedConversation } = useConversation();
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <ListItemButton onClick={() => setSelectedConversation(conversation)}>
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
      </ListItemButton>
      {!lastIdx && <Divider variant="inset" component="li" />}
    </>
  );
};

export default Conversation;

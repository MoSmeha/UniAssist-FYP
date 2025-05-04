// src/pages/tools/NotificationTool.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  IconButton,
  CircularProgress,
  Box,
  Alert,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import axios from "axios";
import toast from "react-hot-toast";
import { useSocketStore } from "../../zustand/SocketStore"; // Import the store itself
import { useAuthStore } from "../../zustand/AuthStore"; // Import the store itself
import { formatDistanceToNow } from 'date-fns';

const NotificationTool = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const socket = useSocketStore((state) => state.socket); // Get socket via selector
  const authUser = useAuthStore((state) => state.authUser); // Get authUser via selector

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/notifications/my");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(error.response?.data?.error || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotification) => {
      // Check if the notification is for the current user
      if (newNotification.to === authUser?._id) {
          setNotifications((prev) => [newNotification, ...prev]);
          toast.success(`🔔 New Notification: ${newNotification.message}`);
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => socket.off("newNotification", handleNewNotification);
  }, [socket, authUser?._id]);

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length === 0) {
      return toast.success("No unread notifications.");
    }

    setMarkingRead(true);
    try {
      await axios.post("/api/notifications/mark-read", { notificationIds: unreadIds });
      // Update state locally for immediate feedback
      setNotifications(prev => prev.map(n => unreadIds.includes(n._id) ? { ...n, read: true } : n));
      toast.success("Marked all as read.");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast.error(error.response?.data?.error || "Failed to mark notifications as read");
    } finally {
      setMarkingRead(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
            Notifications
          </Typography>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<MarkChatReadIcon />}
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0 || markingRead || loading}
          sx={{ mb: 2 }}
        >
          {markingRead ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          Mark All as Read
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>
        ) : notifications.length > 0 ? (
          <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.map((note, index) => (
              <React.Fragment key={note._id}>
                <ListItem sx={{ bgcolor: note.read ? 'transparent' : 'action.hover' }}>
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                    <Badge color="error" variant="dot" invisible={note.read}>
                       <NotificationsIcon fontSize="small" color={note.read ? "disabled" : "action"}/>
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={note.message}
                    secondary={`From: ${note.from?.fullName || 'System'} - ${formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}`}
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Alert severity="info">You have no notifications.</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationTool;


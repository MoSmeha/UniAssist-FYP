import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  AppBar,
  Toolbar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useAuthStore } from "./zustand/AuthStore";
import CloseIcon from "@mui/icons-material/Close";
import CreateAnnouncement from "./CreateAnnouncement";
import toast from "react-hot-toast";

const Announcements = () => {
  const { authUser } = useAuthStore();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [authUser]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const endpoint =
        authUser.role === "student"
          ? "/api/announcements/student"
          : "/api/announcements/teacher";

      const response = await fetch(endpoint, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAnnouncements(data.announcements || []);
      } else {
        toast.error(data.message || "Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    // Refresh announcements after closing dialog
    fetchAnnouncements();
  };

  return (
    <>
      {/* Top Bar */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography component="span" variant="h6" sx={{ flexGrow: 1 }}>
            Announcements
          </Typography>
          {authUser.role === "teacher" && (
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleDialogOpen}
            >
              Create Announcement
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography component="span" variant="h4" gutterBottom>
          {authUser.role === "student"
            ? "Announcements For You"
            : "Your Announcements"}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : announcements.length === 0 ? (
          <Typography
            component="span"
            variant="body1"
            color="textSecondary"
            sx={{ my: 4, textAlign: "center" }}
          >
            {authUser.role === "student"
              ? "No announcements available for you"
              : "You haven't created any announcements yet"}
          </Typography>
        ) : (
          <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
            {announcements.map((announcement) => (
              <ListItem key={announcement._id} divider>
                <ListItemText
                  primary={
                    <Typography component="span" variant="h6">
                      {announcement.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        {announcement.content}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        {announcement.announcementType === "major"
                          ? `For ${announcement.targetMajor} major`
                          : `For ${announcement.targetSubject} subject`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Container>

      {/* Create Announcement Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography component="span" variant="h6">
              Create New Announcement
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <CreateAnnouncement onSuccess={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Announcements;

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Divider,
  Paper,
} from "@mui/material";
import {
  Edit,
  Delete,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const TODO = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    completed: false,
  });

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todo");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Error fetching todos: " + error.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTimeChange = (field, value) => {
    const formattedTime = value ? dayjs(value).format("HH:mm") : "";
    setFormData((prev) => ({
      ...prev,
      [field]: formattedTime,
    }));
  };

  const handleToggleComplete = async (id, completed) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo._id === id ? { ...todo, completed } : todo))
    );

    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo status");
      }
    } catch (error) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: !completed } : todo
        )
      );
      console.error("Error updating todo status:", error);
      toast.error("Error updating todo status: " + error.message);
    }
  };

  const handleOpenForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      completed: false,
    });
    setEditMode(false);
    setEditingTodoId(null);
    setOpen(true);
  };

  const handleEdit = (todo) => {
    setFormData({
      title: todo.title,
      description: todo.description,
      date: todo.date.split("T")[0],
      startTime: todo.startTime,
      endTime: todo.endTime,
      completed: todo.completed,
    });
    setEditMode(true);
    setEditingTodoId(todo._id);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        const response = await fetch(`/api/todo/${editingTodoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error("Failed to update todo");
        }
      } else {
        const response = await fetch("/api/todo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error("Failed to add todo");
        }
      }
      fetchTodos();
      setOpen(false);
      toast.success(
        editMode ? "Todo updated successfully" : "Todo added successfully"
      );
    } catch (error) {
      console.error("Error saving todo:", error);
      toast.error("Error saving todo: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      fetchTodos();
      toast.success("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error deleting todo: " + error.message);
    }
  };
  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
        }}
      >
        <Toolbar>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              flexGrow: 1,
              fontWeight: 600,
            }}
          >
            Task Manager
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenForm}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor:
                theme.palette.mode === "dark" ? "white" : "white",
              color:
                theme.palette.mode === "dark"
                  ? "black"
                  : theme.palette.primary.main,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#e0e0e0" : "#f5f5f5",
              },
            }}
          >
            {isMobile ? "" : "Add Task"}
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          mt: 4,
          px: isMobile ? 1 : 3,
          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "90%",
            lg: "90%",
          },
        }}
      >
        {todos.length === 0 ? (
          <Paper
            elevation={1}
            sx={{ p: 3, textAlign: "center", mt: 2, borderRadius: 2 }}
          >
            <Typography variant="h6" color="text.secondary">
              No tasks yet. Add your first task to get started!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
              sx={{ mt: 2 }}
            >
              Add Task
            </Button>
          </Paper>
        ) : (
          <Box sx={{ mt: 2 }}>
            {todos.map((todo) => (
              <Paper
                key={todo._id}
                elevation={1}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.2s",
                  opacity: todo.completed ? 0.8 : 1,
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      "& .MuiAccordionSummary-content": {
                        margin: "12px 0",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: 1,
                        flexWrap: isMobile ? "wrap" : "nowrap",
                      }}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onChange={(e) => {
                          e.stopPropagation(); // prevent accordion toggle
                          handleToggleComplete(todo._id, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        color="primary"
                      />

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          flexGrow: 1,
                          textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                          color: todo.completed
                            ? "text.secondary"
                            : "text.primary",
                        }}
                      >
                        {todo.title}
                      </Typography>

                      {/* Date and Time info - responsive layout */}
                      {isMobile ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            ml: "auto",
                            mr: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <EventIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {new Date(todo.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <TimeIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {dayjs(todo.startTime, "HH:mm").format("h:mm A")}{" "}
                              - {dayjs(todo.endTime, "HH:mm").format("h:mm A")}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <EventIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {new Date(todo.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <TimeIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {dayjs(todo.startTime, "HH:mm").format("h:mm A")}{" "}
                              - {dayjs(todo.endTime, "HH:mm").format("h:mm A")}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  </AccordionSummary>
                  <Divider />
                  <AccordionDetails sx={{ p: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        color: theme.palette.text.secondary,
                        whiteSpace: "pre-line", // Preserves line breaks
                      }}
                    >
                      {todo.description || "No description provided."}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(todo)}
                      >
                        {isMobile ? "" : "Edit"}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(todo._id)}
                      >
                        {isMobile ? "" : "Delete"}
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            ))}
          </Box>
        )}

        {/* Form Dialog */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ pb: 1 }}>
            {editMode ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pb: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Description"
                name="description"
                fullWidth
                value={formData.description}
                onChange={handleChange}
                required
                variant="outlined"
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Date"
                name="date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <TimePicker
                    label="Start Time"
                    value={
                      formData.startTime
                        ? dayjs(formData.startTime, "HH:mm")
                        : null
                    }
                    onChange={(value) => handleTimeChange("startTime", value)}
                    ampm={true}
                    sx={{ flex: 1 }}
                  />
                  <TimePicker
                    label="End Time"
                    value={
                      formData.endTime ? dayjs(formData.endTime, "HH:mm") : null
                    }
                    onChange={(value) => handleTimeChange("endTime", value)}
                    ampm={true}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </LocalizationProvider>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading && <CircularProgress size={16} />}
              >
                {loading ? "Saving..." : editMode ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </>
  );
};
export default TODO;

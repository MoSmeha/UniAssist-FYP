// src/pages/tools/AppointmentBooking.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios"; // Assuming axios is configured for auth tokens
import toast from "react-hot-toast";
import useGetStaff from "../../hooks/useGetStaff"; // Hook to get staff/teachers
import { useAuthStore } from "../../zustand/AuthStore"; // Import the store itself

const AppointmentBooking = () => {
  const [myAppointments, setMyAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [form, setForm] = useState({ teacherId: "", date: "", reason: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const { loading: loadingStaff, staff } = useGetStaff(); // Fetch teachers/staff
  const authUser = useAuthStore((state) => state.authUser); // Get logged-in user via selector

  // Fetch user's appointments on component mount
  useEffect(() => {
    const fetchMyAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const res = await axios.get("/api/appointments/my");
        setMyAppointments(res.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error(error.response?.data?.error || "Failed to fetch appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchMyAppointments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (event) => {
    setForm({ ...form, teacherId: event.target.value });
  };

  const handleSubmit = async () => {
    if (!form.teacherId || !form.date || !form.reason) {
      return toast.error("Please select a teacher, date, and provide a reason.");
    }
    setBookingLoading(true);
    try {
      // Use the correct backend endpoint
      const res = await axios.post("/api/appointments/book", {
        teacherId: form.teacherId,
        date: form.date,
        reason: form.reason,
      });
      // Add the new appointment to the list optimistically or refetch
      setMyAppointments([res.data.appointment, ...myAppointments]);
      setForm({ teacherId: "", date: "", reason: "" }); // Reset form
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response?.data?.error || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  // Filter out the current user if they are staff
  const availableStaff = staff.filter(s => s._id !== authUser?._id);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Book an Appointment
        </Typography>

        <FormControl fullWidth margin="normal" disabled={loadingStaff}>
          <InputLabel id="teacher-select-label">Select Teacher</InputLabel>
          <Select
            labelId="teacher-select-label"
            id="teacher-select"
            name="teacherId"
            value={form.teacherId}
            label="Select Teacher"
            onChange={handleSelectChange}
          >
            {loadingStaff ? (
              <MenuItem disabled>Loading teachers...</MenuItem>
            ) : availableStaff.length > 0 ? (
              availableStaff.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.fullName} ({teacher.username})
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No teachers available</MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          label="Date and Time"
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Reason for Appointment"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={bookingLoading || loadingStaff}
          sx={{ mt: 1 }}
        >
          {bookingLoading ? <CircularProgress size={24} /> : "Book Appointment"}
        </Button>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          My Appointments
        </Typography>
        {loadingAppointments ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>
        ) : myAppointments.length > 0 ? (
          <List dense>
            {myAppointments.map((appt) => (
              <ListItem key={appt._id} divider>
                <ListItemText
                  primary={`${appt.reason} (Status: ${appt.status})`}
                  secondary={`With: ${authUser?._id === appt.studentId?._id ? appt.teacherId?.fullName : appt.studentId?.fullName} on ${new Date(appt.date).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="info">You have no upcoming appointments.</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;


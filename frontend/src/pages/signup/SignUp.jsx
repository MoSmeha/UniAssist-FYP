import { useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import GenderCheckbox from "./GenderCheckbox";
import useSignup from "../../hooks/useSignup";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    uniId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role: "",
    Department: "",
    title: "",
  });

  // State for holding all schedule entries
  const [schedule, setSchedule] = useState([]);

  // Current schedule entry state; startTime and endTime are Date objects for the TimePicker
  const [currentSchedule, setCurrentSchedule] = useState({
    day: "Monday",
    subject: "",
    startTime: dayjs(), // Instead of new Date()
    endTime: dayjs(), // Instead of new Date()
    mode: "campus",
    room: "",
  });

  const { loading, signup } = useSignup();

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mode") {
      // Automatically set room to "Microsoft Teams" when mode is online
      setCurrentSchedule((prev) => ({
        ...prev,
        mode: value,
        room: value === "online" ? "Microsoft Teams" : "",
      }));
    } else {
      setCurrentSchedule({ ...currentSchedule, [name]: value });
    }
  };

  const handleStartTimeChange = (newValue) => {
    setCurrentSchedule((prev) => ({ ...prev, startTime: newValue }));
  };

  const handleEndTimeChange = (newValue) => {
    setCurrentSchedule((prev) => ({ ...prev, endTime: newValue }));
  };

  const addScheduleEntry = () => {
    // Format the time values as strings (e.g., "09:00 AM")
    const formatTime = (dayjsObj) => dayjsObj.format("hh:mm A"); // Using dayjs format instead of toLocaleTimeString

    const formattedEntry = {
      ...currentSchedule,
      startTime: formatTime(currentSchedule.startTime),
      endTime: formatTime(currentSchedule.endTime),
    };

    setSchedule([...schedule, formattedEntry]);
    // Reset current schedule entry for new input
    setCurrentSchedule({
      day: "Monday",
      subject: "",
      startTime: dayjs(), // Use dayjs here
      endTime: dayjs(), // Use dayjs here
      mode: "campus",
      room: "",
    });
  };

  const removeScheduleEntry = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup({ ...inputs, schedule });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up ChatApp
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="University ID"
              variant="outlined"
              value={inputs.uniId}
              onChange={(e) => setInputs({ ...inputs, uniId: e.target.value })}
              fullWidth
            />
            <TextField
              label="First Name"
              variant="outlined"
              value={inputs.firstName}
              onChange={(e) =>
                setInputs({ ...inputs, firstName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Last Name"
              variant="outlined"
              value={inputs.lastName}
              onChange={(e) =>
                setInputs({ ...inputs, lastName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
              fullWidth
            />
            <GenderCheckbox
              onCheckboxChange={handleCheckboxChange}
              selectedGender={inputs.gender}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={inputs.role}
                label="Role"
                onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={inputs.Department}
                label="Department"
                onChange={(e) =>
                  setInputs({ ...inputs, Department: e.target.value })
                }
              >
                <MenuItem value="Computer and Communications Engineering">
                  Computer and Communications Engineering
                </MenuItem>
                <MenuItem value="Technology in Computer Science">
                  Technology in Computer Science
                </MenuItem>
                <MenuItem value="Human Resource Management">
                  Human Resource Management
                </MenuItem>
                <MenuItem value="Economics">Economics</MenuItem>
                <MenuItem value="Accounting, Control, and Auditing">
                  Accounting, Control, and Auditing
                </MenuItem>
                <MenuItem value="Banking and Finance">
                  Banking and Finance
                </MenuItem>
                <MenuItem value="Marketing and Management">
                  Marketing and Management
                </MenuItem>
                <MenuItem value="Nursing Sciences">Nursing Sciences</MenuItem>
                <MenuItem value="Dental Laboratory Technology">
                  Dental Laboratory Technology
                </MenuItem>
                <MenuItem value="Physical Therapy">Physical Therapy</MenuItem>
                <MenuItem value="Communication and Journalism">
                  Communication and Journalism
                </MenuItem>
                <MenuItem value="Audiovisual">Audiovisual</MenuItem>
                <MenuItem value="Graphic Design and Advertising">
                  Graphic Design and Advertising
                </MenuItem>
                <MenuItem value="Music Therapy">Music Therapy</MenuItem>
                <MenuItem value="European Art Music">
                  European Art Music
                </MenuItem>
                <MenuItem value="General Musicology of Traditions and Arabic Art Music">
                  General Musicology of Traditions and Arabic Art Music
                </MenuItem>
                <MenuItem value="Music Education Sciences and Music, Technology, and Media">
                  Music Education Sciences and Music, Technology, and Media
                </MenuItem>
                <MenuItem value="Motricity Education and Adapted Physical Activities">
                  Motricity Education and Adapted Physical Activities
                </MenuItem>
                <MenuItem value="Sports Training">Sports Training</MenuItem>
                <MenuItem value="Sports Management">Sports Management</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Title"
              variant="outlined"
              value={inputs.title}
              onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
              fullWidth
            />

            {/* Schedule Entry Section */}
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                p: 2,
                mt: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Schedule Entry
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Day</InputLabel>
                <Select
                  name="day"
                  value={currentSchedule.day}
                  label="Day"
                  onChange={handleScheduleChange}
                >
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Subject"
                name="subject"
                variant="outlined"
                value={currentSchedule.subject}
                onChange={handleScheduleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TimePicker
                  label="Start Time"
                  value={currentSchedule.startTime}
                  onChange={handleStartTimeChange}
                />

                <TimePicker
                  label="End Time"
                  value={currentSchedule.endTime}
                  onChange={handleEndTimeChange}
                />
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Mode</InputLabel>
                <Select
                  name="mode"
                  value={currentSchedule.mode}
                  label="Mode"
                  onChange={handleScheduleChange}
                >
                  <MenuItem value="campus">Campus</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Room"
                name="room"
                variant="outlined"
                value={currentSchedule.room}
                onChange={handleScheduleChange}
                fullWidth
                disabled={currentSchedule.mode === "online"}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={addScheduleEntry}>
                Add Schedule Entry
              </Button>
            </Box>

            {schedule.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Added Schedule Entries</Typography>
                <List>
                  {schedule.map((entry, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => removeScheduleEntry(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`${entry.day} - ${entry.subject}`}
                        secondary={`Time: ${entry.startTime} to ${entry.endTime} | Mode: ${entry.mode} | Room: ${entry.room}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <Typography align="center">
              <Link to="/">BackToDashboard</Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default SignUp;

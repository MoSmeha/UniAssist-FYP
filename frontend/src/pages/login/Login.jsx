import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
} from "@mui/material";
import useLogin from "../../hooks/useLogin";

const Login = () => {
  const [uniId, setUniId] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(uniId, password);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          'url("https://blogs.nottingham.ac.uk/studentlife/files/2017/08/pexels-photo-267885.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          // Optional: add a semi-transparent background to the form for readability
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login <span style={{ color: "#1976d2" }}>UniAssist</span>
        </Typography>
        <TextField
          label="uniId"
          placeholder="Enter uniId"
          variant="outlined"
          fullWidth
          margin="normal"
          value={uniId}
          onChange={(e) => setUniId(e.target.value)}
        />
        <TextField
          label="Password"
          placeholder="Enter Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box sx={{ mt: 1, textAlign: "right" }}>
          <Link component={RouterLink} to="/signup">
            Don't have an account?
          </Link>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;

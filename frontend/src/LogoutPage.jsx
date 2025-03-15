import React from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import useLogout from "./hooks/useLogout";
function LogoutPage() {
  const { loading, logout } = useLogout();

  <div className="logout-button"></div>;
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Are you sure you want to log out?
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          If you log out, you will have to sign in again to access your account.
        </Typography>
        {!loading ? (
          <LogoutIcon className="logout-icon" />
        ) : (
          <span className="loading-spinner"></span>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={logout}
          sx={{ marginTop: 2 }}
        >
          Log Out
        </Button>
      </Box>
    </Container>
  );
}

export default LogoutPage;

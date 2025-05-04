import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import ChecklistIcon from "@mui/icons-material/Checklist";
import InputIcon from "@mui/icons-material/Input";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ConstructionIcon from "@mui/icons-material/Construction";
import LayersIcon from "@mui/icons-material/Layers";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import AnnouncementIcon from "@mui/icons-material/Announcement"; // Added for Announcements

import { AccountPreview } from "@toolpad/core/Account";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { useAuthStore } from "./zustand/AuthStore";
import useLogout from "./hooks/useLogout";
import ChatApp from "./pages/ChatApp/ChatApp";
import SignUp from "../src/pages/signup/SignUp";
import ScheduleTable from "./pages/Schedule/ScheduleComponent";
import TODO from "./pages/TodoList/TodoList";
import StaffList from "./pages/StaffInfo/StaffList";
import CampaignIcon from "@mui/icons-material/Campaign";
import Announcements from "./pages/Announcement/Announcements";
import BookOnlineIcon from '@mui/icons-material/BookOnline';

import SmartToyIcon from "@mui/icons-material/SmartToy";
import ChatbotFrontend from "./Chatbot";

import NotificationTool from "./pages/tools/NotificationTool";
import AppointmentBooking from "./pages/tools/AppointmentBooking";

import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
// const NAVIGATION = [
//   {
//     kind: "header",
//     title: "Main items",
//   },
//   {
//     segment: "dashboard",
//     title: "Dashboard",
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: "Chat",
//     title: "Chat",
//     icon: <ChatIcon />,
//   },
//   {
//     segment: "staffList",
//     title: "Staff List",
//     icon: <RecentActorsIcon />,
//   },
//   {
//     segment: "Schedule",
//     title: "Schedule",
//     icon: <DateRangeIcon />,
//   },
//   {
//     kind: "divider",
//   },
//   {
//     kind: "header",
//     title: "Student Tools",
//   },
//   {
//     segment: "tools",
//     title: "Tools",
//     icon: <ConstructionIcon />,
//     children: [
//       {
//         segment: "checkList",
//         title: "checkList",
//         icon: <ChecklistIcon />,
//       },
//     ],
//   },
//   {
//     kind: "divider",
//   },
//   {
//     kind: "header",
//     title: "Analytics",
//   },
//   {
//     segment: "integrations",
//     title: "Integrations",
//     icon: <LayersIcon />,
//   },
//   {
//     segment: "SignUp",
//     title: "SignUp",
//     icon: <InputIcon />,
//   },
// ];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Update routes to include Announcements
const routes = {
  "/Chat": <ChatApp />,
  "/staffList": <StaffList />,
  "/Schedule": <ScheduleTable />,
  "/tools/checkList": <TODO />,
  "/announcements": <Announcements />,
  "/tools/AIBot": <ChatbotFrontend />,
  "/tools/Appointment": <AppointmentBooking />,
  "/tools/NotificationTool": <NotificationTool />,

  // Add Announcements route
};

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      {routes[pathname] || (
        <Typography>Dashboard content for {pathname}</Typography>
      )}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function SidebarFooterProfile({ mini }) {
  const { logout, loading } = useLogout();

  return (
    <Stack direction="column" p={0}>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          "& .MuiAvatar-root": {
            transition: "all 225ms cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "& .MuiTypography-root": {
            transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1)",
          },
        }}
      >
        <Box flexGrow={1}>
          <AccountPreview variant={mini ? "condensed" : "expanded"} />
        </Box>
        {!mini && (
          <IconButton
            aria-label="logout"
            onClick={logout}
            disabled={loading}
            sx={{
              mr: 1,
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
              },
              opacity: 1,
            }}
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Box>
    </Stack>
  );
}

SidebarFooterProfile.propTypes = {
  mini: PropTypes.bool.isRequired,
};

function DashboardLayoutBasic(props) {
  const { window } = props;
  const router = useDemoRouter("/dashboard");
  const demoWindow = window !== undefined ? window() : undefined;

  // Get the authenticated user from Zustand store
  const authUser = useAuthStore((state) => state.authUser);

  // Define a function to generate the navigation menu dynamically
  const getNavigation = () => {
    let navigation = [
      {
        kind: "header",
        title: "Main items",
      },
      {
        segment: "dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
      },
      {
        segment: "Chat",
        title: "Chat",
        icon: <ChatIcon />,
      },
      {
        segment: "staffList",
        title: "Staff List",
        icon: <RecentActorsIcon />,
      },
      {
        segment: "Schedule",
        title: "Schedule",
        icon: <DateRangeIcon />,
      },

      // Add Announcements to the main navigation
      {
        segment: "announcements",
        title: "Announcements",
        icon: <AnnouncementIcon />,
      },

      {
        kind: "divider",
      },
      {
        kind: "header",
        title: "Student Tools",
      },
      {
        segment: "tools",
        title: "Tools",
        icon: <ConstructionIcon />,
        children: [
          {
            segment: "checkList",
            title: "checkList",
            icon: <ChecklistIcon />,
          },
          {
            segment: "AIBot",
            title: "Ai chatBot",
            icon: <SmartToyIcon />,
          },
          {
            segment: "Appointment",
            title: "Apointment Booking",
            icon: <BookOnlineIcon />,
          },
          {
            segment: "NotificationTool",
            title: "Notification Tool",
            icon: <CircleNotificationsOutlinedIcon />,
          },
        ],
      },
      {
        kind: "divider",
      },
      {
        kind: "header",
        title: "Analytics",
      },
      {
        segment: "integrations",
        title: "Integrations",
        icon: <LayersIcon />,
      },
    ];

    // Only add the SignUp option if the user is an admin
    if (authUser?.role === "admin") {
      navigation.push({
        segment: "SignUp",
        title: "SignUp",
        icon: <InputIcon />,
      });
    }

    // We don't need to keep the separate CreateAnnouncement route
    // since we've integrated that functionality into the Announcements page

    return navigation;
  };

  // Create a session object using the real user data
  const userSession = authUser
    ? {
        user: {
          name: authUser.firstName + " " + authUser.lastName || "Guest User",
          email: authUser.email || "guest@example.com",
          image: authUser.profilePic || "https://via.placeholder.com/40",
        },
      }
    : {
        user: {
          name: "Guest User",
          email: "guest@example.com",
          image: "https://via.placeholder.com/40",
        },
      };

  React.useEffect(() => {
    if (!authUser && router.pathname !== "/login") {
      console.log("User not authenticated");
    }
  }, [authUser, router]);

  return (
    <AppProvider
      navigation={getNavigation()} // Use the dynamically generated navigation
      branding={{
        logo: (
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuWGq9FqPVwCUcNC30i5iPXnaNKGWGruCs5Q&s"
            alt="UniAssist"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ),
        title: "UniAssist",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      session={userSession}
    >
      <DashboardLayout slots={{ sidebarFooter: SidebarFooterProfile }}>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBasic;

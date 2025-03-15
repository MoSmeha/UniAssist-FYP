import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import ChecklistIcon from "@mui/icons-material/Checklist";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ScheduleTable from "./pages/Schedule/ScheduleComponent";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LogoutPage from "./LogoutPage";
import TODO from "./TodoList";
import ConstructionIcon from "@mui/icons-material/Construction";
import LayersIcon from "@mui/icons-material/Layers";
import ChatApp from "./pages/ChatApp/ChatApp";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import StaffList from "./pages/StaffInfo/StaffList";

const NAVIGATION = [
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
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
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
  {
    segment: "Logout",
    title: "Logout",
    icon: <LogoutIcon />, // Use a proper component
  },
];

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

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {pathname === "/Chat" ? (
        <ChatApp />
      ) : pathname === "/Logout" ? (
        <LogoutPage />
      ) : pathname === "/staffList" ? (
        <StaffList />
      ) : pathname === "/Schedule" ? (
        <ScheduleTable />
      ) : pathname === "/tools/checkList" ? (
        <TODO />
      ) : (
        <Typography>Dashboard content for {pathname}</Typography>
      )}
    </Box>
  );
}
DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

DashboardLayoutBasic.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutBasic;

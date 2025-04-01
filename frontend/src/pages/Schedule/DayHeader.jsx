const DayHeader = ({ day, theme }) => (
  <Typography
    variant="h5"
    component="h2"
    sx={{
      mb: 3,
      pl: 2,
      py: 1.5,
      fontWeight: 600,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(66, 165, 245, 0.15)"
          : "rgba(25, 118, 210, 0.1)",
      borderRadius: "8px",
      position: "relative",
      "&:before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "4px",
        backgroundColor: theme.palette.primary.main,
        borderRadius: "8px 0 0 8px",
      },
    }}
  >
    {day}
  </Typography>
);

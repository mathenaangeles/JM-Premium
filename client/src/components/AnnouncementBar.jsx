import { Box, Typography } from "@mui/material";

export default function AnnouncementBar({
  message = "Free Shipping on all Philippine Domestic Orders",
  bgColor = "secondary.main",
  textColor = "common.white",
  sticky = false,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: bgColor,
        color: textColor,
        textAlign: "center",
        py: 0.8,
        px: 2,
        fontWeight: 500,
        fontSize: { xs: "0.85rem", sm: "0.9rem" },
        position: sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 1200,
      }}
    >
      {typeof message === "string" ? (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {message}
        </Typography>
      ) : (
        message
      )}
    </Box>
  );
}

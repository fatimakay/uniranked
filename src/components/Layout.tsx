import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flex: 1, px: 2, py: 4 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

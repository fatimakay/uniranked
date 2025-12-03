import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-around" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          UniRanked
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            variant={location.pathname === "/" ? "outlined" : "text"}
          >
            Home
          </Button>
          <Button
            component={Link}
            sx={{ backgroundColor: "accent.main", color: "#000000" }}
            to="/submit"
            variant={location.pathname === "/submit" ? "outlined" : "text"}
          >
            Submit
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

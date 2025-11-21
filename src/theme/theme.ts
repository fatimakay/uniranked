import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#15616d",
    },
    secondary: {
      main: "#ff7d00",
    },
    background: {
      default: "#ffecd1",
      paper: "#ffecd1",
    },
    text: {
      primary: "#001524",
      // you could optionally set secondary text: something lighter
    },
  },
});

export default theme;

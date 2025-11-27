import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"];
  }
  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
  }
}

// Allow using color="accent" on Buttons, Chips, etc.
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    accent: true;
  }
}
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#15616D",
    },
    secondary: {
      main: "#001524",
    },
    accent: {
      main: "#FF7D00",
    },
    background: {
      default: "#FFFFFF",
      // paper: "#FFECD1",
    },
    text: {
      primary: "#001524",
    },
  },

  shape: { borderRadius: 10 },

  typography: {
    fontFamily: `"Inter","Roboto","Helvetica","Arial",sans-serif`,
    allVariants: { color: "#001524" },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;

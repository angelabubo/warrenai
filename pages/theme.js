import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#437ff1",
    },
    secondary: {
      main: "#0c7b93",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#f4f6ff",
    },
  },
});

export default theme;

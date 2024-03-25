import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
      light: "#888cd6", // Make sure to define the properties you use, like 'light'
    },
  },
});

// Correct way to initialize the app in React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

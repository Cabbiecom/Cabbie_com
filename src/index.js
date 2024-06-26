import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import "./index.css";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./AuthContext.jsx";
import { makeStyles } from '@mui/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
      light: "#888cd6", // Make sure to define the properties you use, like 'light'
    },
  },
});

const useStyles = makeStyles({
  root: {
    color: 'red', // solo como ejemplo
  },
});

// Correct way to initialize the app in React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Home, ModeOfTravel, PersonOutline } from "@mui/icons-material";

const Navbar = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/"); // Ruta para Home
        break;
      case 1:
        navigate("/Journey"); // Ruta para Journey
        break;
      case 2:
        navigate("/Profile"); // Ruta para Profile
        break;
      default:
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopRightRadius: 2,
        boxShadow: 3,
        background: "#000",
        borderRadius: 2,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{
          "& .MuiBottomNavigationAction-root": {
            "@media (max-width:600px)": {
              
              minWidth: "auto",
              padding: "6px 0",
              background: "#000",
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
          style={{ color: "#fff" }}
        />
        <BottomNavigationAction
          label="Journey"
          icon={<ModeOfTravel />}
          style={{ color: "#fff" }}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<PersonOutline />}
          style={{ color: "#fff" }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navbar;

import React, { useState, useEffect, useRef } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom"; // Si estás usando react-router para la navegación
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { auth } from "../../../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";




const ChatMessage = () => {
  //DataBase
  const [taxiUsers, setTaxiUsers] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const database = getDatabase();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (user && database) {
      // Referencia a todos los usuarios clientes
      const usersRef = dbRef(database, "Users/UsersClient");

      get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          // Filtrar por usuarios con el rol de "taxista"
          const taxiUsersFiltered = Object.entries(usersData)
            .filter(([key, value]) => value.role === "taxista")
            .map(([key, value]) => ({ uid: key, ...value }));
          setTaxiUsers(taxiUsersFiltered);
        } else {
          console.log("No se encontraron datos de usuarios en la base de datos.");
        }
      }).catch((error) => {
        console.error("Error al obtener datos de los usuarios:", error);
      });
    }
  }, [user, database]);

  return (
    <>
      <AppBar position="static" sx={{ borderRadius: 2, background: "#000" }}>
        <Toolbar>
          {/* Ícono de flecha para regresar */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, ml: 1 }}
          >
            Cabbie Chat
          </Typography>

          {/* Íconos a la derecha */}

          <IconButton color="inherit">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {taxiUsers.map((taxiUser, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={taxiUser.name} src={taxiUser.imageUrl || ""} />
            </ListItemAvatar>
            <ListItemText
              primary={taxiUser.name}
               
              sx={{ mr: 2 }} // Asegura espacio para la hora y el ícono
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ minWidth: "50px" }}
            >
              {taxiUser.name}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
};
export default ChatMessage;

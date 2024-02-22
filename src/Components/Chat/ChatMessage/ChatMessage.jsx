import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom"; // Si estás usando react-router para la navegación
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import profile from "../../../Assets/images/Cabbie.png";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const chats = [
  {
    id: 1,
    name: "Usuario 1",
    lastMessage: "Hola, ¿cómo estás?",
    time: "15:30",
  },
  { id: 2, name: "Usuario 2", lastMessage: "¿Vamos al cine?", time: "14:20" },
  {
    id: 3,
    name: "Usuario 3",
    lastMessage: "Hola, ¿cómo estás?",
    time: "15:30",
  },
  { id: 4, name: "Usuario 4", lastMessage: "¿Vamos al cine?", time: "14:20" },
];

const ChatMessage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

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
        {chats.map((chat) => (
          <ListItem key={chat.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={chat.name} src={profile} />
            </ListItemAvatar>
            <ListItemText
              primary={chat.name}
              secondary={chat.lastMessage}
              sx={{ mr: 2 }} // Asegura espacio para la hora y el ícono
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ minWidth: "50px" }}
            >
              {chat.time}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
};
export default ChatMessage;

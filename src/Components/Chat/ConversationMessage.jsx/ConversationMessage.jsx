import React, { useState, useEffect, useRef } from "react";

import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom"; // Si estás usando react-router para la navegación
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import profile from "../../../Assets/images/Cabbie.png";
import Menu from "@mui/material/Menu";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  AppBar,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Divider,
  Box,
  InputAdornment,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmojiPicker from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const ConversationMessage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  //message menu
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleOpenMenu = (event, message) => {
    setAnchorElMenu(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleMenuAction = (action) => {
    console.log(`Action ${action} selected for message: ${selectedMessage}`);
    // Aquí puedes agregar lo que sucederá cuando se seleccione una acción
    handleCloseMenu();
  };

  //chat adaptable
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setIsEmojiPickerOpen(false);
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const now = new Date();
      const timeString = now.toTimeString().substring(0, 5);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, time: timeString },
      ]);
      setMessage("");
    }
  };

  // Función para manejar el evento de clic en la flecha de regreso
  const handleBack = () => {
    navigate(-1); // Regresa a la página anterior
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const openHandle = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderRadius: 2,
          background: "#000",
        }}
      >
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

          {/* Avatar y nombre del usuario */}
          <Avatar alt="Nombre Usuario" src={profile} sx={{ ml: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, ml: 1 }}
          >
            Nombre Usuario
          </Typography>

          {/* Íconos a la derecha */}
          <IconButton
            color="inherit"
            onClick={() => {
              navigate("/CallMessageConversationMessage");
            }}
          >
            <PhoneIcon />
          </IconButton>
          <IconButton color="inherit">
            <VideocamIcon />
          </IconButton>

          <IconButton color="inherit" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={openHandle}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>Ver Contacto</MenuItem>
          <Divider />
          <MenuItem onClick={() => {}}>Buscar</MenuItem>
          <MenuItem onClick={handleClose}>Vaciar chat</MenuItem>

          <MenuItem onClick={handleClose}>Fondo de pantalla</MenuItem>
          <MenuItem onClick={handleClose}>Mensajes Temporales</MenuItem>
        </Menu>
      </AppBar>
      <Toolbar />
      <Box
        sx={{
          mt: 1,
          mb: 2,
          px: 2,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <List sx={{ width: "50%" }}>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                bgcolor: "#f0f0f0",
                borderRadius: "20px",
                mb: 1,
                maxWidth: "100%",
                alignSelf: "flex-end",
              }}
              onClick={(event) => handleOpenMenu(event, message)}
            >
              <ListItemText
                primary={msg.text}
                secondary={msg.time}
                primaryTypographyProps={{ style: { wordBreak: "break-word" } }}
              />
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
        <Menu
          anchorEl={anchorElMenu}
          open={Boolean(anchorElMenu)}
          onClose={handleCloseMenu}
        >
          {/* Aquí se mapean las opciones del menú con sus respectivos íconos */}
          <MenuItem onClick={() => handleMenuAction("action1")}>
            Acción 1
          </MenuItem>
          {/* Agrega más opciones de menú según necesites */}
        </Menu>
      </Box>

      <Box
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {isEmojiPickerOpen && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        <TextField
          fullWidth
          variant="filled"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={handleMessageChange}
          sx={{
         
            ".MuiFilledInput-root": {
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#000", // Mantiene el color de fondo al pasar el mouse
              },
              "&.Mui-focused": {
                backgroundColor: "#000", // Mantiene el color de fondo al enfocar
              },
              "input:valid + fieldset": {
                borderColor: "transparent", // Elimina el borde al validar (para variantes no filled)
              },
              "input:invalid + fieldset": {
                borderColor: "transparent", // Elimina el borde al invalidar (para variantes no filled)
              },
              "input:valid:focus + fieldset": {
                borderColor: "transparent", // Elimina el borde al enfocar y validar (para variantes no filled)
              },
              "&:after": {
                borderBottomColor: "transparent", // Elimina la línea de enfoque para la variante filled
              },
              "&:before": {
                borderBottomColor: "transparent", // Elimina la línea antes de enfocar para la variante filled
              },
            },
          }}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={toggleEmojiPicker}>
                  <InsertEmoticonIcon sx={{ color: "#fff" }} />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => {}}>
                  <AttachFileIcon sx={{ color: "#fff" }} />
                </IconButton>
                <IconButton onClick={() => {}}>
                  <CameraAltIcon sx={{ color: "#fff" }} />
                </IconButton>
                <IconButton onClick={message ? handleSendMessage : null}>
                  {message ? (
                    <SendIcon sx={{ color: "#fff" }} />
                  ) : (
                    <MicIcon sx={{ color: "#fff" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
};

export default ConversationMessage;

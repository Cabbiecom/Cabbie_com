import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";

import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MapsApI from "../../Components/GoogleMaps/GoogleMaps";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import StarIcon from "@mui/icons-material/Star";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import avatar1 from "../../Assets/images/CabbieX.jpeg";
import avatar2 from "../../Assets/images/CabbieXL.jpeg";
import { useNavigate } from "react-router-dom";
import {
  Chat,
} from "@mui/icons-material";
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { signOut } from "firebase/auth";
import { auth } from '../../Data/Database';
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";


const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = () => (
  <Box
    sx={{
      width: 30,
      height: 6,
      backgroundColor: "#fff",
      borderRadius: 3,
      position: "absolute",
      top: 8,
      left: "calc(50% - 15px)",
    }}
  />
);



const Journey = () => {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [container, setContainer] = useState(undefined);

  const database = getDatabase();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setContainer(window.document.body);
    }
    if (user) {
      setName(user.displayName || 'Usuario Anónimo');
      setPhotoURL(user.photoURL || '');

      const userRef = dbRef(database, `Users/UsersClient/${user.uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setName(userData.name);
          setPhotoURL(userData.imageUrl);
        } else {
          console.log("No se encontraron datos del usuario en la base de datos.");
        }
      }).catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      });
    }
  }, [user, database]);

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Cierre de sesión exitoso, redirigir al usuario
      navigate("/");
    }).catch((error) => {
      // Ocurrió un error en el cierre de sesión
      console.error("Error al cerrar sesión: ", error);
    });
  };

  const HandleNavegateComponents = () => {
    navigate("/ConversationMessage");
  };

  const HandleNavegateCalling = () => {
    navigate("/CallMessageConversationMessage");
  };

  const dataList = [
    {
      id: 1,
      name: "Usuario 1",
      rating: 4,
      avatar: avatar1,
    },
    {
      id: 2,
      name: "Usuario 2",
      rating: 5,
      avatar: avatar2,
    },
    {
      id: 3,
      name: "Usuario 3",
      rating: 2,
      avatar: avatar1,
    },
    {
      id: 4,
      name: "Usuario 4",
      rating: 3,
      avatar: avatar2,
    },
    // Agrega más usuarios según sea necesario
  ];

  const contarUsuarios = (dataList) => {
    return dataList.length;
  };

  const generateRating = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        color={index < rating ? "secondary" : "disabled"}
        sx={{ color: "yellow" }}
      />
    ));
  };

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openHandle = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);

  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <AppBar position="static" sx={{ borderRadius: 1, background: "#000" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CABBIE
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        open={openHandle}

        anchorEl={anchorEl}
        id="account-menu"

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

        <MenuItem onClick={handleClose}>
          <Avatar src={photoURL} /> {name}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={
            handleOpenDrawer
          }
        >
          <ListItemIcon>
            <LocalTaxiIcon fontSize="small" />
          </ListItemIcon>
          TAX Seguro
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/ChatMessage");
          }}
        >
          <ListItemIcon>
            <Chat fontSize="small" />
          </ListItemIcon>
          Chat
        </MenuItem>
        <MenuItem onClick={() => {
          navigate("/EditProfile");
        }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Box sx={{ textAlign: "center", pt: 1 }}>
        <MapsApI />
      </Box>
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
            background: "#000",
            color: "white",
            justifyContent: "center",
          }}
        >
          <Puller />

          <Typography sx={{ p: 2, color: "white" }}>
            Taxis disponibles: {contarUsuarios(dataList)}
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto",
            background: "#E0E0E0",
            color: "#000",
          }}
        >
          <List sx={{ width: "100%" }}>
            {dataList.map((item, index) => (
              <ListItem
                divider
                sx={{
                  background: "#fff",
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={item.avatar}
                    sx={{
                      color: "black",
                      Width: "100%",
                      Height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{ color: "black" }}
                  primary={item.name}
                  secondary={generateRating(item.rating)}
                />
                <ListItemIcon>
                  <IconButton
                    edge="end"
                    onClick={HandleNavegateComponents}
                    sx={{ color: "black" }}
                  >
                    <ChatIcon />
                  </IconButton>

                  <IconButton
                    edge="end"
                    onClick={HandleNavegateCalling}
                    sx={{ color: "green" }}
                  >
                    <PhoneIcon />
                  </IconButton>
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
};

Journey.propTypes = {
  window: PropTypes.func,
};

export default Journey;

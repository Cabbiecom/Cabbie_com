import React, { useEffect, useState } from "react";
import { Avatar, ListItemIcon, IconButton } from "@mui/material";

import Typography from "@mui/material/Typography";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { Chat, SosOutlined } from "@mui/icons-material";
//import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import { signOut } from "firebase/auth";
import { auth } from "../../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import MapCabbie from "./MapsTaxista/MapCabbie";
import { useSpring, animated } from "react-spring";

//import ParentComponent from "../../Controller/Controller";

const HomeTaxista = () => {
  //contenedor
  const [container, setContainer] = useState(undefined);
  //Variables del usuario
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  //Varables de navegación
  const navigate = useNavigate();
  const database = getDatabase();
  //variables de accion toogle
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 2000 },
  });

  const openHandle = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenDrawer = () => {
    setOpen(true);
  };
  //Funcion para cerrar sesión
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Cierre de sesión exitoso, redirigir al usuario
        navigate("/");
      })
      .catch((error) => {
        // Ocurrió un error en el cierre de sesión
        console.error("Error al cerrar sesión: ", error);
      });
  };
  //
  useEffect(() => {
    if (typeof window !== "undefined") {
      setContainer(window.document.body);
    }
    if (user) {
      setName(user.displayName || "Usuario Anónimo");
      setPhotoURL(user.photoURL || "");

      const userRef = dbRef(database, `Users/UsersClient/${user.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setName(userData.name);
            setPhotoURL(userData.imageUrl);
          } else {
            console.log(
              "No se encontraron datos del usuario en la base de datos."
            );
          }
        })
        .catch((error) => {
          console.error("Error al obtener datos del usuario:", error);
        });
    }
  }, [user, database]);

  if (loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error: {error.message}</div>;
  }

  if (!user) {
      return <div>Please log in</div>;
  }

  return (
    <>
      <animated.div style={fade}>
        <AppBar position="fixed" sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          background: "#000"
        }}>
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
              <Avatar src={photoURL} />
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
          <MenuItem onClick={handleOpenDrawer}>
            <ListItemIcon>
              <SosOutlined fontSize="small" />
            </ListItemIcon>
            Emergencia
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/ChatList");
            }}
          >
            <ListItemIcon>
              <Chat fontSize="small" />
            </ListItemIcon>
            Chat
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/EditProfile");
            }}
          >
            <ListItemIcon onClick={() => { }}>
              <Settings fontSize="small" />
            </ListItemIcon>
            Configuraciones
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Cerrar Sesión
          </MenuItem>
        </Menu>
        <MapCabbie />
      </animated.div>

    </>
  );
};

export default HomeTaxista;
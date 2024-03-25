import { AppBar, Avatar, Divider, IconButton, ListItem, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../Data/Database";
import { useNavigate } from "react-router-dom";
import { Chat, Dashboard, Logout, Settings, SosOutlined } from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import LocationAdmin from "../Location/LocationAdmin";


const HomeAdmin = () => {
    //

    //Variables del usuario
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    // foto state
    const [photoURL, setPhotoURL] = useState("");
    //variables de accion toogle
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    //Varables de navegación
    const navigate = useNavigate();
    const database = getDatabase();
    // ancho
    const openHandle = Boolean(anchorEl);
    //
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    //
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

    if (loading) return <div>Loading...</div>;

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <AppBar position="fixed" sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px', background: "#000"
            }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Cabbie Admin
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
                        onClick={() => {
                            navigate("/Dashboard");
                        }}
                    >
                        <ListItemIcon>
                            <Dashboard fontSize="small" />
                        </ListItemIcon>
                        Dashboard
                    </MenuItem>
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
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Cerrar Sesión
                    </MenuItem>
                </Menu>
            </AppBar>
            <LocationAdmin />
        </>
    );

}

export default HomeAdmin;
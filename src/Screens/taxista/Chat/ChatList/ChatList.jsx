import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Card,
    CardContent,
    CardActionArea,
    Menu,
    MenuItem,
    Divider
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { auth } from "../../../../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import { useSpring, animated } from "react-spring";

const ChatList = () => {
    const database = getDatabase();
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [userRole, setUserRole] = useState("");
    const [taxiUsers, setTaxiUsers] = useState([]);
    const [usuarioUsers, setUsuarioUsers] = useState([]);
    const [admin, setadmin] = useState([]);

    //Funcion del menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    // animation on wisget
    const fade = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 2000 },
    });

    const handleBack = () => {
        navigate(-1);
    };

    const handleListItemClick = (uid) => () => {
        navigate(`/Chats/${uid}`);
    };

    // Obtiene el rol del usuario actual
    useEffect(() => {
        if (user && database) {
            const userRef = dbRef(database, `Users/UsersClient/${user.uid}`);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserRole(userData.role); // Suponiendo que el rol está directamente en el objeto del usuario
                }
            });
        }
    }, [user, database]);

    // Carga los datos de taxistas si el usuario es "usuario"
    useEffect(() => {
        if (userRole === "usuario" && database) {
            const usersRef = dbRef(database, "Users/UsersClient");
            get(usersRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const taxiUsersFiltered = Object.entries(usersData)
                        .filter(([key, value]) => value.role === "taxista")
                        .map(([key, value]) => ({ uid: key, ...value }));
                    setTaxiUsers(taxiUsersFiltered);
                }
            });
        }
    }, [userRole, database]);

    // Carga los datos de usuarios si el usuario es "taxista"
    useEffect(() => {
        if (userRole === "taxista" && database) {
            const usersRef = dbRef(database, "Users/UsersClient");
            get(usersRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const usuarioUsersFiltered = Object.entries(usersData)
                        .filter(([key, value]) => value.role === "usuario")
                        .map(([key, value]) => ({ uid: key, ...value }));
                    setUsuarioUsers(usuarioUsersFiltered);
                }
            });
        }
    }, [userRole, database]);

    useEffect(() => {
        if (userRole === "admin" && database) {
            const usersRef = dbRef(database, "Users/UsersClient");
            get(usersRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const usuarioUsersFiltered = Object.entries(usersData)
                        .filter(([key, value]) => value.role === "usuario")
                        .map(([key, value]) => ({ uid: key, ...value }));
                    setUsuarioUsers(usuarioUsersFiltered);
                    const taxiUsersFiltered = Object.entries(usersData)
                        .filter(([key, value]) => value.role === "taxista")
                        .map(([key, value]) => ({ uid: key, ...value }));
                    setTaxiUsers(taxiUsersFiltered);
                }
            });
        }
    }, [userRole, database]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <animated.div style={fade} >

                <AppBar
                    raised
                    position="static" sx={{
                        borderBottomLeftRadius: '20px',
                        borderBottomRightRadius: '20px',
                        background: "#000",
                        zIndex: (theme) => theme.zIndex.drawer + 1
                    }}>
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
                            Cabbie Chats
                        </Typography>

                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            color="inherit"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleClose}>
                                Cambiar fondo
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => { }}>Buscar</MenuItem>
                            <MenuItem onClick={handleClose}>Eliminar chat</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <List sx={{ width: "100%" }}>
                    {userRole === "usuario" && taxiUsers.map((taxiUser, index) => (
                        <ListItem
                            key={index}
                            alignItems="flex-start"
                            onClick={handleListItemClick(taxiUser.uid)}
                            sx={{ cursor: 'pointer' }}
                        >

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
                    {userRole === "taxista" && usuarioUsers.map((usuarioUser, index) => (
                        <ListItem
                            key={usuarioUser.uid}
                            alignItems="flex-start"
                            onClick={handleListItemClick(usuarioUser.uid)}
                            sx={{ cursor: 'pointer' }}
                        >

                            <ListItemAvatar>
                                <Avatar
                                    alt={usuarioUser.name}
                                    src={usuarioUser.imageUrl || ""}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={usuarioUser.name}
                                sx={{ mr: 2 }} // Asegura espacio para la hora y el ícono
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ minWidth: "50px" }}
                            >
                                {usuarioUser.name}
                            </Typography>
                        </ListItem>
                    ))}
                    {userRole === "admin" &&
                        taxiUsers.map((taxiUser, index) => (
                            <>
                                <ListItem
                                    key={index}
                                    alignItems="flex-start"
                                    onClick={handleListItemClick(taxiUser.uid)}
                                    sx={{ cursor: 'pointer' }}
                                >

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
                            </>
                        ))
                    }
                    {userRole === "admin" && usuarioUsers.map((usuarioUser, index) => (
                        <>
                            <div style={{ padding: '20px' }}>
                                <Card raised sx={{
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    background: '#f4f4f4'
                                }}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary">
                                                Apartado de la Lista del chat Cliente
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>
                            <ListItem

                                key={usuarioUser.uid}
                                alignItems="flex-start"
                                onClick={handleListItemClick(usuarioUser.uid)}
                                sx={{ cursor: 'pointer' }}
                            >

                                <ListItemAvatar>
                                    <Avatar
                                        alt={usuarioUser.name}
                                        src={usuarioUser.imageUrl || ""}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={usuarioUser.name}
                                    sx={{ mr: 2 }} // Asegura espacio para la hora y el ícono
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ minWidth: "50px" }}
                                >
                                    {usuarioUser.name}
                                </Typography>
                            </ListItem>

                        </>
                    ))}
                </List>

            </animated.div>

        </>
    );
};
export default ChatList;

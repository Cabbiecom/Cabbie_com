import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { auth } from "../../../../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, get } from "firebase/database";

const ChatList = () => {
    const database = getDatabase();
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [userRole, setUserRole] = useState("");
    const [taxiUsers, setTaxiUsers] = useState([]);
    const [usuarioUsers, setUsuarioUsers] = useState([]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleListItemClick = (uid) => () => {
        navigate(`/chat/${uid}`);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <AppBar position="static" sx={{
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px',
                background: "black",
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
                        Cabbie Chat
                    </Typography>

                    <IconButton color="inherit">
                        <MoreVertIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
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

            </List>
        </>
    );
};
export default ChatList;

import { useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Snackbar, Alert } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom"; // Si estás usando react-router para la navegación
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import logo from "../../../../Assets/images/Cabbie.png";
import Menu from "@mui/material/Menu";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    AppBar,
    CssBaseline,
    Toolbar,
    IconButton,
    Typography,
    MenuItem,
    Divider,
    Box,
    InputAdornment,
    TextField,
    Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmojiPicker from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { auth } from "../../../../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    getDatabase,
    ref as dbRef,
    set,
    get,
    push,
    onValue,
    ref,
} from "firebase/database";
import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { remove } from 'firebase/database';


function ChatConversationClient() {
    //controla la visibilidad
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // Puede ser "error", "warning", "info", "success"
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    //Variable con parametros
    let { taxiUserId, UsuarioId } = useParams();
    //Toma de la ruta golocalitataión
    const location = useLocation();
    const { originAddress, destinationAddress } = location.state || {};
    //Constantes del chat
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    //Variable con parametros
    const [user, loading, error] = useAuthState(auth);
    const database = getDatabase();
    const navigate = useNavigate();
    //message menu
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    // Constantes usuario photo
    const [name, setName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    // Estado para almacenar la información de todos los participantes
    const [participantsInfo, setParticipantsInfo] = useState({});

    // Estado para almacenar la información de todos los usuarios
    const [usersInfo, setUsersInfo] = useState({});
    //COnstatntes para renderisar images
    const [imagePreview, setImagePreview] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleCapture = ({ target }) => {
        const fileReader = new FileReader();
        const file = target.files[0];

        if (file) {
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                setImagePreview(fileReader.result);
                setOpenDialog(true);
            };
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSendPhoto = () => {
        if (!imagePreview) {
            console.error("No hay imagen para previsualizar.");
            return;
        }


        // Obtiene una referencia al almacenamiento de Firebase
        const storage = getStorage();
        const storagePath = `Users/UsersClient/imagesclient/${new Date().getTime()}`;
        const imageRef = storageRef(storage, storagePath);

        // Aquí debes convertir imagePreview (que es una URL de objeto local) a un Blob o File
        // Esto es un ejemplo y puede variar según cómo esté configurado imagePreview
        fetch(imagePreview)
            .then((response) => response.blob())
            .then((blob) => {
                const uploadTask = uploadBytesResumable(imageRef, blob);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Progreso de la subida
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                    },
                    (error) => {
                        // Manejar errores aquí
                        console.error(error);
                        // Aquí podrías actualizar el estado para mostrar un mensaje de error al usuario.
                        setSnackbarMessage("Error al cargar la imagen");
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);
                    },
                    () => {
                        // Obtiene la URL de la imagen subida y guarda el mensaje en la base de datos
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log("File available at", downloadURL);
                            setSnackbarMessage("File available at", downloadURL);
                            setSnackbarSeverity("succes");
                            setSnackbarOpen(true);

                            // Guarda el mensaje en la base de datos
                            const database = getDatabase();
                            const chatRef = dbRef(database, `Chats/${chatId}/messages/imagesclient`);
                            const newMessageRef = push(chatRef);
                            set(newMessageRef, {
                                senderId: user.uid,
                                imageUrl: downloadURL, // Usa la URL de la imagen como parte del mensaje
                                timestamp: Date.now(),
                                type: "image", // Puedes usar este campo para diferenciar mensajes de texto e imágenes
                            });

                            // Limpia la previsualización y cierra el diálogo
                            setImagePreview(null);
                            setOpenDialog(false);
                        });
                    }
                );
            }
            );
    };


    //Variables para el role
    const chatId =
        user?.uid < UsuarioId
            ? `${user?.uid}_${UsuarioId}`
            : `${UsuarioId}_${user?.uid}`;

    //Menu del menssage
    const handleOpenMenu = (event, message) => {
        console.log("Abriendo menú para mensaje:", message);
        setAnchorElMenu(event.currentTarget);
        setSelectedMessage(message.id);
    };
    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const handleMenuAction = (action) => {
        if (action === "delete") {
            // Asegúrate de que selectedMessage sea el ID del mensaje a eliminar
            deleteMessage(selectedMessage);
            // El manejo de mensajes y estado de snackbar se puede mover a la función deleteMessage
        } else {
            setSnackbarMessage(`Action ${action} selected for message: ${selectedMessage}`);
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
        }
        handleCloseMenu();
    };


    //anchor
    const [anchorEl, setAnchorEl] = React.useState(null);

    const openHandle = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //chat adaptable
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    //Imagen del chat
    useEffect(() => {
        const usersRef = dbRef(database, "Users/UsersClient");
        get(usersRef).then((snapshot) => {
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                setUsersInfo(usersData);
            }
        });
    }, [database]);
    // Cargar la información de todos los usuarios al iniciar el componente
    useEffect(() => {
        if (user) {
            setName(user.displayName || "Usuario Anónimo");
            setPhotoURL(user.photoURL || "");

            // Asumiendo que el `user` tiene un campo `role` que indica si es un usuario o un taxista
            const userRole = user.role; // Este valor debería venir de alguna parte, tal vez del auth state o un contexto
            const targetUserId = userRole === "usuario" ? taxiUserId : UsuarioId; // Decidir a quién cargar basado en el rol

            // Forma correcta de usar el path, asegurándose de que esté bien formado
            const path = `Users/UsersClient/${targetUserId}`;
            const userRef = dbRef(database, path);

            get(userRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        setUsersInfo(snapshot.val());
                        setName(setUsersInfo.name);
                        setPhotoURL(setUsersInfo.imageUrl);
                    } else {
                        setSnackbarMessage("No se encontraron datos.");
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);
                    }
                })
                .catch((error) => {
                    setSnackbarMessage("Error al obtener datos:", error);
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                });
        }
    }, [UsuarioId, database, taxiUserId, user]);
    // Cargar mensajes y asegurarse de tener la información del usuario
    useEffect(() => {
        const messagesRef = dbRef(database, `Chats/${chatId}/messages`);
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Asegúrate de que haya datos antes de proceder
                const messagesList = Object.keys(data).map((key) => ({
                    ...data[key],
                    id: key,
                }));

                // Nuevo array para almacenar tanto los mensajes normales como los de ubicación
                let combinedMessages = [];

                // Iterar sobre los mensajes para obtener información del usuario si es necesario
                messagesList.forEach((msg) => {
                    // Agregar el mensaje directamente si no es un mensaje de ubicación
                    if (msg.type !== "location") {
                        combinedMessages.push(msg);
                    } else {
                        // Cargar mensajes de ubicación desde la ruta específica
                        const viajeRef = dbRef(
                            database,
                            `Chats/${chatId}/messages/Viajes/${msg.id}`
                        );
                        get(viajeRef)
                            .then((viajeSnapshot) => {
                                if (viajeSnapshot.exists()) {
                                    const viajeData = viajeSnapshot.val();
                                    // Asegúrate de que la información de la ubicación esté completa antes de agregarla
                                    if (
                                        viajeData.originAddress &&
                                        viajeData.destinationAddress &&
                                        viajeData.mapImageUrl
                                    ) {
                                        combinedMessages.push({
                                            ...msg,
                                            originAddress: viajeData.originAddress,
                                            destinationAddress: viajeData.destinationAddress,
                                            imageUrl: viajeData.mapImageUrl,
                                            link: viajeData.routeMessage,
                                            // Aquí puedes añadir cualquier otra información relevante de viajeData
                                        });

                                        // Actualiza el estado de mensajes después de procesar la información de ubicación
                                        setMessages(combinedMessages);
                                    }
                                }
                            })
                            .catch((error) => {
                                console.error("Error al cargar la ubicación del viaje:", error);
                            });
                    }

                    if (msg.senderId && !usersInfo[msg.senderId]) {
                        fetchUserInfo(msg.senderId).then((userInfo) => {
                            if (userInfo) {
                                setUsersInfo((prevInfo) => ({
                                    ...prevInfo,
                                    [msg.senderId]: userInfo,
                                }));
                            }
                        });
                    }
                });
                // Asegúrate de actualizar el estado fuera de la condición de ubicación, para los mensajes normales
                if (!messagesList.some((msg) => msg.type === "location")) {
                    setMessages(combinedMessages);
                }
            }
        });
    }, [chatId, database, fetchUserInfo, messages, usersInfo]);

    // Cargar mensajes
    useEffect(() => {
        const chatId =
            user?.uid < UsuarioId
                ? `${user?.uid}_${UsuarioId}`
                : `${UsuarioId}_${user?.uid}`;
        const messagesRef = dbRef(database, `Chats/${chatId}/messages`);
        onValue(messagesRef, (snapshot) => {
            const messagesList = [];
            snapshot.forEach((childSnapshot) => {
                messagesList.push({ ...childSnapshot.val(), id: childSnapshot.key });
            });
            setMessages(messagesList);
        });
    }, [user, UsuarioId, database]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchUserInfo(userId) {
        const userRef = dbRef(database, `Users/UsersClient/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            return snapshot.val(); // Devuelve los datos del usuario
        } else {
            setSnackbarMessage(
                "No se encontraron datos del usuario para ID:",
                userId
            );
            setSnackbarSeverity("succes");
            setSnackbarOpen(true);
            return null; // Devuelve null si no hay datos
        }
    }

    //emoji
    const toggleEmojiPicker = () => {
        setIsEmojiPickerOpen(!isEmojiPickerOpen);
    };
    const handleEmojiClick = (event, emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
        setIsEmojiPickerOpen(false);
    };

    const handleSendMessage = () => {
        // Implementa la lógica para enviar un mensaje
        if (!user) {
            setSnackbarMessage("No hay usuario autenticado");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            navigate("/");
            return;
        }
        if (message.trim() !== "") {
            const chatRef = dbRef(database, `Chats/${chatId}/messages`);
            const newMessageRef = push(chatRef);
            set(newMessageRef, {
                senderId: user.uid,
                text: message.trim(),
                timestamp: Date.now(),
            });
            setMessage("");
        }
    };

    //Carga del mapa de la ruta
    useEffect(() => {
        if (originAddress && destinationAddress) {
            // Simula el envío de un mensaje con la información de la ruta
            const routeMessage = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                originAddress
            )}&destination=${encodeURIComponent(
                destinationAddress
            )}&travelmode=driving`;

            const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                originAddress
            )}&destination=${encodeURIComponent(
                destinationAddress
            )}&travelmode=driving&zoom=12&size=400x400&markers=color:red|label:M|40.712775,-74.005973&key=AIzaSyCExz27MMGSdeZw-l1-qReRPSfEUgNV4po`;

            const now = new Date();
            const timeString = now.toLocaleTimeString();
            console.log(timeString);
            // Suponiendo que tienes un identificador único para cada viaje o usuario
            const viajeId = `viaje_${now.getTime()}`;

            const database = getDatabase();
            const viajesRef = ref(
                database,
                `Chats/${chatId}/messages/Viajes/${viajeId}`
            );

            // Guardar la información del viaje en Firebase
            set(viajesRef, {
                originAddress,
                destinationAddress,
                routeMessage,
                mapImageUrl,
                time: timeString,
                // Puedes agregar cualquier otro detalle aquí
            })
                .then(() => {
                    setSnackbarMessage("Viaje guardado con éxito.");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                })
                .catch((error) => {
                    setSnackbarMessage("Error al guardar el viaje:", error);
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                });

            const createLocationMessage = (
                routeMessage,
                mapImageUrl,
                origin,
                destination,

            ) => {
                return {
                    type: "location",
                    link: routeMessage,
                    imageUrl: mapImageUrl,
                    origin,
                    destination,
                    textrut: `Ruta a ${destinationAddress}.`,
                    sender: "system",
                    time: timeString
                };
            };

            setMessages((prevMessages) => [
                ...prevMessages,
                createLocationMessage(
                    routeMessage,
                    mapImageUrl,
                    originAddress,
                    destinationAddress,
                    timeString
                ),

            ]);
            //console.log("Route Message URL:", routeMessage);
            //console.log("Map Image URL:", mapImageUrl);
            // Aquí, después de actualizar el estado.

        }
    }, [originAddress, destinationAddress, chatId]);

    // MessageText.js
    function MessageText({ msg, userUid, participantsInfo }) {
        // Componente para mensajes de texto
        return (
            <>
                <ListItem

                    sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor:
                            msg.senderId === user.uid ? "#808080" : "#f0f0f0",
                        color: msg.senderId === user.uid ? "#fff" : "#000",
                        borderRadius: "20px",
                        mb: 1,
                        maxWidth: "100%",
                        alignSelf:
                            msg.senderId === user.uid ? "flex-end" : "flex-start",
                    }}
                >
                    <ListItemText

                    >
                        <Typography
                            variant="body2"
                            color={msg.senderId === user.uid ? "#f4f4f4" : "#000"}
                            sx={{ wordBreak: "break-word" }}
                        >
                            {msg.text}
                        </Typography>
                        <Typography
                            variant="body3"
                            color={msg.senderId === user.uid ? "#f4f4f4" : "#000"}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </Typography>

                    </ListItemText>

                </ListItem>
            </>
        );
    }

    //Funcion delete
    const deleteMessage = (messageId) => {
        const messageRef = dbRef(database, `Chats/${chatId}/messages/${messageId}`);
        remove(messageRef)
            .then(() => {
                console.log("Mensaje eliminado exitosamente");
                // Aquí puedes actualizar el estado o realizar otras acciones después de la eliminación exitosa
                setSnackbarMessage("Mensaje eliminado exitosamente");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            })
            .catch((error) => {
                console.error("Error eliminando mensaje: ", error);
                // Manejar el error, posiblemente actualizando el estado para mostrar un mensaje de error
                setSnackbarMessage("Error al eliminar mensaje");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };


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
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    background: "black",
                    visibility: "visible",
                    display: "-moz-initial",
                }}
            >
                {usersInfo && (
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Avatar src={usersInfo.imageUrl} alt={usersInfo.name} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 1,
                                ml: 1,
                                color: "#fff",
                            }}
                        >
                            {usersInfo.name}
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
                )}
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
                    <MenuItem onClick={() => { }}>Buscar</MenuItem>
                    <MenuItem onClick={handleClose}>Vaciar chat</MenuItem>

                    <MenuItem onClick={handleClose}>Fondo de pantalla</MenuItem>
                    <MenuItem onClick={handleClose}>Mensajes Temporales</MenuItem>
                </Menu>
            </AppBar>
            <Toolbar />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

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
                <List sx={{ width: "100%" }}>
                    {messages.map((msg, index) => (
                        // Encuentra la información del usuario basado en msg.senderId
                        <React.Fragment key={msg.id || index}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        msg.senderId === user.uid ? "flex-end" : "flex-start",
                                    gap: "20px",
                                }}
                            >

                                <>
                                    {msg.senderId !== user.uid &&
                                        // Asegúrate de que tienes información del remitente antes de intentar mostrarla
                                        (participantsInfo[msg.senderId] ? (
                                            <Avatar
                                                src={participantsInfo[msg.senderId].imageUrl}
                                                alt={
                                                    participantsInfo[msg.senderId].name ||
                                                    "Nombre Desconocido"
                                                }
                                            />
                                        ) : (
                                            <Avatar
                                                src={usersInfo?.imageUrl}
                                                alt={usersInfo?.name || "Nombre Desconocido"}
                                            />
                                        ))}
                                    {msg.type === "location" && msg.imageUrl ? (
                                        <>
                                            <div
                                                style={{
                                                    cursor: "pointer",
                                                    maxWidth: "80%",
                                                    alignSelf: msg.senderId === user.uid ? "flex-start" : "flex-end",
                                                }}
                                                onClick={() => window.open(msg.link, "_blank")}
                                            >
                                                <Typography variant="body2" color="textSecondary">
                                                    Ruta desde {originAddress} a {destinationAddress}
                                                </Typography>
                                                <img
                                                    src={msg.imageUrl}
                                                    alt="Mapa de la ruta"
                                                    style={{
                                                        width: "200px",
                                                        height: "20vh", borderRadius: "20px"
                                                    }}
                                                />
                                                <Typography variant="body2" color="textSecondary">
                                                    {msg.time}, Toque para ver detalles
                                                </Typography>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div onClick={(event) => handleOpenMenu(event, msg)}>
                                                <MessageText msg={msg} userUid={user.uid} participantsInfo={participantsInfo} />
                                            </div>
                                        </>
                                    )}
                                    {msg.type === "image" && (
                                        <img src={msg.imageUrl}
                                            alt="Imagen enviada"
                                            style={{
                                                maxWidth: "200px",
                                                maxHeight: "200px",
                                                borderRadius: "10px"
                                            }} />
                                    )}
                                    {msg.senderId === user.uid && (
                                        <>
                                            <Avatar
                                                src={usersInfo[msg.senderId]?.imageUrl || logo}
                                                alt={
                                                    usersInfo[msg.senderId]?.name ||
                                                    "Nombre Desconocido"
                                                }
                                            />
                                        </>
                                    )}
                                </>

                            </div>
                        </React.Fragment>
                    ))}
                    {imagePreview && (
                        <div>
                            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                <DialogTitle>Enviar Foto</DialogTitle>
                                <DialogContent>
                                    <Avatar
                                        src={imagePreview}
                                        alt="Previsualización"
                                        sx={{ width: 100, height: 100, mx: "auto" }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                                    <Button onClick={handleSendPhoto}>Enviar</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    )}
                </List>

                <br />
                <br />
                <Menu
                    anchorEl={anchorElMenu}
                    open={Boolean(anchorElMenu)}
                    onClose={handleCloseMenu}
                >
                    {/* Aquí se mapean las opciones del menú con sus respectivos íconos */}
                    <MenuItem onClick={() => handleMenuAction("delete")}>
                        Delete
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
                    onChange={(e) => setMessage(e.target.value)}
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
                                <IconButton onClick={() => { }}>
                                    <AttachFileIcon sx={{ color: "#fff" }} />
                                </IconButton>

                                <input
                                    accept="image/*"
                                    capture="environment" // Esto sugiere al navegador que use la cámara trasera en dispositivos móviles
                                    style={{ display: "none" }}
                                    id="icon-button-file"
                                    type="file"
                                    onChange={handleCapture}
                                />
                                <label htmlFor="icon-button-file">
                                    <IconButton component="span">
                                        <CameraAltIcon sx={{ color: "#fff" }} />
                                    </IconButton>
                                </label>
                                <IconButton>
                                    {message ? (
                                        <IconButton onClick={handleSendMessage}>
                                            <SendIcon sx={{ color: "#fff" }} />
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => { }}>
                                            <MicIcon sx={{ color: "#fff" }} />
                                        </IconButton>
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </>
    );
}
export default ChatConversationClient;

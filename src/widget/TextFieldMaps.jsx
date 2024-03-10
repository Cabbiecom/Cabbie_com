import {
    Box,
    IconButton,
    TextField,
    SwipeableDrawer,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemIcon,
    Typography,
    Card,
    CardContent,
    Alert,
    Fab,
} from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    useLoadScript,
    GoogleMap,
    StandaloneSearchBox,
    DirectionsRenderer,
} from "@react-google-maps/api";
import { LocationOnOutlined, Minimize, MyLocation, ShareLocationOutlined } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { auth } from "../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import Draggable from "react-draggable";

const libraries = ["places"];

// Configuración Drawer
const drawerBleeding = 56;
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
const Root = styled("div")(({ theme }) => ({
    height: "100%",
    backgroundColor:
        theme.palette.mode === "light"
            ? grey[100]
            : theme.palette.background.default,
}));

// Estilos del mapa
const mapContainerStyle = {
    width: "100%",
    height: "80vh",
};

const center = {
    lat: 10,
    lng: 10,
};

const TextFieldMaps = () => {
    // Carga de la API
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Reemplaza con tu clave API de Google Maps
        libraries,
    });

    // Localizar taxista
    const [taxiLocation, setTaxiLocation] = useState({ lat: null, lng: null });

    // Acceso a la base de datos
    const navigate = useNavigate();
    const database = getDatabase();

    // Constantes para la Conexión Taxista
    const [taxiUsers, setTaxiUsers] = useState([]);
    const [user, loading, error] = useAuthState(auth);

    // Constantes de las Acciones del Drawer
    const [container, setContainer] = useState(undefined);
    const [mapVisible, setMapVisible] = useState(false);
    const [open, setOpen] = useState(false);

    // Constantes para obtener la ubicación
    const [originAddress, setOriginAddress] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");
    const [originSearchBox, setOriginSearchBox] = useState(null);
    const [destinationSearchBox, setDestinationSearchBox] = useState(null);

    // Constatntes de Destino del renderizado
    const [directionsResponse, setDirectionsResponse] = useState(null);

    //Constatntes del Alert
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // Renderizado del mapa de google
    const mapRef = useRef(null);
    const myRef = useRef(null);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // Calculo de la ruta en el Mapa
    const calculateRoute = async () => {
        if (originAddress === "" || destinationAddress === "") {
            return;
        }
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: originAddress,
            destination: destinationAddress,
            travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
    };

    const onOriginPlacesChanged = () => {
        if (originSearchBox && originSearchBox.getPlaces) {
            const places = originSearchBox.getPlaces();
            if (places && places.length > 0) {
                setOriginAddress(places[0].formatted_address);
            }
        }
    };

    const onDestinationPlacesChanged = () => {
        if (destinationSearchBox && destinationSearchBox.getPlaces) {
            const places = destinationSearchBox.getPlaces();
            if (places && places.length > 0) {
                setDestinationAddress(places[0].formatted_address);
            }
        }
    };
    // Funcion toogle
    const [BoxVisible, setBoxVisible] = useState(true);

    const toggleBoxVisibility = () => {
        setBoxVisible(!BoxVisible);
    };
    // Funcione del Drawer
    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setOpen(open);
    };

    const HandleNavegateComponents = () => {
        navigate("/ConversationMessage");
    };

    const HandleNavegateCalling = () => {
        navigate("/CallMessageConversationMessage");
    };

    const handleVerMapsClick = () => {
        setMapVisible(true);
        calculateRoute(true);
        setOpen(true);
    };

    //
    const handleShareMapsClick = async () => {
        if (originAddress === "" || destinationAddress === "") {
            setAlertMessage("Origen o destino no especificado.");
            setShowAlert(true);
            return;
        }

        // Aquí se asume que `originAddress` y `destinationAddress` contienen direcciones o coordenadas válidas.
        const googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
            originAddress
        )}&destination=${encodeURIComponent(
            destinationAddress
        )}&travelmode=driving`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Compartir Ubicación",
                    text: "Mira esta ubicación en el mapa.",
                    url: googleMapsRouteUrl,
                });
            } catch (error) {
                setAlertMessage("Error compartiendo la ubicación");
                setShowAlert(true);
            }
        } else {
            // Opcionalmente, aquí puedes manejar la situación para navegadores que no soporten navigator.share
            setAlertMessage("Compartir no es soportado en este navegador.");
            setShowAlert(true);
        }
    };

    // Localizar taxi
    const HandleLocation = () => {
        const taxista = taxiUsers.find((user) => user.role === "taxista");
        console.log(taxista); // Depurar el usuario taxista encontrado

        const taxistaLocation = taxista?.ubication;
        if (taxistaLocation) {
            setTaxiLocation(taxistaLocation);
        } else {
            console.log("No se encontró la ubicación del taxista");
        }
    };

    //Generador de rating
    const generateRating = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <StarIcon
                key={index}
                color={index < rating ? "secondary" : "disabled"}
                sx={{ color: "yellow" }}
            />
        ));
    };

    useEffect(() => {
        if (user && database) {
            // Referencia a todos los usuarios clientes
            const usersRef = dbRef(database, "Users/UsersClient");

            get(usersRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const usersData = snapshot.val();
                        // Filtrar por usuarios con el rol de "taxista"
                        const taxiUsersFiltered = Object.entries(usersData)
                            .filter(([key, value]) => value.role === "taxista")
                            .map(([key, value]) => ({ uid: key, ...value }));
                        setTaxiUsers(taxiUsersFiltered);
                    } else {
                        console.log(
                            "No se encontraron datos de usuarios en la base de datos."
                        );
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener datos de los usuarios:", error);
                });
        }
    }, [user, database]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setOriginAddress(
                `${position.coords.latitude}, ${position.coords.longitude}`
            );
        });
        if (typeof window !== "undefined") {
            setContainer(window.document.body);
        }
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <>
            <Box
                sx={{
                    height: "90vh",
                    width: "100%",
                    position: "relative",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                }}
            >


                <Box
                    sx={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        position: mapVisible ? "fixed" : "absolute",
                        top: mapVisible ? "30%" : "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        width: BoxVisible ? "auto" : "auto",

                        padding: BoxVisible ? 1 : 0,
                        borderRadius: mapVisible ? 2 : 0,
                        background: mapVisible ? "#FFFFFF" : "none",
                    }}
                >
                    <IconButton onClick={toggleBoxVisibility}
                        sx={{
                            alignSelf: 'flex-end',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            alignContent: 'center'
                        }}>
                        <Minimize />
                    </IconButton>
                    {BoxVisible && (
                        <><StandaloneSearchBox
                            onLoad={setOriginSearchBox}
                            onPlacesChanged={onOriginPlacesChanged}
                        >
                            <TextField
                                label="Enter origin"
                                variant="filled"
                                sx={{
                                    width: "100%",
                                    backgroundColor: "#EDEDED",
                                    borderRadius: 2,
                                    "& .MuiFilledInput-underline:before": {
                                        borderBottom: "none", // Elimina la línea inferior en el estado normal
                                    },
                                    "& .MuiFilledInput-underline:after": {
                                        borderBottom: "none", // Elimina la línea inferior en el estado activo/foco
                                    },
                                    "& .MuiFilledInput-underline:hover:before": {
                                        borderBottom: "none", // Elimina la línea inferior al pasar el ratón por encima
                                    },
                                    "& .MuiFilledInput-root": {
                                        backgroundColor: "rgba(0,0,0,0)", // Hace el fondo transparente
                                        "&:hover": {
                                            backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente al pasar el ratón por encima
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente en el estado de foco
                                        },
                                    },
                                }}
                                value={originAddress}
                                onChange={(e) => setOriginAddress(e.target.value)}
                            />
                        </StandaloneSearchBox>
                            <StandaloneSearchBox
                                onLoad={setDestinationSearchBox}
                                onPlacesChanged={onDestinationPlacesChanged}
                            >
                                <TextField
                                    label="Enter destination"
                                    variant="filled"
                                    value={destinationAddress}
                                    onChange={(e) => setDestinationAddress(e.target.value)}
                                    sx={{
                                        width: "100%",
                                        backgroundColor: "#EDEDED",
                                        borderRadius: 2,
                                        "& .MuiFilledInput-underline:before": {
                                            borderBottom: "none", // Elimina la línea inferior en el estado normal
                                        },
                                        "& .MuiFilledInput-underline:after": {
                                            borderBottom: "none", // Elimina la línea inferior en el estado activo/foco
                                        },
                                        "& .MuiFilledInput-underline:hover:before": {
                                            borderBottom: "none", // Elimina la línea inferior al pasar el ratón por encima
                                        },
                                        "& .MuiFilledInput-root": {
                                            backgroundColor: "rgba(0,0,0,0)", // Hace el fondo transparente
                                            "&:hover": {
                                                backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente al pasar el ratón por encima
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente en el estado de foco
                                            },
                                        },
                                    }}
                                />
                            </StandaloneSearchBox>
                            <Card>
                                <CardContent>
                                    <IconButton onClick={handleVerMapsClick}>
                                        Ver
                                        <LocationOnOutlined sx={{ color: "red" }} fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleShareMapsClick}>
                                        Share
                                        <ShareLocationOutlined sx={{ color: "red" }} fontSize="small" />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </>

                    )}

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginTop: "-4%",
                    }}
                >
                    {mapVisible && (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={8}
                            center={center}
                            onLoad={onMapLoad}
                        >
                            {directionsResponse && (
                                <DirectionsRenderer directions={directionsResponse} />
                            )}
                        </GoogleMap>
                    )}
                </Box>
                {showAlert && (
                    <Alert
                        severity="error"
                        onClose={() => setShowAlert(false)} // Permite cerrar el alert
                    >
                        {alertMessage}
                    </Alert>
                )}
                <SwipeableDrawer
                    anchor={"bottom"}
                    open={open}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                    container={container}
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
                            Taxis disponibles: {taxiUsers.length}
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
                            {taxiUsers.map((taxiUser, index) => (
                                <ListItem
                                    key={index}
                                    divider
                                    sx={{
                                        background: "#fff",
                                        borderRadius: 1,
                                        mb: 1,
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={taxiUser.imageUrl || ""}
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
                                        primary={taxiUser.name}
                                        secondary={generateRating(taxiUser.rating)}
                                    />
                                    <ListItemIcon
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <IconButton
                                            edge="end"
                                            onClick={HandleLocation}
                                            sx={{ color: "red", marginRight: "4px" }}
                                        >
                                            <LocationOnOutlined />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={HandleNavegateComponents}
                                            sx={{ color: "black", marginRight: "4px" }}
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
            </Box>

        </>
    );
};
export default TextFieldMaps;

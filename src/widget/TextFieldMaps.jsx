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
    Alert,
    Card,
    CardContent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    useLoadScript,
    GoogleMap,
    StandaloneSearchBox,
    DirectionsRenderer,
    Marker,
} from "@react-google-maps/api";
import {
    LocationOnOutlined,
    Minimize,
    ShareLocationOutlined,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { auth } from "../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    getDatabase,
    ref as dbRef,
    set,
    get,
    ref,
} from "firebase/database";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import useFetchTaxiUsers from "./useFetchTaxiUsers";
import logo from "../Assets/images/CabbieXL.jpeg";

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

// Estilos del mapa
const mapContainerStyle = {
    width: "100%",
    height: "100vh",
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
    const taxiUsersFetch = useFetchTaxiUsers();
    // Acceso a la base de datos
    const navigate = useNavigate();
    const database = getDatabase();

    //constante de la distancia
    const [distance, setDistance] = useState(null); // Añade esto al estado de tu componente

    // Constantes para la Conexión Taxista
    const [taxiUsers, setTaxiUsers] = useState([]);
    const [selectedTaxiUserIndex, setSelectedTaxiUserIndex] = useState(null);
    const [user, loading, error] = useAuthState(auth);

    // Constantes de las Acciones del Drawer
    const [container, setContainer] = useState(undefined);
    const [mapVisible, setMapVisible] = useState(false);
    const [open, setOpen] = useState(false);

    // Estado para llevar un registro de las rutas enviadas
    const [sentRoutes, setSentRoutes] = useState([]);

    // Constantes para obtener la ubicación
    const [originAddress, setOriginAddress] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");
    const [originSearchBox, setOriginSearchBox] = useState(null);
    const [destinationSearchBox, setDestinationSearchBox] = useState(null);

    // constantes de precio
    const [Precio, setPrecio] = useState("");

    // Constatntes de Destino del renderizado
    const [directionsResponse, setDirectionsResponse] = useState(null);
    // Recuperar la ruta almacenada de localStorage al cargar el componente
    useEffect(() => {
        const savedRoute = localStorage.getItem("savedRoute");
        if (savedRoute) {
            setDirectionsResponse(JSON.parse(savedRoute));
        }
    }, []);
    //Constatntes del Alert
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // Renderizado del mapa de google
    const mapRef = useRef(null);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // Calculo de la ruta en el Mapa
    function showDistance(distance) {
        // Suponiendo que tienes un elemento en tu HTML con id="distanceDisplay"
        // const distanceDisplay = document.getElementById("distanceDisplay");

        // Actualiza el contenido del elemento con la distancia
        setDistance(`${distance} km`);
    }

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
        // Asumiendo que la respuesta es válida y tiene al menos una ruta
        if (results.routes.length > 0) {
            const route = results.routes[0];

            // Sumamos la distancia de todos los segmentos de la ruta
            let totalDistance = 0;
            route.legs.forEach((leg) => {
                totalDistance += leg.distance.value; // La distancia viene en metros
            });

            totalDistance = totalDistance / 1000; // Convertimos metros a kilómetros

            // Imaginemos que tienes una función `showDistance` que actualiza tu UI
            // con la distancia. Puedes reemplazar esta función con lo que necesites.
            showDistance(totalDistance.toFixed(2)); // Mostramos la distancia con 2 decimales
        }
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

    const HandleNavegateComponents = (taxiUserId) => {
        if (originAddress && destinationAddress && Precio &&
            distance) {
            navigate(`/Chats/${taxiUserId}`, {
                state: {
                    originAddress,
                    destinationAddress,
                    Precio,
                    distance,
                },
            });
        } else {
            console.error("Origen o destino no especificado.");
        }
    };

    const handleVerMapsClick = () => {
        setMapVisible(true);
        calculateRoute(true);
        setOpen(true);
    };

    //Seleccionar Taxista
    const selectTaxiUser = (index) => {
        setSelectedTaxiUserIndex(index);
    };

    const routeAlreadySent = (origin, destination) => {
        return sentRoutes.some(
            (route) => route.origin === origin && route.destination === destination
        );
    };

    const markRouteAsSent = (origin, destination) => {
        setSentRoutes([...sentRoutes, { origin, destination }]);
    };

    // Función para enviar parámetros de ubicación al chat del taxista seleccionado
    const handleSelectCabbie = () => {
        if (selectedTaxiUserIndex == null || !Precio || !originAddress || !destinationAddress) {
            console.error("Información del viaje incompleta o taxista no seleccionado.");
            return;
        }

        const selectedTaxiUser = taxiUsers[selectedTaxiUserIndex];

        if (!selectedTaxiUser || !selectedTaxiUser.uid) {
            console.error("No se pudo obtener información del taxista seleccionado.");
            return;
        }

        const userId = user.uid; // Asegúrate de que el UID del usuario está disponible
        const taxiUserId = selectedTaxiUser.uid;
        const chatId = userId < taxiUserId ? `${userId}_${taxiUserId}` : `${taxiUserId}_${userId}`;

        const now = new Date();
        const viajeId = `viaje_${now.getTime()}`;

        const timeString = now.toLocaleTimeString();

        const routeMessage = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originAddress)}&destination=${encodeURIComponent(destinationAddress)}&travelmode=driving`;

        const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(originAddress)}&zoom=12&size=400x400&markers=color:red|label:O|
        ${encodeURIComponent(originAddress)}&markers=color:blue|label:D|
        ${encodeURIComponent(destinationAddress)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

        const tripData = {
            originAddress,
            destinationAddress,
            precio: Precio,
            distancia: distance,
            routeMessage,
            mapImageUrl,
            time: timeString,
            sender: user.uid,
            type: "location",
        }

        const database = getDatabase();
        // Crear o actualizar el chat
        const chatRef = ref(database, `Chats/${chatId}`);

        get(chatRef).then((snapshot) => {
            if (!snapshot.exists()) {
                // Si el chat no existe, establecer participantes
                set(ref(database, `Chats/${chatId}/participants`), {
                    [userId]: true,
                    [taxiUserId]: true,
                });
            }
            // Enviar el mensaje del viaje al chat
            const messageRef = ref(database, `Chats/${chatId}/messages/Viajes/${viajeId}`);
            set(messageRef, tripData).then(() => {
                console.log("Viaje agregado al chat con éxito.");
                navigate(`/Chats/${chatId}`, { state: { chatId } });
            }).catch((error) => {
                console.error("Error al agregar viaje al chat:", error);
            });
        }).catch((error) => {
            console.error("Error al verificar o crear el chat:", error);
        });
        // Asegúrate de que esta ruta aún no ha sido enviada, o actualiza tu lógica según necesites
        if (!routeAlreadySent(originAddress, destinationAddress)) {
            markRouteAsSent(originAddress, destinationAddress);
        }
    };



    //Compartir mapa
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
                    text: "Mira la ruta en el mapa.",
                    url: googleMapsRouteUrl,
                });
            } catch (error) {
                setAlertMessage("Error compartiendo la ubicación");
                setShowAlert(true);
            }
        } else {
            if (window.Android && typeof window.Android.share === "function") {
                const textToShare = `Mira la ruta en el mapa: ${googleMapsRouteUrl}`;
                window.Android.share(textToShare);
            } else {
                setAlertMessage(
                    "Compartir no es soportado en este navegador ni en esta aplicación."
                );
                setShowAlert(true);
            }
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const capturarUbicacionTaxista = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const ubicacion = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    // Actualiza la ubicación en Firebase
                    actualizarUbicacionTaxistaEnFirebase(ubicacion);
                },
                (error) => {
                    console.error("Error al obtener la ubicación", error);
                }
            );
        } else {
            console.error("La Geolocalización no está soportada por este navegador.");
        }
    };

    const actualizarUbicacionTaxistaEnFirebase = (ubicacion) => {
        if (user) {
            // Asume que 'user' contiene la información del usuario autenticado
            const uidTaxista = user.uid;
            const database = getDatabase();
            const taxistaRef = dbRef(
                database,
                `Users/UsersClient/${uidTaxista}/ubicacion`
            );

            set(taxistaRef, ubicacion)
                .then(() => {
                    console.log("Ubicación actualizada con éxito.");
                })
                .catch((error) => {
                    console.error("Error al actualizar la ubicación", error);
                });
        }
    };

    //Taxi Ubication
    const esUbicacionValida = (lat, lng) => {
        return (
            !isNaN(lat) &&
            !isNaN(lng) &&
            lat !== null &&
            lng !== null &&
            lat !== undefined &&
            lng !== undefined
        );
    };

    useEffect(() => {
        const database = getDatabase();
        const usersRef = dbRef(database, `Users/UsersClient`);

        get(usersRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const taxiUsersWithLocation = Object.values(usersData)
                        .filter(
                            (user) =>
                                user.role === "taxista" &&
                                user.ubicacion &&
                                esUbicacionValida(user.ubicacion.lat, user.ubicacion.lng)
                        )
                        .map((user) => ({
                            ...user,
                            location: {
                                lat: Number(user.ubicacion.lat),
                                lng: Number(user.ubicacion.lng),
                            },
                        }));

                    setTaxiUsers(taxiUsersWithLocation);
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);

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
        capturarUbicacionTaxista();
        // Otros efectos o inicializaciones aquí
    }, [capturarUbicacionTaxista]); // La lista de dependencias vacía asegura que esto se ejecute una vez al montar el componente

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
                            .map(([key, value]) => ({
                                uid: key,
                                ...value,
                                location: { lat: value.lat, lng: value.lng },
                            }));
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

    if (Precio === undefined) {
        console.error('El precio no está definido.');
        return; // Salir de la función para evitar escribir en Firebase
    }

    if (!isLoaded) return <div>Loading...</div>;
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
                        gap: 2,
                        width: BoxVisible ? "auto" : "auto",

                        padding: BoxVisible ? 1 : 0,
                        borderRadius: mapVisible ? 2 : 0,
                        background: mapVisible ? "#FFFFFF" : "none",
                    }}
                >
                    <IconButton
                        onClick={toggleBoxVisibility}
                        sx={{
                            alignSelf: "flex-end",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            alignContent: "center",
                        }}
                    >
                        <Minimize />
                    </IconButton>
                    {BoxVisible && (
                        <>
                            <StandaloneSearchBox
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

                            <IconButton onClick={handleVerMapsClick}>
                                Ver
                                <LocationOnOutlined sx={{ color: "red" }} fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleShareMapsClick}>
                                Share
                                <ShareLocationOutlined sx={{ color: "red" }} fontSize="small" />
                            </IconButton>
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
                        marginTop: "-1%",
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

                            {taxiUsers.map((taxiUser, index) => {
                                // Verifica primero si el objeto `ubicacion` o `ubication` existe
                                const lat = parseFloat(
                                    taxiUser.ubicacion?.lat || taxiUser.ubication?.lat
                                );
                                const lng = parseFloat(
                                    taxiUser.ubicacion?.lng || taxiUser.ubication?.lng
                                );

                                if (isFinite(lat) && isFinite(lng)) {
                                    return (
                                        <Marker
                                            key={index} // Considera usar un identificador único más robusto si está disponible
                                            position={{ lat, lng }}
                                            title={taxiUser.name}
                                            icon={{
                                                url: taxiUser.imageUrl,
                                                scaledSize: new window.google.maps.Size(80, 80),
                                            }}
                                        />
                                    );
                                } else {
                                    console.error(
                                        `Latitud o longitud inválidas para el taxista: ${taxiUser.name}`
                                    );
                                    return null;
                                }
                            })}
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
                                        background:
                                            selectedTaxiUserIndex === index ? "#808080" : "#fff",
                                        borderRadius: 2,
                                        mb: 1,
                                        cursor: "pointer",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                                            textDecorationColor: "#fff",
                                        },
                                    }}
                                    onClick={() => selectTaxiUser(index)}
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

                                    <div
                                        style={{
                                            display: "flex",
                                            textAlign: "center",
                                            justifyContent: "space-between",
                                            Width: "100%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <ListItemText
                                            sx={{
                                                color: "black",
                                                mx: "auto",
                                                textAlign: "center",
                                                display: "flex",
                                            }}
                                        >
                                            <Typography>
                                                {`${distance || "Calculando..."}`}
                                            </Typography>
                                        </ListItemText>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>Precio</InputLabel>
                                            <Select
                                                value={Precio}
                                                label="Rol"
                                                onChange={(e) => setPrecio(e.target.value)}
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
                                            >
                                                {[1.25, 2.5, 3.75, 5.0, 6.25, 7.5, 8.75, 10.0].map(
                                                    (precio, index) => (
                                                        <MenuItem key={index} value={precio}>
                                                            ${precio.toFixed(2)}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </ListItem>
                            ))}
                        </List>
                    </StyledBox>
                    <Button
                        onClick={handleSelectCabbie}
                        sx={{
                            color: "#f4f4f4",
                            width: "100%",
                            background: "#000",
                            height: "60px",
                            "&:hover": {
                                backgroundColor: "#242424", // Ejemplo de interactividad
                            },
                        }}
                    >
                        Seleccionar Cabbie
                    </Button>
                </SwipeableDrawer>
            </Box>
        </>
    );
};
export default TextFieldMaps;

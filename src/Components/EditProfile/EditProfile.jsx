import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemIcon,
  IconButton,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ShareLocationOutlined, SwipeRight } from "@mui/icons-material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import { signOut } from "firebase/auth";
import { auth } from "../../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import { Chat, LocationOnOutlined } from "@mui/icons-material";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";

const containerStyle = {
  width: "100%",
  height: "500px",
};
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

const EditProfile = () => {
  //Menú desplegable de abajo hacia arriba
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [container, setContainer] = useState(undefined);

  //Conexión database
  const [user, loading, error] = useAuthState(auth);
  const [taxiUsers, setTaxiUsers] = useState([]);
  const navigate = useNavigate();
  const database = getDatabase();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [taxiLocation, setTaxiLocation] = useState({ lat: null, lng: null });

  //APi DE MAPS
  const { isLoaded, loadError } = useJsApiLoader({
    id: "script-loader",
    version: "weekly",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [originAddress, setOriginAddress] = useState("");
  const [center, setCenter] = useState({
    lat: null,
    lng: null,
  });
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setCenter({
          lat: latitude,
          lng: longitude,
        });
        const geocoder = new window.google.maps.Geocoder();
        const { results } = await geocoder.geocode({
          location: { lat: latitude, lng: longitude },
        });
        if (results[0]) {
          setOriginAddress(results[0].formatted_address);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (user && database) {
      // Referencia a todos los usuarios clientes
      const usersRef = dbRef(database, `Users/UsersClient/${user.uid}`);

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

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const calculateRoute = async () => {
    if (!originAddress || !destinationRef.current.value) return;
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  const HandleNavegateComponents = () => {
    navigate("/ConversationMessage");
  };

  const HandleNavegateCalling = () => {
    navigate("/CallMessageConversationMessage");
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // Función de éxito: se llama si podemos obtener la ubicación del usuario
    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Aquí, como ejemplo, estamos copiando la latitud y longitud al portapapeles
      // Puedes ajustar esta parte para compartir la ubicación de la manera que necesites
      navigator.clipboard.writeText(`Latitude: ${latitude}, Longitude: ${longitude}`)
        .then(() => {
          alert("Location copied to clipboard!");
        })
        .catch((err) => {
          console.error("Could not copy the location to clipboard", err);
        });
    };

    // Función de error: se llama si hay un problema al obtener la ubicación
    const error = () => {
      alert("Unable to retrieve your location");
    };

    // Solicita la ubicación actual del usuario
    navigator.geolocation.getCurrentPosition(success, error);
  };


  const openHandle = Boolean(anchorEl);

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

  const generateRating = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        color={index < rating ? "secondary" : "disabled"}
        sx={{ color: "yellow" }}
      />
    ));
  };

  return isLoaded && center ? (
    <>
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

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: 4,
            background: "#fff",
            padding: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Autocomplete>
              <TextField
                label="Enter origin"
                variant="filled"
                inputRef={originRef}
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
            </Autocomplete>
            <Autocomplete>
              <TextField
                label="Enter destination"
                variant="filled"
                inputRef={destinationRef}
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
            </Autocomplete>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={calculateRoute}
              sx={{
                borderRadius: 2,
                backgroundColor: "black",
                color: "white",
              }}
            >
              Calculate Route
            </Button>
            <Button
              variant="contained"
              onClick={shareLocation}
              sx={{
                borderRadius: 2,
                backgroundColor: "black",
                color: "white",
              }}
              startIcon={<ShareLocationOutlined />}
            >
              Share
            </Button>
          </Box>
        </Box>
        <Box>
          <div style={containerStyle}>
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "100%",
              }}
              center={center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              <Marker position={center} />
              {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
              )}
            </GoogleMap>
          </div>
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
      </Root>
    </>
  ) : (
    <></>
  );
};

export default EditProfile;

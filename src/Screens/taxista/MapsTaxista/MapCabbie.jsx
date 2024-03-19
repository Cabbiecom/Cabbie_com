import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import { auth } from "../../../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import "./MapCabbie.css";
//import ParentComponent from "../../Controller/Controller";

const MapCabbie = () => {
    //const savedLocation = JSON.parse(localStorage.getItem("location"));
    const savedPhotoURL = localStorage.getItem("photoURL");
    const [currentLocation, setCurrentLocation] = useState(
        //savedLocation ||
        {
            lat: null,
            lng: null,
        }
    );
    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [photoURL, setPhotoURL] = useState(savedPhotoURL || "");

    const [taxiUsers, setTaxiUsers] = useState([]);
    const [user, loading, error] = useAuthState(auth);
    const mapContainerStyle = { height: "100vh", width: "100%" };
    const mapRef = useRef(null);
    const database = getDatabase();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
    });

    useEffect(() => {
        if (user) {
            const newUserPhotoURL = user.photoURL || "";
            setPhotoURL(newUserPhotoURL);

            const userRef = dbRef(database, `Users/UsersClient/${user.uid}`);
            get(userRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        const imageUrl = userData.imageUrl || newUserPhotoURL;
                        setPhotoURL(imageUrl);
                        localStorage.setItem("photoURL", imageUrl);
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        // Cambiado de 'location' a 'newLocation'
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentLocation(newLocation);
                    localStorage.setItem("location", JSON.stringify(newLocation));
                    // Verificar y actualizar la ubicación en la base de datos
                    if (user) {
                        const userRef = dbRef(database, `Users/UsersClient/${user.uid}`);
                        get(userRef).then((snapshot) => {
                            if (snapshot.exists()) {
                                const userData = snapshot.val();
                                // Suponiendo que el rol está disponible en los datos del usuario
                                if (
                                    userData.role === "taxista" ||
                                    userData.role === "usuario"
                                ) {
                                    // Actualiza la ubicación en la base de datos
                                    const updateRef = dbRef(
                                        database,
                                        `Users/UsersClient/${user.uid}`
                                    );
                                    set(updateRef, { ...userData, ubication: newLocation })
                                        .then(() => {
                                            console.log("Ubicación actualizada en la base de datos");
                                        })
                                        .catch((error) => {
                                            console.error("Error al actualizar la ubicación:", error);
                                        });
                                }
                            } else {
                                console.log(
                                    "No se encontraron datos del usuario en la base de datos."
                                );
                            }
                        });
                    }
                },
                (error) => {
                    console.error("Error obteniendo la ubicación: ", error);
                    alert("Error al obtener la ubicación");
                },
                { enableHighAccuracy: true }
            );
        }
    }, [user, database]);

    useEffect(() => {
        if (isLoaded && mapRef.current) {
            const loc =
                currentLocation.lat && currentLocation.lng
                    ? currentLocation
                    : undefined;
            if (loc && photoURL) {
                const markerIcon = {
                    url: photoURL,
                    scaledSize: new window.google.maps.Size(60, 60),
                    origin: new google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(40, 40),
                    style: {
                        borderRadius: "100%",
                    }
                };

                const marker = new window.google.maps.Marker({
                    position: loc,
                    map: mapRef.current,
                    icon: markerIcon,
                });

                return () => {
                    marker.setMap(null);
                };
            }
        }
    }, [currentLocation, isLoaded, photoURL, mapRef]); // Asegúrate de incluir `isLoaded` en la lista de dependencias

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={
                currentLocation.lat && currentLocation.lng ? currentLocation : undefined
            }
            zoom={15}
            onLoad={(map) => (mapRef.current = map)}
        >
            {/* Los marcadores se manejan a través de efectos secundarios */}
        </GoogleMap>
    ) : (
        <div>Loading...</div>
    );
};

export default MapCabbie;

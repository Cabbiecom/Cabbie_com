import { Box } from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    useLoadScript,
    GoogleMap,
    Marker,
} from "@react-google-maps/api";
import { getDatabase, ref as dbRef, get } from "firebase/database";

const libraries = ["places"];

const LocationAdmin = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [taxiUsers, setTaxiUsers] = useState([]);
    const [adminLocation, setAdminLocation] = useState({ lat: 10, lng: 10 }); // Ubicación por defecto
    const mapRef = useRef(null);
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    useEffect(() => {
        const database = getDatabase();
        const usersRef = dbRef(database, `Users/UsersClient`);

        get(usersRef).then((snapshot) => {
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                let adminFound = false;

                const users = Object.values(usersData).map(user => {
                    if (user.role === "admin" && !adminFound) {
                        // Asume que solo hay un admin o toma el primero que encuentre
                        setAdminLocation({
                            lat: Number(user.ubicacion.lat),
                            lng: Number(user.ubicacion.lng),
                        });
                        adminFound = true;
                    }
                    return user.role === "taxista" && user.ubicacion ? {
                        ...user,
                        location: {
                            lat: Number(user.ubicacion.lat),
                            lng: Number(user.ubicacion.lng),
                        },
                    } : null;
                }).filter(user => user !== null);

                setTaxiUsers(users);
            }
        }).catch((error) => {
            console.error("Error fetching users:", error);
        });
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <Box
            sx={{
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                textAlign: 'center'
            }}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100vh" }}
                zoom={15}
                center={adminLocation}
                onLoad={onMapLoad}
            >
                {taxiUsers.map((taxiUser, index) => (
                    <Marker
                        key={index}
                        position={{ lat: taxiUser.location.lat, lng: taxiUser.location.lng }}
                        title={taxiUser.name}
                        icon={{
                            url: taxiUser.imageUrl,
                            scaledSize: new window.google.maps.Size(80, 80),
                        }}
                    />
                ))}
            </GoogleMap>
        </Box>
    );
}

export default LocationAdmin;

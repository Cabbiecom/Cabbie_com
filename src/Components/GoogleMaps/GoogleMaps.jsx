import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getDatabase, ref, onValue } from "firebase/database";

const containerStyle = {
  width: '100%',
  height: '550px',
};

// Reemplaza 'YOUR_GOOGLE_MAPS_API_KEY' con tu clave de API de Google Maps
const googleMapsApiKey = 'AIzaSyCExz27MMGSdeZw-l1-qReRPSfEUgNV4po';

const MapsAPI = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null }); // Valores predeterminados
  const [taxiLocations, settaxiLocations] = useState([]);

  useEffect(() => {
    // Función para obtener la ubicación actual del usuario

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error al obtener la ubicación del usuario", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocalización no soportada por este navegador.");
      // Puedes establecer una ubicación por defecto o manejar este caso como prefieras
    }

    const database = getDatabase();
    const taxistasRef = ref(database, 'Users/UsersClient');

    onValue(taxistasRef, (snapshot) => {
      const users = snapshot.val();
      const taxiLocations = [];
      Object.keys(users).forEach((key) => {
        const user = users[key];
        if (user.role === "taxista" && user.lat && user.lng) {
          taxiLocations.push({ lat: user.lat, lng: user.lng });
        }
      });
      settaxiLocations(taxiLocations);
    });
  }, []);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={15}
      >
        {/* Marcador para la ubicación actual */}
        {taxiLocations.map((location, index) => (
          <Marker key={index} position={location} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapsAPI;

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '550px',
};

// Reemplaza 'YOUR_GOOGLE_MAPS_API_KEY' con tu clave de API de Google Maps
const googleMapsApiKey = 'AIzaSyCExz27MMGSdeZw-l1-qReRPSfEUgNV4po';

const MapsAPI = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    // Función para obtener la ubicación actual del usuario
    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error al obtener la ubicación', error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.error('Geolocalización no soportada por este navegador.');
      }
    };

    fetchCurrentLocation();
  }, []);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={15}
      >
        {/* Marcador para la ubicación actual */}
        <Marker position={currentLocation} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapsAPI;

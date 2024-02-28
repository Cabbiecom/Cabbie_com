/* global google */
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { getDatabase, ref as dbRef, onValue, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { auth } from '../../Data/Database';
import { useAuthState } from "react-firebase-hooks/auth";
const containerStyle = {
  width: '100%',
  height: '550px',
};

const googleMapsApiKey = 'AIzaSyCExz27MMGSdeZw-l1-qReRPSfEUgNV4po';

const MapsAPI = () => {
  const [user] = useAuthState(auth);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
  const [taxiLocations, settaxiLocations] = useState([]);
  const [photoURL, setPhotoURL] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  const database = getDatabase();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;


    if (user) {
      setPhotoURL(user.photoURL || '');
      const userDetailsRef = dbRef(database, `Users/UserDetails/${user.uid}`);
      get(userDetailsRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setPhotoURL(userData.imageUrl);
        } else {
          console.log("No se encontraron datos del usuario en la base de datos.");
        }
      }).catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      });
      onValue(userDetailsRef, (snapshot) => {
        const userDetails = snapshot.val();
        if (userDetails && userDetails.imageUrl) {
          setUserAvatar(userDetails.imageUrl);
        }
      });
    }

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
    }

    const taxistasRef = dbRef(database, 'Users/UsersClient');

    onValue(taxistasRef, (snapshot) => {

      const users = snapshot.val();

      if (users) {

        const taxiLocationsTemp = [];
        Object.keys(users).forEach((key) => {
          const user = users[key];

          if (user.role === "taxista" && user.lat && user.lng && user.imageUrl) {
            const avatarIcon = {
              url: user.imageUrl,
              scaledSize: new google.maps.Size(50, 50),
            };
            taxiLocationsTemp.push({
              lat: user.lat,
              lng: user.lng,
              avatar: avatarIcon,
            });
          }
        });
        settaxiLocations(taxiLocationsTemp);
      } else {
        console.log('No se encontraron usuarios o la referencia de Firebase no es válida.');
      }
    });
  }, [user, database, isLoaded]);

  if (loadError) {
    return <div>Error cargando el mapa</div>;
  }

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation.lat && currentLocation.lng ? currentLocation : undefined}
      zoom={15}
    >
      {currentLocation.lat && currentLocation.lng && (
        <Marker
          position={currentLocation}
          icon={{
            url: photoURL,
            scaledSize: new google.maps.Size(50, 50),
          }}

        />
      )}
      {taxiLocations.map((location, index) => {
        console.log(location.avatar.url);
        return (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            icon={location.avatar} />
        );
      })}
    </GoogleMap>
  );
};

export default MapsAPI;


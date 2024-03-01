import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import { auth } from "../../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";

const MapsAPI = () => {
  const savedLocation = JSON.parse(localStorage.getItem("location"));
  const savedPhotoURL = localStorage.getItem("photoURL");
  const [currentLocation, setCurrentLocation] = useState(savedLocation || {
    lat: null,
    lng: null,
  });
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [photoURL, setPhotoURL] = useState(savedPhotoURL || "");

  const [taxiUsers, setTaxiUsers] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const mapContainerStyle = { height: "500px", width: "100%" };
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

    if (!savedLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          localStorage.setItem("location", JSON.stringify(location));
        },
        (error) => {
          console.error("Error obteniendo la ubicación: ", error);
          alert("Error al obtener la ubicación");
        },
        { enableHighAccuracy: true }
      );
    }
  }, [savedLocation]);

  useEffect(() => {
    let marker;
    if (
      isLoaded &&
      currentLocation.lat &&
      currentLocation.lng &&
      mapRef.current
    ) {
      const marker = new window.google.maps.Marker({
        position: currentLocation,
        map: mapRef.current,
        icon: {
          url: `${photoURL}`, // Asegúrate de reemplazar esto con la ruta real a tu icono personalizado
          scaledSize: new window.google.maps.Size(80, 80),
        },
        anchor: new window.google.maps.Point(40, 40),
      });

      return () => {
        marker.setMap(null); // Limpieza al desmontar el componente
      };
    }

  }, [currentLocation, isLoaded, photoURL]);

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

export default MapsAPI;

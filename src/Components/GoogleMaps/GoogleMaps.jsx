/* global google */
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, useGoogleMap } from '@react-google-maps/api';
import { getDatabase, ref as dbRef, onValue, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { auth } from '../../Data/Database';
import { useAuthState } from "react-firebase-hooks/auth";
import './GoogleMaps.css';

const containerStyle = {
  width: '100%',
  height: '550px',
};

const googleMapsApiKey = 'AIzaSyCExz27MMGSdeZw-l1-qReRPSfEUgNV4po';


const MapsAPI = () => {
  const [user] = useAuthState(getAuth());
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
  const [photoURL, setPhotoURL] = useState('');
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

 

  useEffect(() => {


    if (user) {
      // Suponiendo que user.photoURL contiene la URL válida de la imagen
      setPhotoURL(user.photoURL);
    }

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


  }, [user]);

  useEffect(() => {

    if (isLoaded && currentLocation.lat && currentLocation.lng && photoURL && mapRef.current) {
      
      class CustomOverlay extends google.maps.OverlayView {
        constructor(latlng, imageSrc, map) {
          super();
          this.latlng = latlng;
          this.imageSrc = imageSrc;
          this.map = map;
          this.div = null;
          this.setMap(map);
        }
    
        onAdd() {
          const div = document.createElement('div');
          div.className = 'custom-overlay';
          div.innerHTML = `<img src="${this.imageSrc}" alt="Usuario">`;
          this.div = div;
    
          const panes = this.getPanes();
          panes.overlayLayer.appendChild(div);
    
          // Aquí puedes agregar manejadores de eventos, por ejemplo, para clics en el overlay
          google.maps.event.addDomListener(div, 'click', () => {
            console.log('Overlay clickeado');
            // Aquí puedes manejar la interacción, por ejemplo, mostrar un modal con información
          });
        }
    
        draw() {
          const overlayProjection = this.getProjection();
          const position = overlayProjection.fromLatLngToDivPixel(this.latlng);
    
          const div = this.div;
          div.style.left = position.x + 'px';
          div.style.top = position.y + 'px';
        }
    
        onRemove() {
          if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
          }
        }
      }
    
      
      
      new CustomOverlay(
        new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
        photoURL,
        mapRef.current
      );
    }
  }, [isLoaded, currentLocation, photoURL, mapRef.current]);

  if (loadError) {
    return <div>Error cargando el mapa</div>;
  }

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation}
      zoom={15}
      onLoad={map => mapRef.current = map}
    >
    </GoogleMap>
  );
};

export default MapsAPI;


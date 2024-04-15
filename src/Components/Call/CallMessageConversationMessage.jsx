import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  AppBar,
  Toolbar,
} from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import profile from "../../Assets/images/Cabbie.png";
import { Videocam, VideocamOff } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const CallMessageConversationMessage = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isVideoCallActive, setisVideoCallActive] = useState(false);
  const [isSpeakerActive, setIsSpeakerActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const navigate = useNavigate();

  // Obtén los IDs de los parámetros de la URL
  const [otherParticipantName, setOtherParticipantName] = useState('');
  const { taxiUserId, UsuarioId } = useParams();

  //costantes para la llamada con el taxista y el usuario
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);

  // Función para obtener el nombre del participante. Asume que tienes una API que devuelve la información del usuario por ID.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchParticipantName = async () => {
    try {
      // Asumiendo que tienes una variable de entorno o alguna forma de determinar si el usuario actual es un taxista o un usuario.
      // Esto es solo un ejemplo, ajusta según tu lógica y estructura de API.
      const userId = taxiUserId ? taxiUserId : UsuarioId;
      const response = await axios.get(`/api/users/${userId}`);
      setOtherParticipantName(response.data.name); // Ajusta según la estructura de tu respuesta
    } catch (error) {
      console.error("Error al obtener el nombre del participante:", error);
    }
  };

  // Vuelve a ejecutar cuando los IDs cambien
  useEffect(() => {
    fetchParticipantName();
  }, [taxiUserId, UsuarioId, fetchParticipantName]);

  // Solicitar acceso al micrófono (y cámara si es videollamada)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: isVideoCallActive })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((err) => console.error("Error al acceder a los dispositivos:", err));
  }, [isVideoCallActive]);

  // Inicializar la conexión WebRTC
  useEffect(() => {
    if (localStream && isCallActive) {
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // Añadir stream local al peer connection
      localStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream);
      });

      // Crear una oferta o responder a una oferta...
      // Esto implica interacciones con tu backend para intercambio de señales

      // Escuchar stream remoto
      const remoteStream = new MediaStream();
      setRemoteStream(remoteStream);
      peerConnection.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      // Manejar candidatos ICE
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          // Enviar candidato ICE al otro usuario a través de tu backend
        }
      };
    }
    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      peerConnection.current?.close();
    };
  }, [localStream, isCallActive]);



  const toggleMic = () => {
    setIsMicActive(!isMicActive);
  };

  const toggleSpeaker = () => {
    setIsSpeakerActive(!isSpeakerActive);
  };

  const toggleVideoCall = () => {
    setisVideoCallActive(!isVideoCallActive);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsMicActive(false);
    setIsSpeakerActive(false);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    navigate(-1);
  };

  return (
    <>
      <Box
        sx={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: "20vh",
          }}
        >
          <Avatar sx={{ width: 120, height: 120 }} src={profile} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {otherParticipantName}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {isCallActive
              ? "Llamando..."
              : `Duración: ${callDuration} segundos`}
          </Typography>
        </Box>

        <AppBar
          position="fixed"
          color="primary"
          sx={{ top: "auto", bottom: 0, background: "#000 ", borderRadius: 2 }}
        >
          <Toolbar sx={{ justifyContent: "space-evenly" }}>
            <IconButton onClick={toggleMic} color="secondary">
              {isMicActive ? (
                <MicIcon sx={{ color: "#fff" }} />
              ) : (
                <MicOffIcon sx={{ color: "#fff" }} />
              )}
            </IconButton>

            <IconButton onClick={toggleVideoCall} color="secondary">
              {isVideoCallActive ? (
                <Videocam sx={{ color: "#fff" }} />
              ) : (
                <VideocamOff sx={{ color: "#fff" }} />
              )}
            </IconButton>

            <IconButton onClick={toggleSpeaker} color="primary">
              {isSpeakerActive ? (
                <VolumeUpIcon sx={{ color: "#fff" }} />
              ) : (
                <VolumeOffIcon sx={{ color: "#fff" }} />
              )}
            </IconButton>

            <IconButton onClick={endCall} color="secondary">
              <CallEndIcon sx={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default CallMessageConversationMessage;

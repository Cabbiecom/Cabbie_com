import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import profile from "../../Assets/images/Cabbie.png";
import { Videocam, VideocamOff } from "@mui/icons-material";

const CallMessageConversationMessage = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isVideoCallActive, setisVideoCallActive] = useState(false);
  const [isSpeakerActive, setIsSpeakerActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer =
      isCallActive &&
      setInterval(() => setCallDuration((prev) => prev + 1), 1000);

    if (isCallActive && !stream) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setStream(stream);
          setIsMicActive(true);
        })
        .catch((err) => {
          console.error("Error al acceder al micrófono:", err);
          endCall();
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      clearInterval(timer);
    };
  }, [isCallActive, stream, isCallActive]);

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
            Nombre del Usuario
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

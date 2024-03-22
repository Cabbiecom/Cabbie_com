import React, {
  useState,
  useEffect, useRef,
  useCallback
} from "react";

import {
  Box,
  Avatar,
  Toolbar,
  IconButton,
  TextField,
  Button,
  Typography,
  Container,
  AppBar,
} from "@mui/material";
import { ArrowBackIos, PhotoCamera } from "@mui/icons-material";

import { auth } from "../../Data/Database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const EditProfile = () => {
  //Datos del ussuario
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const storage = getStorage();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  //Menú desplegable de abajo hacia arriba
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [container, setContainer] = useState(undefined);

  //Conexión database
  const [user, loading, error] = useAuthState(auth);
  const [taxiUsers, setTaxiUsers] = useState([]);
  const navigate = useNavigate();
  const database = getDatabase();
  const [photoURL, setPhotoURL] = useState("");

  const handleUpdate = async () => {
    if (!user) {
      console.error("No hay un usuario autenticado.");
      return;
    }
    let imageUrl = ""; // Por defecto, vacío si no se sube una nueva imagen

    // Subir la nueva imagen a Firebase Storage, si se seleccionó una
    if (photoURL) {
      const imageRef = storageRef(
        storage,
        `Users/UsersClient/images/${user.uid}`
      );
      await uploadBytes(imageRef, photoURL); // Asumiendo que photoURL es un objeto File
      imageUrl = await getDownloadURL(imageRef);
    }

    // Actualizar la base de datos con los nuevos valores
    const userRef = dbRef(database, `Users/UsersClient/${user.uid}`);
    await set(userRef, {
      name: name,
      email: email,
      password: password,
      imageUrl: imageUrl, // Esto estará vacío si no se actualizó la imagen
    });

    // Mostrar notificación al usuario
    handleOpenSnackbar(`Usuario actualizado con éxito`);
  };
  // Función para abrir el Snackbar con un mensaje
  const handleOpenSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
      setPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <AppBar
        sx={{
          background: "#000",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handleBack}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Editar Perfil
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          height: "87vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#f4f4f4",
          padding: "40px",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Actualizar los Datos</Typography>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{ mt: 2 }}
        >
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleImageChange}
          />
          <PhotoCamera />
        </IconButton>
        {preview && (
          <Box sx={{ mb: 2 }}>
            <Avatar src={preview} sx={{ width: 100, height: 100 }} />
          </Box>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          label="Nombre"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, background: "#000", color: "#fff" }}
          onClick={handleUpdate}
        >
          Actualizar Datos
        </Button>
      </Box>
    </>
  );
};

export default EditProfile;

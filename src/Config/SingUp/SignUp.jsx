import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import {
    Button,
    TextField,
    Typography,
    Box,
    Avatar,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Alert,
    Card,
    CardContent,
    Toolbar,
    AppBar,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import { ArrowForwardIosOutlined } from "@mui/icons-material";
import Footer from "../../Components/Footer/Footer";
import { useSpring, animated } from "react-spring";


const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // animation on wisget
    const fade = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 2000 },
    });

    const auth = getAuth();
    const storage = getStorage();
    const database = getDatabase();

    //Navegation
    const navigate = useNavigate();

    // Función para abrir el Snackbar con un mensaje
    const handleOpenSnackbar = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            let imageUrl = "";

            // Subir la imagen a Firebase Storage
            if (image) {
                const imageRef = storageRef(
                    storage,
                    `Users/UsersClient/images/${user.uid}`
                );
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);

                // Aquí podrías actualizar el perfil del usuario o guardar la URL de la imagen en la base de datos
                handleOpenSnackbar(`Imagen subida con éxito: ${imageUrl}`);
            }

            const userRef = dbRef(database, `Users/UsersClient/${user.uid}`);
            await set(userRef, {
                name: name,
                email: email,
                role: role,
                imageUrl: imageUrl,
            });

            handleOpenSnackbar(
                `Usuario registrado con éxito, y la imagen fue subida: ${user}`
            );
            navigate("/HomeScreen");
        } catch (error) {
            handleOpenSnackbar(`Error al registrar el usuario: ${error.message}`);
        }
    };

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
            setPreview(URL.createObjectURL(event.target.files[0]));
        }
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    background: "black",
                    visibility: "visible",
                    display: "-moz-initial",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                }}
            >
                <Toolbar>
                    <Typography component="h1" variant="h5">
                        Registrarse
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    width: "100%",
                    background: "#f4f4f4",
                }}
            >
                <Container
                    component="main"
                    maxWidth="xs"
                    sx={{
                        marginBottom: 4,
                        flexGrow: 1,
                        height: "100vh",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            justifyContent: "center",
                        }}
                    >

                        <Card
                            raised
                            sx={{
                                background: "#fff",
                                marginTop: 10,
                            }}
                        >   <animated.div style={fade}>
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        marginBottom: '30%'
                                    }}
                                >
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Nombre"
                                        autoFocus
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        variant="filled"
                                        sx={{
                                            width: "100%",
                                            backgroundColor: "#EDEDED",
                                            borderRadius: 2,
                                            "& .MuiFilledInput-underline:before": {
                                                borderBottom: "none", // Elimina la línea inferior en el estado normal
                                            },
                                            "& .MuiFilledInput-underline:after": {
                                                borderBottom: "none", // Elimina la línea inferior en el estado activo/foco
                                            },
                                            "& .MuiFilledInput-underline:hover:before": {
                                                borderBottom: "none", // Elimina la línea inferior al pasar el ratón por encima
                                            },
                                            "& .MuiFilledInput-root": {
                                                backgroundColor: "rgba(0,0,0,0)", // Hace el fondo transparente
                                                "&:hover": {
                                                    backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente al pasar el ratón por encima
                                                },
                                                "&.Mui-focused": {
                                                    backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente en el estado de foco
                                                },
                                            },
                                        }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Correo Electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        variant="filled"
                                        sx={{
                                            width: "100%",
                                            backgroundColor: "#EDEDED",
                                            borderRadius: 2,
                                            "& .MuiFilledInput-underline:before": {
                                                borderBottom: "none", // Elimina la línea inferior en el estado normal
                                            },
                                            "& .MuiFilledInput-underline:after": {
                                                borderBottom: "none", // Elimina la línea inferior en el estado activo/foco
                                            },
                                            "& .MuiFilledInput-underline:hover:before": {
                                                borderBottom: "none", // Elimina la línea inferior al pasar el ratón por encima
                                            },
                                            "& .MuiFilledInput-root": {
                                                backgroundColor: "rgba(0,0,0,0)", // Hace el fondo transparente
                                                "&:hover": {
                                                    backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente al pasar el ratón por encima
                                                },
                                                "&.Mui-focused": {
                                                    backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente en el estado de foco
                                                },
                                            },
                                        }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Contraseña"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        variant="filled"
                                        sx={{
                                            width: "100%",
                                            backgroundColor: "#EDEDED",
                                            borderRadius: 2,
                                            "& .MuiFilledInput-underline:before": {
                                                borderBottom: "none", // Elimina la línea inferior en el estado normal
                                            },
                                            "& .MuiFilledInput-underline:after": {
                                                borderBottom: "none", // Elimina la línea inferior en el estado activo/foco
                                            },
                                            "& .MuiFilledInput-underline:hover:before": {
                                                borderBottom: "none", // Elimina la línea inferior al pasar el ratón por encima
                                            },
                                            "& .MuiFilledInput-root": {
                                                backgroundColor: "rgba(0,0,0,0)", // Hace el fondo transparente
                                                "&:hover": {
                                                    backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente al pasar el ratón por encima
                                                },
                                                "&.Mui-focused": {
                                                    backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente en el estado de foco
                                                },
                                            },
                                        }}
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Rol</InputLabel>
                                        <Select
                                            value={role}
                                            label="Rol"
                                            onChange={(e) => setRole(e.target.value)}
                                            variant="filled"
                                            sx={{
                                                width: "100%",
                                                backgroundColor: "#EDEDED",
                                                borderRadius: 2,
                                                "& .MuiFilledInput-underline:before": {
                                                    borderBottom: "none", // Elimina la línea inferior en el estado normal
                                                },
                                                "& .MuiFilledInput-underline:after": {
                                                    borderBottom: "none", // Elimina la línea inferior en el estado activo/foco
                                                },
                                                "& .MuiFilledInput-underline:hover:before": {
                                                    borderBottom: "none", // Elimina la línea inferior al pasar el ratón por encima
                                                },
                                                "& .MuiFilledInput-root": {
                                                    backgroundColor: "rgba(0,0,0,0)", // Hace el fondo transparente
                                                    "&:hover": {
                                                        backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente al pasar el ratón por encima
                                                    },
                                                    "&.Mui-focused": {
                                                        backgroundColor: "rgba(0,0,0,0)", // Mantiene el fondo transparente en el estado de foco
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="taxista">Taxista</MenuItem>
                                            <MenuItem value="usuario">Usuario</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <IconButton
                                        color="black"
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
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            mt: 3, mb: 2,
                                            background: "#000",
                                            color: "#fff",

                                        }}
                                        onClick={handleSignUp}
                                    >
                                        Registrarse
                                    </Button>
                                </CardContent>
                            </animated.div>

                        </Card>
                        <Card
                            raised
                            sx={{
                                background: "#fff",
                                mx: "auto",
                                alignContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                justifyContent: "center",
                                marginTop: 2,
                            }}
                        >
                            <animated.div style={fade}>
                                <CardContent
                                    sx={{
                                        display: "flex",

                                        alignContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        justifyContent: "space-around",
                                        p: 2,
                                    }}
                                >
                                    <Typography
                                        component="p"
                                        variant="body1"
                                        sx={{
                                            display: "flex",
                                            alignContent: "center",
                                            alignItems: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        Tinenes una cuenta?
                                    </Typography>

                                    <Typography
                                        onClick={() => navigate("/")}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            color: "#292929",
                                            alignContent: "center",
                                            textAlign: "center",
                                            p: 2,
                                        }}
                                    >
                                        SignIn{" "}
                                        <ArrowForwardIosOutlined
                                            fontSize="small"
                                            sx={{ color: "#292929" }}
                                        />
                                    </Typography>
                                </CardContent>
                            </animated.div>

                        </Card>
                    </Box>
                </Container>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Footer />
        </>
    );
};

export default SignUp;

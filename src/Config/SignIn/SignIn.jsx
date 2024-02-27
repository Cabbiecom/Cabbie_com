import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
// Importa el ícono de Google si estás usando Material Icons
import GoogleIcon from "@mui/icons-material/Google";
import { Navigate } from "react-router-dom";
import { auth } from "../../Data/Database";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Card, CardContent, Divider, IconButton, } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SignIn = () => {
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("error"); // Puedes usar 'error', 'warning', 'info', 'success'

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const showAlert = (message, severity = "error") => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setOpenAlert(true);
    };
    const handleCloseAlert = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert(false);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            // Usuario autenticado correctamente, obtener datos adicionales de Realtime Database
            const uid = userCredential.user.uid;
            const db = getDatabase();
            const userRef = ref(db, `Users/UsersClient/${uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                console.log(snapshot.val());
                // Aquí puedes hacer algo con los datos del usuario
                navigate("/"); // Redirige al usuario después de iniciar sesión y obtener datos
            } else {
                showAlert("No se encontraron datos de usuario.", "warning");
            }
        } catch (error) {
            showAlert(`Error en el inicio de sesión: ${error.message}`, "error");
        }
    };

    // Función simulada para el inicio de sesión con Google
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/"); // Redirige al usuario después de iniciar sesión
        } catch (error) {
            console.error("Error en el inicio de sesión con Google: ", error.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs" >
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Card >
                    <CardContent
                        sx={{
                            alignContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            justifyContent: "space-around",
                            p: 2,
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Iniciar sesión
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Correo electrónico"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={handleLogin}
                                sx={{ mt: 3, mb: 2, background: "#000" }}
                            >
                                Iniciar sesión
                            </Button>

                            <Grid container>
                                <Grid item xs>
                                    {/* Botón de Google */}
                                    <Button
                                        startIcon={<GoogleIcon />}
                                        fullWidth
                                        variant="outlined"
                                        onClick={handleGoogleSignIn}
                                        sx={{ color: "#000" }}
                                    >
                                        Inicia sesión con Google
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
                <Divider />
                <Box
                    sx={{
                        marginTop: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        justifyContent: "center",
                    }}
                >
                    <Card
                        sx={{
                            alignContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            justifyContent: "center",
                        }}
                    >
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
                                No tinenes una cuenta?
                            </Typography>

                            <Typography
                                onClick={() => navigate("/SignUp")}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    color: '#292929',
                                    alignContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    p: 2,
                                }}
                            >
                                SignUp <ArrowForwardIosIcon fontSize="small" sx={{ color: '#292929' }} />
                            </Typography>

                        </CardContent>
                    </Card>
                </Box>
                <Snackbar
                    open={openAlert}
                    autoHideDuration={6000}
                    onClose={handleCloseAlert}
                >
                    <Alert
                        onClose={handleCloseAlert}
                        severity={alertSeverity}
                        sx={{ width: "100%" }}
                    >
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default SignIn;

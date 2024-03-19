import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { signInWithEmailAndPassword, getRedirectResult } from "firebase/auth";
import { auth } from "../../Data/Database";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { AppBar, Card, CardContent, Toolbar } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SignIn = () => {
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info"); // Puedes usar 'error', 'warning', 'info', 'success'
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const showAlert = (message, severity = "info") => {
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
                const userRole = snapshot.val().role;
                if (userRole === "taxista") {
                    navigate("/HomeTaxista");
                } else if (userRole === "usuario") {
                    navigate("/HomeScreen");
                } else {
                    // Si el rol no es ni 'taxista' ni 'usuario', maneja el caso (por ejemplo, mostrando una alerta)
                    showAlert("Rol de usuario no reconocido.", "warning");
                }
            } else {
                showAlert("No se encontraron datos de usuario.", "warning");
            }
        } catch (error) {
            showAlert(`Error en el inicio de sesión: ${error.message}`, "error");
        }
    };

    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    // El usuario ha iniciado sesión correctamente, puedes obtener el usuario de result.user

                    showAlert(`Se inicio sesión correctamente en Google: ${result.user}`);

                    navigate("/HomeScreen"); // Redirige al usuario después de iniciar sesión
                }
            })
            .catch((error) => {
                showAlert(
                    `Error al obtener el resultado de la redirección: ${error.message}`
                );
            });
    }, [navigate]);

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderRadius: 2,
                    background: "black",
                    visibility: "visible",
                    display: "-moz-initial",
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Toolbar>
                    <Typography component="h1" variant="h5">
                        Iniciar sesión
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    overflowY: "auto",
                    padding: "10px",
                    marginTop: 10,
                    marginBottom: 4,
                    maxWidth: "100%",
                    flexGrow: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Card
                        raised
                        sx={{
                            background: "#fff",
                            mx: "auto"
                        }}
                    >
                        <CardContent
                            sx={{
                                alignContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                justifyContent: "space-around",
                                p: 2,
                            }}
                        >

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
                            </Box>
                        </CardContent>
                    </Card>

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
                            raised
                            sx={{
                                background: "#fff",
                                mx: "auto",
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
                                        color: "#292929",
                                        alignContent: "center",
                                        textAlign: "center",
                                        p: 2,
                                    }}
                                >
                                    SignUp{" "}
                                    <ArrowForwardIosIcon
                                        fontSize="small"
                                        sx={{ color: "#292929" }}
                                    />
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
        </>
    );
};

export default SignIn;
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { signInWithEmailAndPassword, getRedirectResult, getAuth } from "firebase/auth";
import { auth } from "../../Data/Database";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { AppBar, Card, CardContent, Toolbar } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Footer from "../../Components/Footer/Footer";

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
        const auth = getAuth();
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

            // Primero, intenta obtener el usuario como AdminSuperior
            let userRef = ref(db, `Users/AdminSuperior`);
            let snapshot = await get(userRef);
            if (snapshot.exists() && snapshot.val().email === email) {
                // Si el usuario es AdminSuperior y coincide el email, redirige al home del admin
                navigate("/HomeAdmin");
                return; // Detén la ejecución para evitar más comprobaciones
            }

            // Si no es AdminSuperior, verifica si es un usuario cliente
            userRef = ref(db, `Users/UsersClient/${uid}`);
            snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userRole = snapshot.val().role;
                if (userRole === "taxista") {
                    navigate("/HomeTaxista");
                } else if (userRole === "usuario") {
                    navigate("/HomeScreen");
                } else if (userRole === "admin") {
                    navigate("/HomeAdmin");
                } else {
                    // Si el rol no es ni 'taxista' ni 'usuario', maneja el caso (por ejemplo, mostrando una alerta)
                    showAlert("Rol de usuario no reconocido.", "warning");
                }
            } else {
                showAlert("No se encontraron datos de usuario.", "warning");
            }
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
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
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px',
                    background: "black",
                    visibility: "visible",
                    display: "-moz-initial",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                }}
            >
                <Toolbar>
                    <Typography component="h1" variant="h5" sx={{ color: '#f4f4f4' }}>
                        Iniciar sesión
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    width: '100%',
                    background:'#f4f4f4'
                }}>
                <Container
                    component="main"
                    maxWidth="xs"
                    sx={{
                        overflowY: "auto",
                        padding: "10px",
                        marginBottom: 4,
                        maxWidth: "100%",
                        flexGrow: 1,
                        height: '100vh',

                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        <Card
                            raised
                            sx={{
                                background: "#fff",
                                mx: "auto",
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
                                        variant="filled"
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
                                        variant="filled"
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
            </Box>
            <Footer />
        </>
    );
};

export default SignIn;

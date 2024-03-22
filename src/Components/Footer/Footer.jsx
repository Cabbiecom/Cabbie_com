import React from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import { useSpring, animated } from "react-spring";
import FooterAnimated from "./FooterAnimated";
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    const fade = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 2000 },
    });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "center",
                alignContent: 'center',
                alignItems: 'center',
                height: "90vh",
                background: "#f4f4f4",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: 'center',
                    marginTop: '40px'
                }}
            >
                <FooterAnimated />

            </Box>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: '20px'
                }}
            >
                <Box sx={{ margin: "0 20px" }}>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ color: "rgb(115, 115, 115)" }}
                    >
                        Descarga la app
                    </Typography>
                    <Grid container spacing={2} justifyContent="center" >
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <animated.div style={fade}>
                                <Button
                                    variant="contained"
                                    startIcon={<AndroidIcon />}
                                    href="https://play.google.com/store/apps/details?id=com.cabbie"
                                    target="_blank"
                                    sx={{
                                        background: "green",
                                        display: 'flex',
                                        width: '100%'

                                    }}
                                >
                                    <Typography component="h3" variant="h8">
                                        Play Store
                                    </Typography>
                                </Button>
                            </animated.div>

                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <animated.div style={fade}>
                                <Button
                                    variant="contained"
                                    startIcon={<AppleIcon />}
                                    href="https://apps.apple.com/app/cabbie"
                                    target="_blank"
                                    sx={{
                                        background: "#000",
                                        display: 'flex',
                                        width: '100%'

                                    }}
                                >
                                    <Typography component="h3" variant="h8">
                                        App Store
                                    </Typography>
                                </Button>
                            </animated.div>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Box
                sx={{
                    mt: 4,
                    justifyContent: 'space-between'
                }}
            >

                <animated.div style={fade}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Grid container spacing={2} justifyContent="center">

                            <Grid item xs={12} sm={6} md={3}>
                                <Typography textAlign="center">
                                    <RouterLink to="/Legal" style={{ textDecoration: 'none', color: 'rgb(115, 115, 115)' }}>
                                        Términos y condiciones
                                    </RouterLink>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography textAlign="center">
                                    <RouterLink to="/Legal" style={{ textDecoration: 'none', color: 'rgb(115, 115, 115)' }}>
                                        Privacidad
                                    </RouterLink>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography textAlign="center">
                                    <RouterLink to="/Legal" style={{ textDecoration: 'none', color: 'rgb(115, 115, 115)' }}>
                                        Tutorial
                                    </RouterLink>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography textAlign="center">
                                    <RouterLink to="/Legal" style={{ textDecoration: 'none', color: 'rgb(115, 115, 115)' }}>
                                        Acerca de
                                    </RouterLink>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </animated.div>

                <Box
                    sx={{
                        mt: 4,
                        marginBottom: '20px'
                    }}
                >
                    <animated.div style={fade}>
                        <Typography variant="body2" sx={{ color: "rgb(115, 115, 115)" }}>
                            © 2024 Cabbie from{" "}
                            <span style={{ color: "purple", fontWeight: "bold" }}>
                                Corman
                            </span>
                        </Typography>
                    </animated.div>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;

import React, { useState } from "react";
import { Parallax } from "react-parallax";
import {
    Container, Typography,
    Box, AppBar,
    Toolbar,
    MenuItem, Menu,
    IconButton, useMediaQuery
}
    from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@emotion/react";
import { Link, useNavigate } from "react-router-dom";

const Legal = () => {
    //Navegation
    const navigateanv = useNavigate();
    //Configuracion de la funcione del manú
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const theme = useTheme();
    // Usa useMediaQuery para verificar el tamaño de la pantalla
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //Funcion del scroll del parallax
    const scrollToSection = (sectionId) => {
        handleClose();
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <div style={{ background: "#f4f4f4" }}>
            <AppBar position="sticky" sx={{ background: 'transparent', boxShadow: 'none' }}>
                <Toolbar sx={{ color: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6"
                        component="h6"
                        gutterBottom sx={{ color: '#000', cursor:'pointer' }}
                        onClick={() => {
                            navigateanv("/");
                        }}>
                        Cabbie
                    </Typography>
                    {isMobile ? (
                        <>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={handleClick}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => scrollToSection("#terminos")}>Términos y Condiciones</MenuItem>
                                <MenuItem onClick={() => scrollToSection("#privacidad")}>Privacidad</MenuItem>
                                <MenuItem onClick={() => scrollToSection("#tutorial")}>Tutorial</MenuItem>
                                <MenuItem onClick={() => scrollToSection("#acercade")}>Acerca de</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Box style={{ color: '#000', display: 'flex', justifyContent: 'space-between', width: '500px' }}>
                            <Link to="#terminos" onClick={() => scrollToSection("#terminos")}>
                                Términos y Condiciones
                            </Link>
                            <Link to="#privacidad" onClick={() => scrollToSection("#privacidad")}>
                                Privacidad
                            </Link>
                            <Link to="#tutorial" onClick={() => scrollToSection("#tutorial")}>
                                Tutorial
                            </Link>
                            <Link to="#acercade" onClick={() => scrollToSection("#acerca-de")}>
                                Acerca de
                            </Link>
                        </Box>
                    )}

                </Toolbar>
            </AppBar>
            <div id="terminos">
                <Parallax bgImage="../../Assets/images/Cabbie.png" strength={500}>
                    <Box
                        sx={{
                            height: 500,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h2" component="h2" gutterBottom>
                            Términos y Condiciones
                        </Typography>
                        <Container>
                            <Typography variant="body1" gutterBottom>
                                Contenido de Términos y Condiciones...
                            </Typography>
                        </Container>
                    </Box>
                </Parallax>
            </div>
            <div id="privacidad">
                <Parallax bgImage="/path/to/another/background/image.jpg" strength={500}>
                    <Box
                        sx={{
                            height: 500,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h2" component="h2" gutterBottom>
                            Privacidad
                        </Typography>
                        <Container>
                            <Typography variant="body1" gutterBottom>
                                Contenido de Privacidad...
                            </Typography>
                        </Container>
                    </Box>
                </Parallax>
            </div>
            <div id="tutorial">
                <Parallax
                    bgImage="/path/to/a/different/background/image.jpg"
                    strength={500}
                >
                    <Box
                        sx={{
                            height: 500,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h2" component="h2" gutterBottom>
                            Tutorial
                        </Typography>
                        <Container>
                            <Typography variant="body1" gutterBottom>
                                Contenido del Tutorial...
                            </Typography>
                        </Container>
                    </Box>
                </Parallax>
            </div>
            <div id="acercade">
                <Parallax
                    bgImage="/path/to/yet/another/background/image.jpg"
                    strength={500}
                >
                    <Box
                        sx={{
                            height: 500,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h2" component="h2" gutterBottom>
                            Acerca de
                        </Typography>
                        <Container>
                            <Typography variant="body1" gutterBottom>
                                Contenido sobre Acerca de...
                            </Typography>
                        </Container>
                    </Box>
                </Parallax>
            </div>
        </div>
    );
};

export default Legal;

import React, { useState } from "react";
import { Parallax } from "react-parallax";
import {
    Container,
    Typography,
    Box,
    AppBar,
    Toolbar,
    MenuItem,
    Menu,
    IconButton,
    useMediaQuery,
    Card,
    Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@emotion/react";
import { Link, useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { ArrowBackIos, Circle } from "@mui/icons-material";

import { ReactComponent as CabbieSVG } from "./svg/security_on.svg";
import { ReactComponent as PersonSVG } from "./svg/personal_info_re.svg";
const Legal = () => {
    //Navegation
    const navigateanv = useNavigate();
    //Configuracion de la funcione del manú
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const theme = useTheme();
    // Usa useMediaQuery para verificar el tamaño de la pantalla
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

    const props = useSpring({
        to: { opacity: 1, transform: "translateX(0)" },
        from: { opacity: 0, transform: "translateX(-100px)" },
        reset: true,
        delay: 200,
    });

    return (
        <div style={{ background: "#f4f4f4" }}>
            <AppBar
                position="sticky"
                sx={{ background: "transparent", boxShadow: "none" }}
            >
                <Toolbar
                    sx={{
                        color: "#000",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h6"
                        gutterBottom
                        sx={{
                            color: "#000",
                            display: "flex",
                            cursor: "pointer",
                            justifyContent: "center",
                            alignContent: "center",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                        onClick={() => {
                            navigateanv("/");
                        }}
                    >
                        <ArrowBackIos />
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
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => scrollToSection("#terminos")}>
                                    Términos y Condiciones
                                </MenuItem>
                                <MenuItem onClick={() => scrollToSection("#privacidad")}>
                                    Privacidad
                                </MenuItem>
                                <MenuItem onClick={() => scrollToSection("#tutorial")}>
                                    Tutorial
                                </MenuItem>
                                <MenuItem onClick={() => scrollToSection("#acercade")}>
                                    Acerca de
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Box
                            style={{
                                color: "#000",
                                display: "flex",
                                justifyContent: "space-between",
                                width: "500px",
                            }}
                        >
                            <Link to="#terminos" onClick={() => scrollToSection("#terminos")}>
                                Términos y Condiciones
                            </Link>
                            <Link
                                to="#privacidad"
                                onClick={() => scrollToSection("#privacidad")}
                            >
                                Privacidad
                            </Link>
                            <Link to="#tutorial" onClick={() => scrollToSection("#tutorial")}>
                                Tutorial
                            </Link>
                            <Link to="#acercade" onClick={() => scrollToSection("#acercade")}>
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
                            height: 1600,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h2" component="h2" gutterBottom>
                            Términos y Condiciones
                        </Typography>
                        <animated.div>
                            <Container maxWidth="md">
                                <Box
                                    elevation={3}
                                    sx={{
                                        padding: "24px",
                                        marginTop: "24px",
                                        marginBottom: "24px",
                                    }}
                                >
                                    <Typography variant="h4" gutterBottom>
                                        Certificación DPF de UTI
                                    </Typography>

                                    <Typography variant="body1" paragraph>
                                        UTI ha certificado al Departamento de Comercio de los
                                        Estados Unidos que se adhiere a (1) la UE-EE. UU. Principios
                                        del Marco de Privacidad de los datos relativos al
                                        tratamiento de los datos personales recibidos de los países
                                        miembros del EEA de acuerdo con UE-EE. UU. DPF, y del Reino
                                        Unido (y Gibraltar) en función de la Ampliación del Reino
                                        Unido al DPF UE-EE. UU. y (2) los Principios del Marco de
                                        Privacidad de los datos relacionados con el tratamiento de
                                        los datos personales recibidos de Suiza de acuerdo con la
                                        normativa del DPF Suiza-EE. UU. En caso de conflicto entre
                                        este aviso y los Principios mencionados anteriormente,
                                        prevalecerán los Principios. En caso de que los DPF UE-EE.
                                        UU. o el DPF Suiza-EE. UU. se invalidaran, UTI transferirá
                                        los datos que estén sujetos a estas certificaciones de
                                        acuerdo con los otros mecanismos de transferencia de datos
                                        descritos anteriormente.
                                    </Typography>

                                    <Typography variant="h6" gutterBottom>
                                        Tenga en cuenta lo siguiente:
                                    </Typography>

                                    <Typography variant="body1" paragraph>
                                        <b>Ámbito:</b> La certificación DPF de UTI se aplica a los
                                        datos relacionados con los interesados en el EEA, el Reino
                                        Unido o Suiza que recibe de otros responsables del
                                        tratamiento de datos.
                                    </Typography>

                                    <Typography variant="body1" paragraph>
                                        <b>Acceso:</b> Los usuarios tienen derecho a acceder a sus
                                        datos personales, que están sujetos a la certificación DPF
                                        de UTI. Para obtener información sobre cómo ejercer este
                                        derecho, consulte la sección “Elección y transparencia” más
                                        arriba.
                                    </Typography>

                                    <Typography variant="body1" paragraph>
                                        <b>Transferencia posterior:</b> UTI es el responsable de la
                                        transferencia de los datos personales, sujeta a su
                                        certificación a terceros.
                                    </Typography>

                                    <Typography variant="body1" paragraph>
                                        <b>Solicitud de las autoridades judiciales:</b> La ley
                                        aplicable exige que UTI comparta los datos de los usuarios,
                                        incluidos los que pueden estar sujetos a la certificación de
                                        UTI, de conformidad con un proceso legal o una solicitud
                                        gubernamental, incluida la de las fuerzas de seguridad.
                                    </Typography>

                                    <Typography variant="body1" paragraph>
                                        <b>Investigación y ejecución:</b> UTI está sujeto a las
                                        facultades de investigación y ejecución de la Comisión
                                        Federal de Comercio de los EE. UU.
                                    </Typography>

                                    <Typography variant="body1" paragraph>
                                        <b>Preguntas y disputas:</b> Los pasajeros y los
                                        destinatarios de las entregas pueden contactar con UTI{" "}
                                        <Link href="#">aquí</Link>, y los conductores y repartidores
                                        pueden contactar con UTI <Link href="#">aquí</Link> si
                                        tienen preguntas sobre nuestro cumplimiento de los
                                        Principios mencionados anteriormente.
                                    </Typography>
                                </Box>
                            </Container>
                        </animated.div>
                    </Box>
                </Parallax>
            </div>
            <div id="privacidad">
                <Parallax
                    bgImage="/path/to/another/background/image.jpg"
                    strength={1000}
                >
                    <Box
                        sx={{
                            height: 900,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h2" component="h2" gutterBottom>
                            Privacidad
                        </Typography>
                        <animated.div style={props}>
                            <Container>
                                <Typography variant="h5" gutterBottom>
                                    Este aviso se aplica a los usuarios de las aplicaciones, los sitios web y otros servicios de Cabbie en todo el mundo. </Typography>
                                <br />
                                <Typography variant="body3" gutterBottom>
                                    Cuando utiliza Cabbie, nos confía su información personal.
                                    Prometemos no traicionar la confianza de nuestros clientes.
                                    Para lograr esto, primero queremos ayudarlo a comprender
                                    nuestras prácticas de privacidad. Este Aviso describe qué
                                    información personal (“Información”) recopilamos, cómo la
                                    usamos y divulgamos, y las opciones que usted tiene al
                                    respecto. Le recomendamos que lo lea junto con nuestra
                                    información general de privacidad, que destaca información
                                    sobre nuestras prácticas de privacidad y describe la
                                    información que recopilamos y cómo la usamos.
                                </Typography>
                            </Container>
                        </animated.div>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 2,
                                p: 2,
                            }}
                        >
                            <animated.div style={props}>
                                {/* Hace que el SVG se adapte al tamaño de su contenedor */}
                                <Box
                                    sx={{
                                        maxWidth: { xs: "100%", sm: "345px" },
                                        overflow: "hidden",
                                        flexGrow: 1,
                                    }}
                                >
                                    <CabbieSVG style={{ width: "100%", height: "auto" }} />
                                </Box>
                            </animated.div>
                        </Box>
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
                            height: 600,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h2" component="h2" gutterBottom>
                            Acerca de
                        </Typography>
                        <animated.div style={props}>
                            <Container>
                                <Typography variant="h5" gutterBottom>
                                    Trabajamos para mejorar la movilidad en todo el mundo.
                                </Typography>
                                <br />
                                <Typography variant="body3" gutterBottom>
                                    Movilizamos al mundo y eso es lo que mejor hacemos. Es nuestra
                                    verdadera naturaleza. Corre por nuestras venas. Es lo que nos
                                    saca de la cama cada mañana. Nos motiva a reinventar
                                    constantemente mejores formas de movernos. A usted. Para todos
                                    los lugares que quieras visitar. Para todo lo que quieras
                                    lograr. Cualquier forma que desees obtener ganancias. Mundial.
                                    tiempo real. A la increíble velocidad actual.
                                </Typography>
                            </Container>
                        </animated.div>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 2,
                                p: 2,
                            }}
                        >
                            <Container>
                                <animated.div style={props}>
                                    {/* Hace que el SVG se adapte al tamaño de su contenedor */}
                                    <Box
                                        sx={{
                                            maxWidth: { xs: "100%", sm: "345px" },
                                            overflow: "hidden",
                                            flexGrow: 1,
                                        }}
                                    >
                                        <PersonSVG style={{ width: "100%", height: "auto" }} />
                                    </Box>
                                </animated.div>
                            </Container>
                        </Box>
                    </Box>
                </Parallax>
            </div>
        </div>
    );
};

export default Legal;

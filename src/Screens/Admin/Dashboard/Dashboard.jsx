import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { Button, TextField, Container, Box } from '@mui/material';

const Dashboard = () => {
    // Estado para manejar la entrada del usuario
    const [inputValue, setInputValue] = useState('');

    // Animación simple usando react-spring
    const fade = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });

    // Función para manejar el cambio en el TextField
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // Función para manejar el envío de datos
    const handleSubmit = () => {
        console.log("Enviando datos:", inputValue);
        // Aquí iría la lógica para actualizar la base de datos
    };

    return (
        <Container maxWidth="sm">
            <animated.div style={fade}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                    <TextField
                        label="Input de ejemplo"
                        variant="outlined"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Enviar
                    </Button>
                </Box>
            </animated.div>
        </Container>
    );
}

export default Dashboard;

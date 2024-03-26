//import { Avatar, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
//import logo from '../../Assets/images/CabbieXL.jpeg';
import NoCrashIcon from '@mui/icons-material/NoCrash';
const FooterAnimated = () => {
    const [toggle, setToggle] = useState(false);
    const springs = useSpring({
        from: {
            x: 0, y: 0,
            background: '#ff6d6d',
            transform: 'scale(1) translate(0px, 0px)',
            borderRadius: '0%'
        },
        to: async (next) => {
            while (true) {
                await next({
                    x: 0, y: -40, background: 'transparent',
                    transform: 'scale(1.1) translate(0px, -40px)', borderRadius: toggle ? '50%' : '0%'
                });
                await next({
                    x: 30, y: 0, background: '#cecece',
                    transform: 'scale(0.9) translate(30px, 0px)', borderRadius: toggle ? '50%' : '0%'
                });
                await next({
                    x: 0, y: 40, background: 'transparent',
                    transform: 'scale(1.1) translate(0px, 40px)', borderRadius: toggle ? '50%' : '0%'
                });
                await next({
                    x: -30, y: 0, background: '#dadada',
                    transform: 'scale(0.9) translate(-30px, 0px)', borderRadius: toggle ? '50%' : '0%'
                });
                setToggle(!toggle); // Toggle the shape at the end of each loop
            }
        },
        loop: true,
    })

    const props = useSpring({
        loop: true, // Hace que la animación se repita indefinidamente
        to: [
            { color: '#FF007F' }, // Rosa fuerte
            { color: '#0000FF' }, // Azul fuerte
            { color: '#00FF00' }, // Verde fuerte
            { color: '#FF007F' }, // Vuelve al rosa fuerte para cerrar el bucle
        ],
        from: { color: '#FF007F' }, // Color inicial
        config: { duration: 2000 },
    });

    return (
        <>
            <animated.div
                style={{
                    margin: '0 auto',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...springs,
                }}>
                <animated.span
                    style={
                        props
                    }>
                    <NoCrashIcon
                        style={{
                            fontSize: '3rem'
                        }} />
                </animated.span>
            </animated.div>
        </>
    );
}

export default FooterAnimated;
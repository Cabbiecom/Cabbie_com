import { Avatar } from "@mui/material";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import logo from '../../Assets/images/CabbieXL.jpeg';
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
                await next({ x: 0, y: -40, background: '#ff6d6d', transform: 'scale(1.1) translate(0px, -40px)', borderRadius: toggle ? '50%' : '0%' });
                await next({ x: 30, y: 0, background: '#fff59a', transform: 'scale(0.9) translate(30px, 0px)', borderRadius: toggle ? '50%' : '0%' });
                await next({ x: 0, y: 40, background: '#88DFAB', transform: 'scale(1.1) translate(0px, 40px)', borderRadius: toggle ? '50%' : '0%' });
                await next({ x: -30, y: 0, background: '#569AFF', transform: 'scale(0.9) translate(-30px, 0px)', borderRadius: toggle ? '50%' : '0%' });
                setToggle(!toggle); // Toggle the shape at the end of each loop
            }
        },
        loop: true,
    })

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
                <Avatar src={logo} style={{...springs}} />
            </animated.div>
        </>
    );
}

export default FooterAnimated;
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear un contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Componente proveedor para envolver tu aplicación o componentes
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Aquí puedes agregar la lógica para verificar si el usuario está logueado al cargar la aplicación.
    // Por ejemplo, podrías verificar un token almacenado en localStorage.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Función para iniciar sesión
    // Aquí deberías añadir la lógica para autenticar al usuario, por ejemplo, hacer una petición a tu servidor
    const login = async (username, password) => {
        // Simulación de inicio de sesión
        const user = { id: 1, name: 'Usuario Demo', username };
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // El valor que se pasa al contexto incluye el estado del usuario y las funciones para modificarlo
    const value = {
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

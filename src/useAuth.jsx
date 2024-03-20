import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Esta es una función de utilidad que podrías querer usar en cualquier parte de tu app para verificar el estado de autenticación
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        // Limpiar suscripción al desmontar
        return () => unsubscribe();
    }, []);

    return isAuthenticated;
}

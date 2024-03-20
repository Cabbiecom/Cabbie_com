import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from 'firebase/database';

function useFetchTaxiUsers() {
    const [taxiUsers, setTaxiUsers] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const taxiUsersQuery = query(ref(db, 'Users/UsersClient'), orderByChild('role'), equalTo('taxista'));

        // `onValue` devuelve una función de des-suscripción que se puede llamar para cancelar la escucha
        const unsubscribe = onValue(taxiUsersQuery, (snapshot) => {
            const users = [];
            snapshot.forEach((childSnapshot) => {
                const key = childSnapshot.key;
                const data = childSnapshot.val();
                if (data.ubicacion) {
                    users.push({
                        uid: key,
                        ...data,
                    });
                }
            });
            setTaxiUsers(users);
            const usuariosString = JSON.stringify(taxiUsers, null, 2);
            console.log(usuariosString);
        });

        // Llamar a `unsubscribe` para limpiar la suscripción
        return () => unsubscribe();
    }, [taxiUsers]);

    return taxiUsers;
}

export default useFetchTaxiUsers;

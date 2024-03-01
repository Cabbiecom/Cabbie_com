// useFetchTaxiUsers.js
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const useFetchTaxiUsers = () => {
  const [taxiUsers, setTaxiUsers] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'Users/UsersClient');

    onValue(usersRef, (snapshot) => {
      const users = snapshot.val();
      const fetchedTaxiUsers = [];
      for (let id in users) {
        if (users[id].role === 'taxista') {
          fetchedTaxiUsers.push({ ...users[id], id });
        }
      }
      setTaxiUsers(fetchedTaxiUsers);
    });
  }, []);

  return taxiUsers;
};

export default useFetchTaxiUsers;

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
export const fakeData = [
    {
        UMC: '12345',
        description: 'tomate en sauce Mozila',
        entryDate: '2024-01-02',
        bestBefore: '2025-04-03',
        user: 'Jerod14@hotmail.com'
    },
    {
        UMC: '08m6rx',
        description: 'Riz en grain LeBonRiz',
        entryDate: '2024-01-02',
        bestBefore: '2025-04-03',
        user: 'Hugh'
    },
    {
        UMC: '5ymtrc',
        description: 'Cannettes Coca - lot de 12',
        entryDate: '2024-01-02',
        bestBefore: '2025-04-03',
        user: 'Kef'
    },
    {
        UMC: 'ek5b97',
        description: 'Un autre article',
        entryDate: '2024-01-02',
        bestBefore: '2025-04-03',
        user: 'Eric0@yahoo.com'
    },
    {
        UMC: 'xxtydd',
        description: 'encore un autre article',
        entryDate: '2024-01-02',
        bestBefore: '2025-04-03',
        user: 'Leila Assoud'
    },
    {
        UMC: 'wzxj9m',
        description: 'description article',
        entryDate: '2024-01-02',
        bestBefore: '2025-04-03',
        user: 'Veda Feeney'
    },
    {
        UMC: '21dwtz',
        description: 'description article',
        entryDate: '2024-01-02',
        bestBefore: '2025-04-03',
        user: 'Melvin.Pacocha@yahoo.com'
    },
    {
        UMC: 'o8oe4k',
        description: 'description article',
        entryDate: '2024-01-02',
        bestBefore: '2025-04-03',
        user: 'Juju'
    },
];

const firebaseConfig = {
    apiKey: "AIzaSyDDQbjNHCL7TtYLSmbqIZI3a8w19W-xbnk",
    authDomain: "la-boussole-vancouver.firebaseapp.com",
    projectId: "la-boussole-vancouver",
    storageBucket: "la-boussole-vancouver.appspot.com",
    messagingSenderId: "305758368045",
    appId: "1:305758368045:web:a0420abb77215d03d9a3a4",
    measurementId: "G-8CXML2B1VH"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
//connectFirestoreEmulator(db, 'localhost', 8080); // emulator


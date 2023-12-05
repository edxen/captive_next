import { initializeApp } from 'firebase/app';

let firebaseConfig = {};
try {
    firebaseConfig = require('@/.env/firebase.json');
} catch (error) {
    if (process.env.FIREBASE_API_KEY && process.env.FIREBASE_AUTH_DOMAIN && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_STORAGE_BUCKET) {
        firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        };
    } else {
        console.log(`no environment variables set`);
    }
}

const app = initializeApp(firebaseConfig);

export default app;
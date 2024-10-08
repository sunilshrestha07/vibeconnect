import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyAvwAA6vjRel8ksSDmtmSKwFvhPAeofyCM',
  authDomain: 'vibeconnectss.firebaseapp.com',
  projectId: 'vibeconnectss',
  storageBucket: 'vibeconnectss.appspot.com',
  messagingSenderId: '560583409259',
  appId: '1:560583409259:web:91cef95d2bb8b5662efb2e',
  measurementId: 'G-VT6D5031RZ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

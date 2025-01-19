// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: 'AIzaSyD9M3JlCdiH70SN7nnLl9Yhve-mrG3kh_M',
   authDomain: 'decodeit-f84ea.firebaseapp.com',
   projectId: 'decodeit-f84ea',
   storageBucket: 'decodeit-f84ea.appspot.com',
   messagingSenderId: '340559089409',
   appId: '1:340559089409:web:1c0e0ee16b65c1966e5500',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

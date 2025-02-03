// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDqOwwoBOQaHZ5z3Y6dy8io9mVpY8V1REk',
  authDomain: 'contressa-c1796.firebaseapp.com',
  projectId: 'contressa-c1796',
  storageBucket: 'contressa-c1796.firebasestorage.app',
  messagingSenderId: '1026366945859',
  appId: '1:1026366945859:web:428bc9ebfca1fbb0a0b2f6',
  measurementId: 'G-RXGZF90P8W',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        'BFapdRcaP-9zD2pMDAwwyaC9GiRBG9_2DtlrwQ0ozDCvjdaTb_aneLD-wP8ak3DXplBUtYeNgHJnbbbHJq8klNk',
    });
    console.log(token);
  }
};


// useEffect(()=>{
//     generateToken()
//   },[])

//use this to get the token
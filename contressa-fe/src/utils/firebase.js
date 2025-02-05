// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB3c5L6h30o_yLoLbi8me01-2kX5LoIk4E",
  authDomain: "contressa-f3034.firebaseapp.com",
  projectId: "contressa-f3034",
  storageBucket: "contressa-f3034.firebasestorage.app",
  messagingSenderId: "51189242077",
  appId: "1:51189242077:web:d2b55b647edd38e2ad6334",
  measurementId: "G-DKZ2Y8FETN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        'BI70DbiolF0euDql717BAc-XTKCnbWOV0LY4g4nvyvIDJu-pDlG83dnc34oDHM_1Jxe5mLZ8bABpjEsh1FM2tWM',
    });
    console.log(token);
  }
};


// useEffect(()=>{
//     generateToken()
//   },[])

//use this to get the token
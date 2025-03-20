import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
  production: false,
  apiUrl: '',
  baseUrl: 'http://18.229.202.71:4000/',
  //baseUrl: 'http://192.168.29.45:4000/',
  firebaseConfig: {
    apiKey: "AIzaSyAU9-A84T1L9LCE9m5OLlOqFC8WWGoKcJI",
    authDomain: "lifesmoments-c1d5d.firebaseapp.com",
    projectId: "lifesmoments-c1d5d",
    storageBucket: "lifesmoments-c1d5d.appspot.com",
    messagingSenderId: "390559987051",
    appId: "1:390559987051:web:57e1cc8f16959f50cc882e",
    measurementId: "G-CTTRL41WNG",
    vapidKey: "BEtwK8zIwHfKqkT4UygGpyraVZSRM35ZzJhNoReVxNmlMXOMXPc7XoqZY7PfaT-b01duem0GxEvhNen7qD8qv5I"
  }
}

// const firebaseConfig = {
//   apiKey: "AIzaSyAU9-A84T1L9LCE9m5OLlOqFC8WWGoKcJI",
//   authDomain: "lifesmoments-c1d5d.firebaseapp.com",
//   projectId: "lifesmoments-c1d5d",
//   storageBucket: "lifesmoments-c1d5d.firebasestorage.app",
//   messagingSenderId: "390559987051",
//   appId: "1:390559987051:web:57e1cc8f16959f50cc882e",
//   measurementId: "G-CTTRL41WNG",
//   vapidKey: "BEtwK8zIwHfKqkT4UygGpyraVZSRM35ZzJhNoReVxNmlMXOMXPc7XoqZY7PfaT-b01duem0GxEvhNen7qD8qv5I"
// };

// const app = initializeApp(firebaseConfig);

// //const messaging = getMessaging(app);
// const analytics = getAnalytics(app);
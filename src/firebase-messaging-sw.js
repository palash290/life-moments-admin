importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAU9-A84T1L9LCE9m5OLlOqFC8WWGoKcJI",
  authDomain: "lifesmoments-c1d5d.firebaseapp.com",
  projectId: "lifesmoments-c1d5d",
  storageBucket: "lifesmoments-c1d5d.appspot.com",
  messagingSenderId: "390559987051",
  appId: "1:390559987051:web:57e1cc8f16959f50cc882e",
  measurementId: "G-CTTRL41WNG",
  vapidKey: "BEtwK8zIwHfKqkT4UygGpyraVZSRM35ZzJhNoReVxNmlMXOMXPc7XoqZY7PfaT-b01duem0GxEvhNen7qD8qv5I"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'No Title';
  const notificationOptions = {
    // title: payload.notification?.title || 'No Title',
    body: payload.notification?.body || 'No Body',
    icon: payload.notification?.icon || '/firebase-logo.png'
  };
  console.log('Attempting to show notification:', notificationTitle, notificationOptions);

  self.registration.showNotification(notificationTitle, notificationOptions);

});

console.log("service worker", messaging);

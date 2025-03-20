// src/firebase-messaging-sw.js

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
});

const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log('Received background message:', payload);

//   if (self.registration) {
//     self.registration.showNotification('Test Notification', {
//       body: 'This is a manual test notification!',
//       icon: '/firebase-logo.png'
//     });
//   } else {
//     console.warn('Service worker registration not found.');
//   }
// });

messaging.onBackgroundMessage(function (payload) {
  debugger
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'No Title';
  const notificationOptions = {
    //title: payload.notification?.title || 'No Title',
    body: payload.notification?.body || 'No Body',
    icon: payload.notification?.icon || '/firebase-logo.png'
  };
  console.log('Attempting to show notification:', notificationTitle, notificationOptions);

  // self.addEventListener('notificationclick', function(event) {
  //   event.notification.close();
  // });

  // // Ensure service worker handles the notification properly
  // self.registration.showNotification(notificationTitle, notificationOptions)
  //   .catch(err => console.error('Notification failed:', err));

  self.registration.showNotification(notificationTitle, notificationOptions);

});

console.log("service worker", messaging);

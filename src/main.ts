import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

initializeApp(environment.firebaseConfig);
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}
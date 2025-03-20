import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { initializeApp } from 'firebase/app';
// import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

// initializeApp(environment.firebaseConfig);
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

import { Injectable } from '@angular/core';

import { getMessaging, Messaging, onMessage } from '@angular/fire/messaging';
import { getToken } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from './shared.service';
import { environment } from '../../../environments/environment';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private headerDataSubject = new BehaviorSubject<any>(null);
  headerData$ = this.headerDataSubject.asObservable();

  constructor(private afMessaging: AngularFireMessaging, private apiService: SharedService) { }

  // listenForMessages() {
  //   this.afMessaging.messages.subscribe((message) => {
  //     console.log('Foreground message received:', message);
   
  //   // const messaging = getMessaging();
  //   // onMessage(messaging, (payload) => {
  //     // console.log(" noticiation payload componet", message);
  //     this.setHeaderData(message)
  //     // Extract title and body, providing fallback values if they are undefined
  //     const title = message.notification?.title || 'Notification';
  //     const body = message.notification?.body || '';
  //     // Display the notification using the Notification API
  //     new Notification(title, {
  //       body: body,
  //       icon: '', // optional: specify a custom icon path
  //     });
  //   });
  // };

  listenForMessages() {
    // Request permission if not already granted
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.showForegroundNotification();
        } else {
          console.warn('Notification permission denied');
        }
      });
    } else {
      this.showForegroundNotification();
    }
  }
  
  showForegroundNotification() {
    this.afMessaging.messages.subscribe((message: any) => {
      console.log('Foreground message received:', message);
      
      this.setHeaderData(message);
      
      const title = message.notification?.title || 'Notification';
      const body = message.notification?.body || '';
  
      new Notification(title, {
        body: body,
        icon: 'assets/img/Logo_1.svg', // optional icon
      });
    });
  }
  

  setHeaderData(data: any) {
    this.headerDataSubject.next(data);
  }


}

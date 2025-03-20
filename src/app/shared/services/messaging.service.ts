import { Injectable } from '@angular/core';

import { Messaging, onMessage } from '@angular/fire/messaging';
import { getToken } from '@angular/fire/messaging';
import { getMessaging } from 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from './shared.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private headerDataSubject = new BehaviorSubject<any>(null);
  headerData$ = this.headerDataSubject.asObservable();

  constructor(private messaging: Messaging, private apiService: SharedService) { }

  // requestPermission() {
  //   getToken(this.messaging, {
  //     vapidKey:
  //       environment.firebaseConfig.vapidKey,
  //   })
  //     .then((currentToken) => {
  //       if (currentToken) {
  //         let formData = new URLSearchParams()
  //         formData.set('fcm_token', currentToken)
  //         this.apiService.postAPI('user/update-token', formData.toString()).subscribe((res: any) => {
  //           if (res.success) {
  //             sessionStorage.setItem('auctionFCMToken', currentToken);
  //           }
  //         })
  //       } else {

  //       }
  //     })
  //     .catch((err) => {
  //       console.error('Error in getting token:', err);
  //     });
  // }

  // requestPermission() {
  //   console.log('Requesting FCM token...');
  //   const messaging = getMessaging();

  //   getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey })
  //     .then((currentToken) => {
  //       if (currentToken) {

  //         console.log('FCM token generated:', currentToken);
  //         localStorage.setItem('fcmFbToken', currentToken);
  //       } else {
  //         console.warn('No registration token available. Request permission to generate one.');
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('An error occurred while retrieving the token:', err);
  //     });
  // }

  listenForMessages() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log(" noticiation payload componet", payload);
      this.setHeaderData(payload)
      // Extract title and body, providing fallback values if they are undefined
      const title = payload.notification?.title || 'Notification';
      const body = payload.notification?.body || '';
      // Display the notification using the Notification API
      new Notification(title, {
        body: body,
        icon: '', // optional: specify a custom icon path
      });
    });
  };

  setHeaderData(data: any) {
    this.headerDataSubject.next(data);
  }


}

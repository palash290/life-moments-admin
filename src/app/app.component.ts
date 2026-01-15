import { Component } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { take } from 'rxjs';
import { MessagingService } from './shared/services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private afMessaging: AngularFireMessaging, private msgService: MessagingService) {
  }

  ngOnInit(): void {
    this.requestPermission();
  }

  requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        this.afMessaging.requestToken.subscribe(
          (token) => {
            this.msgService.listenForMessages();
            console.log('lifeFbToken ==>', token!);
            localStorage.setItem('lifeFbToken', token!);
          },
          (error) => {
            console.error('Error getting token:', error);
          }
        );
      } else {
        console.warn('Notification permission denied.');
      }
    });

    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      return;
    }
  }

  // title = 'auction';
  // userId: any;
  // reson: any;

  // constructor(private MessagingService: MessagingService, private router: Router) {
  //   this.router.events.subscribe((event: any) => {
  //     if (event instanceof NavigationEnd) {
  //       Notification.requestPermission().then((permission) => {
  //         if (permission === 'granted' && this.checkAndRequestFCMToken()) {
  //           this.MessagingService.requestPermission()
  //           //this.MessagingService.listenForMessages();
  //         } else {
  //         }
  //       });
  //     }
  //   })
  // }

  // checkAndRequestFCMToken() {
  //   const fcmToken = sessionStorage.getItem('auctionFCMToken');
  //   if (!fcmToken) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  }

















// title = 'auction';
//   userId: any;
//   reson: any;

//   constructor(private MessagingService: MessagingService, private router: Router) {
//     this.router.events.subscribe((event: any) => {
//       if (event instanceof NavigationEnd) {
//         Notification.requestPermission().then((permission) => {
//           if (permission === 'granted' && this.checkAndRequestFCMToken()) {
//             this.MessagingService.requestPermission()
//             this.MessagingService.listenForMessages();
//           } else {
//           }
//         });
//       }
//     })
//   }

//   ngOnInit() {
//     //this.getUserDetail()
//     // this.userId = localStorage.getItem('userIdA');
//     // if (this.userId) {
//     //   this._chatService.connectUser(this.userId);
//     // }
//   }

//   // getUserDetail() {
//   //   this.apiService.userData$.subscribe(res => {
//   //     if (res) {
//   //       this.reson = JSON.parse(res.block_reason)
//   //     } else {
//   //       this.reson = undefined
//   //     }
//   //   })
//   // }

//   checkAndRequestFCMToken() {
//     const fcmToken = sessionStorage.getItem('auctionFCMToken');
//     if (!fcmToken) {
//       return true
//     } else {
//       return false
//     }
//   }
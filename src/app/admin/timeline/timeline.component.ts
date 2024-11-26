import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {

  yearData: any;
  monthlyData: any;
  dayData: any;
  memberId: any;
  loading: boolean = false;

  constructor(private sanitizer: DomSanitizer, private rout: ActivatedRoute, private service: SharedService, private route: Router, private location: Location) { }

  backClicked() {
    this.location.back();
  }

  goBack(){
    this.route.navigateByUrl(`/admin/main/family-member/${this.itemId}/${this.itemEmail}`);
    localStorage.removeItem('itemId')
    localStorage.removeItem('itemEmail')
  }

  sanitizeUrl(url: any): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
  itemId: any;
  itemEmail: any;

  ngOnInit() {

    this.rout.paramMap.subscribe((params) => {
      this.memberId = params.get('id');
    });

    this.getYear();

    this.itemId = localStorage.getItem('itemId')
    this.itemEmail = localStorage.getItem('itemEmail')
  }

  getYear() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('user_id', this.memberId);
    this.service.postAPI(`sub-admin/getYealydata`, formURlData).subscribe({
      next: resp => {
        this.yearData = resp.yearly;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  getMonth() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('user_id', this.memberId);
    this.service.postAPI(`sub-admin/getMonthlydata`, formURlData).subscribe({
      next: resp => {
        this.monthlyData = resp.monthly;
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
      }
    });
  }

  getDates() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('user_id', this.memberId);
    this.service.postAPI(`sub-admin/get-alldatesbyuserid`, formURlData).subscribe({
      next: resp => {
        this.dayData = resp.data;
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
      }
    });
  }

  // getMonths(year: any) {
  //   this.route.navigateByUrl(`/admin/main/timeline-month/${year}`);
  // }

  getYearPhotos(year: any) {
    this.route.navigateByUrl(`/admin/main/photo-album/${year}/${this.memberId}`);
  }

  getMonthPhotos(year: any, month: any) {
    this.route.navigateByUrl(`/admin/main/photo-album-month/${year}/${month}/${this.memberId}`);
  }

  getDate(date: any) {
    this.route.navigateByUrl(`/admin/main/photo-album-date/${this.memberId}/${date}`);
  }

  activeTab: string = 'year';

  setActiveTab(tab: string) {
    this.activeTab = tab;
    // Save the active tab in local storage
    localStorage.setItem('activeTab', tab);
  }




  imageObject: any[] = [];
  picLength: any;

  // getPhotosAlbum() {
  //   const formURlData = new URLSearchParams();
  //   formURlData.set('user_id', this.memberId);
  //   this.service.postAPI(`sub-admin/getDaysdata`, formURlData.toString()).subscribe({
  //     next: resp => {
  //       this.imageObject = resp.monthly.albums_data?.map((item: any) => ({ ...item, checked: false })).reverse();
  //       //this.picLength = this.imageObject.length;
  //     },
  //     error: error => {
  //       console.log(error.message);
  //     }
  //   });
  // }

  imageGroups: any[] = [];
  filterValue: any = "";

  getPhotosAlbum() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('user_id', this.memberId);
    //formURlData.set('type', this.filterValue);
    this.service.postAPI(`sub-admin/getDaysdata`, formURlData.toString()).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.monthly && Array.isArray(resp.monthly)) {
          // Assign grouped data with formatted_date as the parent
          //this.imageObject = resp.monthly.albums_data?.map((item: any) => ({ ...item, checked: false })).reverse();
          this.imageGroups = resp.monthly.map((dateGroup: any) => ({
            formatted_date: dateGroup.formatted_date,
            albums_data: dateGroup.albums_data.map((item: any) => ({
              ...item,
              checked: false
            }))
          }));

          const allAlbums = resp.monthly.flatMap((dateGroup: any) => dateGroup.albums_data);
          this.imageObject = allAlbums.map((item: any) => ({ ...item, checked: false }));
        } else {
          this.loading = false;
          console.log('No data found in response.');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching album photos:', error.message);
      }
    });
  }




  ////video start////

  currentVideoId1: any | null = null;


  toggleVideo1(videoElement: HTMLVideoElement, vId: any) {
    if (this.isFullScreen == true) {
      return;
    }

    if (this.currentVideoId1 && this.currentVideoId1 !== videoElement) {
      this.currentVideoId1.pause(); // Pause the currently playing video
      //this.pauseAllVideos();
    }

    if (videoElement.paused) {
      videoElement.play();
      this.currentVideoId1 = videoElement;
    } else {
      videoElement.pause();
      this.currentVideoId1 = null;
    }
  }

  isVideoPlaying1(videoElement: HTMLVideoElement): boolean {
    return videoElement === this.currentVideoId1 && !videoElement.paused;
  }

  seekValue: number = 0;

  onTimeUpdate1(videoElement: HTMLVideoElement) {
    // Update seek bar value as the video progresses
    if (videoElement.duration) {
      this.seekValue = (videoElement.currentTime / videoElement.duration) * 100;
    }
  }

  setVideoDuration1(videoElement: HTMLVideoElement) {
    if (this.isVideoPlaying1(videoElement)) {
      const seekBar: HTMLInputElement = document.querySelector('.custom-seekbar1')!;
      seekBar.max = "100";
      //this.videoDuration = videoElement.duration;
    }
  }

  onSeek1(event: Event, videoElement: HTMLVideoElement) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const time = (parseFloat(value) / 100) * videoElement.duration;
    videoElement.currentTime = time;
  }

  isFullScreen: boolean = false;

  toggleFullscreen(videoElement: HTMLVideoElement) {
    if (!document.fullscreenElement) {
      this.isFullScreen = true;
      videoElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        //this.isFullScreen = false;
        document.exitFullscreen();
      }
    }
  }


  ////end////

  currentIndex = 0;

  prevImage() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.imageObject.length - 1; // Loop back to the last image
    } else {
      this.currentIndex--;
    }
  }

  nextImage() {
    if (this.currentIndex === this.imageObject.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
  }

  openModal(index: any) {
    this.currentIndex = index;
  }



  downloadImage() {
    const mediaUrl = this.imageObject[this.currentIndex]?.images_url; // Media URL
    const mediaTitle = this.imageObject[this.currentIndex]?.title; // File title
    const fileExtension = mediaUrl.split('.').pop(); // Extract file extension

    fetch(mediaUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch the file');
        }
        return response.blob(); // Convert response to Blob
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob); // Create object URL from Blob
        link.download = `${mediaTitle || 'download'}.${fileExtension}`; // Use title or default name
        link.click(); // Trigger the download

        // Clean up the object URL
        URL.revokeObjectURL(link.href);
      })
      .catch(error => {
        console.error('Error downloading the file:', error);
      });
  }

  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1]; // Subtract 1 since array is 0-based
  }
  


}

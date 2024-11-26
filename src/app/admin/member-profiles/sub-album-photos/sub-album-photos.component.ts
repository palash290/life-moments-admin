import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../shared/services/shared.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sub-album-photos',
  templateUrl: './sub-album-photos.component.html',
  styleUrl: './sub-album-photos.component.css'
})
export class SubAlbumPhotosComponent {

  photos: any;
  filteredPhotos: any[] = [];
  filterValue: string = '';
  loading: boolean = false;
  albumId: any;
  userId: any;

  constructor(private sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute, private service: SharedService, private location: Location, private toastr: ToastrService) { }

  backClicked() {
    this.location.back();
    // this.router.navigate([`/admin/main/sub-albums/${this.albumId}/${this.userId}`]);
    // localStorage.removeItem('albumId');
    // localStorage.removeItem('userId');
  }

  sanitizeUrl(url: any): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const albumItems = params['albumItems'];
      if (albumItems) {
        this.photos = JSON.parse(albumItems);
        console.log(this.photos);
      } else {
        console.error('No data found');
      }
    });

    this.filteredPhotos = [...this.photos];

    // this.albumId = localStorage.getItem('albumId');
    // this.userId = localStorage.getItem('userId');

    // const albumItems = this.service.getData();

    // if (albumItems) {
    //   console.log(albumItems); // Access the data
    //   //this.service.clearData(); // Optional: Clear after retrieval
    // } else {
    //   console.error('No data found');
    // }
    // this.photos = albumItems;

    //this.getUsers();
  }

  applyFilter() {
    if (this.filterValue) {
      this.filteredPhotos = this.photos.filter(
        (photo: { albumItemType: string; }) => photo.albumItemType === this.filterValue
      );
    } else {
      this.filteredPhotos = [...this.photos]; // Reset to all photos
    }
  }

  currentIndex = 0;

  prevImage() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.photos.length - 1; // Loop back to the last image
    } else {
      this.currentIndex--;
    }
  }

  nextImage() {
    if (this.currentIndex === this.photos.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
  }

  openModal(index: any) {
    this.currentIndex = index;
  }

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




  downloadImage() {
    const mediaUrl = this.photos[this.currentIndex].images_url; // Media URL
    const mediaTitle = this.photos[this.currentIndex].title; // File title
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


}

// albumId
// :
// 26437
// albumItemType
// :
// "Photo"
// creationDate
// :
// "19 / 11 / 2024"
// description
// :
// "laptop "
// id
// :
// 1350
// images_url
// :
// "http://18.229.202.71:4000/album/1732047647095.png"
// is_cover_image
// :
// 0
// mediaFileName
// :
// "1732047647095.png"
// title
// :
// "laptop "
// uploadDate
// :
// "2024-11-19T20:20:50.000Z"
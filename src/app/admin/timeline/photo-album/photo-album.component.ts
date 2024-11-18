import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-photo-album',
  templateUrl: './photo-album.component.html',
  styleUrl: './photo-album.component.css'
})
export class PhotoAlbumComponent {

  checkAll = false;
  currentIndex = 0;
  imageObject: any[] = [];
  selectedIds: number[] = [];
  date: any;
  day: any;
  month: any;
  year: any;
  filterValue: any = "Photos";

  constructor(private route: ActivatedRoute, private service: SharedService, private location: Location, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {

    document.addEventListener("fullscreenchange", () => {
      this.isFullScreen = !!document.fullscreenElement; // Update the state based on fullscreen status
      if (!this.isFullScreen) {
        // Additional logic can be added here if needed when exiting fullscreen
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.date = params.get('date');
    });

    if (this.date) {
      const [day, month, year] = this.date.split(' ');
      this.day = day;
      this.month = month;
      this.year = year;
    }

    //this.loadData();
    this.getPhotosAlbum('Photos');
  }

  onFilterChange(value: string): void {
    console.log('Selected filter value:', value);
    // Handle the value change logic here
    this.getPhotosAlbum(value);
  }

  picLength: any;

  getPhotosAlbum(filterVal: any) {
    const formURlData = new URLSearchParams();
    formURlData.set('date', this.date);
    this.service.postAPI(`sub-admin/get-timelinealbum?filter=${filterVal}`, formURlData).subscribe({
      next: resp => {
        this.imageObject = resp.data.map((item: any) => ({ ...item, checked: false }));
        this.picLength = this.imageObject.length;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  loadData() {
    this.imageObject = [
      {
        id: 1,
        images: 'assets/img/girl.png',
        thumbImage: 'assets/img/girl.png',
        title: 'Image 1 description'
      },
      {
        id: 2,
        images: 'http://18.229.202.71:4000/album/1718262071634.jpg',
        thumbImage: 'assets/img/men_user.png',
        title: 'Image 2 description'
      },
      {
        id: 3,
        images: 'assets/img/old_men.png',
        thumbImage: 'assets/img/old_men.png',
        title: 'Image 3 description'
      },
      {
        id: 4,
        images: 'assets/img/timeline_img.png',
        thumbImage: 'assets/img/timeline_img.png',
        title: 'Image 4 description'
      },
    ].map(item => ({ ...item, checked: false }));
  }

  toggleAllCheckboxes() {
    this.imageObject.forEach((item) => (item.checked = this.checkAll));
    this.updateSelectedIds();
  }

  updateSelectedIds() {
    this.selectedIds = this.imageObject
      .filter((item) => item.checked)
      .map((item) => item.id);
  }

  deleteImgsId: any = '';

  getSelectedIds() {
    const selectedIds = this.imageObject
      .filter((item) => item.checked)
      .map((item) => item.id)
      .join(',');
    this.deleteImgsId = selectedIds;
    console.log('Selected IDs:', selectedIds);
  }

  @ViewChild('closeModalDel') closeModalDel!: ElementRef;

  btnDelLoader: boolean = false;

  deleteImages() {
    if (!this.deleteImgsId) {
      this.toastr.error('Plese select image/video to delete!');
      return
    }
    this.btnDelLoader = true;
    const formURlData = new URLSearchParams();
    formURlData.set('ids', this.deleteImgsId);
    formURlData.set('date', this.date);
    this.service.postAPI(`sub-admin/delete-subadminid`, formURlData).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.closeModalDel.nativeElement.click();
          this.getPhotosAlbum('Photos');
          this.btnDelLoader = false;
          this.toastr.success(resp.message);
        } else {
          this.btnDelLoader = false;
          this.toastr.warning(resp.message);
          this.getPhotosAlbum('Photos');
        }
      }, error: error => {
        this.btnDelLoader = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }


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

  // downloadImage() {
  //   const imageUrl = this.imageObject[this.currentIndex].images;
  //   const imageTitle = this.imageObject[this.currentIndex].title;

  //   // Create an Image object and set crossOrigin
  //   const img = new Image();
  //   img.crossOrigin = 'anonymous'; // Enable cross-origin requests for this image
  //   img.src = imageUrl;

  //   img.onload = () => {
  //     // Create a canvas element
  //     const canvas = document.createElement('canvas');
  //     canvas.width = img.width;
  //     canvas.height = img.height;

  //     // Draw the image onto the canvas
  //     const ctx = canvas.getContext('2d');
  //     if (ctx) {
  //       ctx.drawImage(img, 0, 0);

  //       // Convert the canvas to a Blob
  //       canvas.toBlob((blob) => {
  //         if (blob) {
  //           // Create a download link
  //           const link = document.createElement('a');
  //           link.href = URL.createObjectURL(blob);
  //           link.download = `${imageTitle}.png`; // Set filename with title
  //           link.click();

  //           // Release memory by revoking the object URL
  //           URL.revokeObjectURL(link.href);
  //         }
  //       }, 'image/png');
  //     }
  //   };

  //   img.onerror = () => {
  //     console.error('Could not load image for download');
  //   };
  // }

  downloadImage() {
    const mediaUrl = this.imageObject[this.currentIndex].images; // Media URL
    const mediaTitle = this.imageObject[this.currentIndex].title; // File title
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

  backClicked() {
    this.location.back();
  }

  getMonth(year: any) {
    this.router.navigateByUrl(`/admin/main/timeline-month/${year}`);
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





  albumName: any;
  imagePreview: string | null = null;
  selectedAlbumImage: any;

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedAlbumImage = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitAlbum() {
    console.log('Album Name:', this.albumName);
    console.log('Selected File:', this.selectedAlbumImage);
    const formURlData = new FormData();
    if (this.selectedAlbumImage) {
      formURlData.append('image', this.selectedAlbumImage);
    }
    formURlData.set('Album Name:', this.albumName);

    this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
      next: (resp) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);

        } else {
          this.toastr.warning(resp.message);

        }
      },
      error: (error) => {

        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }


}
// "id": 176,
// "title": "sdjhbsjhd",
// "description": "andsbjadhjasd",
// "album_id": 248,
// "user_id": 444,
// "images": "http://18.229.202.71:4000/images/1718262071634.jpg",
// "created_at": "2024-06-13T01:31:16.000Z",
// "type": "Photo",
// "is_cover_image": 1,
// "Years": "2024",
// "Months": "June",
// "Dates": "13 June 2024",
// "iamges_name": "1718262071634.jpg"

// {
//   "id": 791,
//   "title": "video ",
//   "description": "video\n",
//   "album_id": 22967,
//   "user_id": 2682,
//   "images": "http://18.229.202.71:4000/album/1729924849041.MOV",
//   "created_at": "2024-10-26T01:15:50.000Z",
//   "type": "Video",
//   "is_cover_image": 0,
//   "Years": "2024",
//   "Months": "October",
//   "Dates": "26 October 2024"
// },
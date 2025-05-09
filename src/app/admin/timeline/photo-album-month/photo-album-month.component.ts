import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-photo-album-month',
  templateUrl: './photo-album-month.component.html',
  styleUrl: './photo-album-month.component.css'
})
export class PhotoAlbumMonthComponent {

  checkAll = false;
  currentIndex = 0;
  imageObject: any[] = [];
  selectedIds: number[] = [];
  date: any;
  userId: any;
  day: any;
  month: any;
  monthRoute: any;
  year: any;
  filterValue: any = "";
  isFullScreen: boolean = false;
  demoFile: any = 'assets/img/file_img.png';
  loading: boolean = false;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private service: SharedService, private location: Location, private router: Router, private toastr: ToastrService) { }

  backClicked() {
    this.location.back();
  }

  goBack(){
    this.router.navigateByUrl(`/admin/main/timeline/${this.userId}`);
  }

  sanitizeUrl(url: any): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {

    document.addEventListener("fullscreenchange", () => {
      this.isFullScreen = !!document.fullscreenElement; // Update the state based on fullscreen status
      if (!this.isFullScreen) {
        // Additional logic can be added here if needed when exiting fullscreen
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.date = params.get('year');
      this.userId = params.get('userId');
      this.monthRoute = params.get('month');
    });

    if (this.date) {
      const [day, month, year] = this.date.split(' ');
      this.day = day;
      this.month = month;
      this.year = year;
    }

    //this.loadData();
    this.getPhotosAlbum();
  }


  picLength: any;

  getPhotosAlbum() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('year', this.date);
    formURlData.set('type', this.filterValue);
    formURlData.set('user_id', this.userId);
    formURlData.set('month', this.monthRoute);
    this.service.postAPI(`sub-admin/getMonthlydata_photos`, formURlData.toString()).subscribe({
      next: resp => {
        if(resp.success){
          this.loading = false;
          this.imageObject = resp.monthly?.map((item: any) => ({ ...item, checked: false })).reverse();
          this.picLength = this.imageObject.length;
        } else{
          this.imageObject = []
          this.loading = false;
        }
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  onFilterChange(value: string): void {
    console.log('Selected filter value:', value);
    // Handle the value change logic here
    this.getPhotosAlbum();
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
          this.getPhotosAlbum();
          this.btnDelLoader = false;
          this.toastr.success(resp.message);
        } else {
          this.btnDelLoader = false;
          this.toastr.warning(resp.message);
          this.getPhotosAlbum();
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

  downloadImage() {
    const mediaUrl = this.imageObject[this.currentIndex].images_url; // Media URL
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

    ////add photos////

    albumName: string | null = null;
    imagePreviews: string[] = []; // To store previews of selected files
    //selectedFiles: File[] = []; // To store selected files
    selectedAlbumFiles: any;
    selectedFilePreview: string | null = null;
  
    triggerFileInput() {
      const fileInput = document.getElementById('ct_file_edit') as HTMLElement;
      fileInput.click();
    }
  
    readonly MAX_FILE_LIMIT = 20; // Set max limit of files
  
    onFileSelected(event: Event): void {
      const fileInput = event.target as HTMLInputElement;
  
      if (fileInput.files && fileInput.files.length > 0) {
        const files = Array.from(fileInput.files); // Convert FileList to an array
  
        // Check if the total number of files exceeds the limit
        if (files.length > 20) {
          this.toastr.warning('You can only select up to 20 files.');
          fileInput.value = ''; // Reset the file input to prevent further processing
          return;
        }
  
        // Store all selected files
        this.selectedAlbumFiles = files;
  
        // Clear previous previews
        this.imagePreviews = [];
  
        // Process files
        files.forEach(file => {
          const reader = new FileReader();
  
          if (file.type.startsWith('image/')) {
            // Preview image files
            reader.onload = () => {
              this.imagePreviews.push(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else if (file.type.startsWith('video/')) {
            // Preview video files (using URL.createObjectURL)
            this.imagePreviews.push(URL.createObjectURL(file));
          }
        });
      }
    }
  
  
    deletePreview(preview: string): void {
      // Remove the preview from the imagePreviews array
      this.imagePreviews = this.imagePreviews.filter(item => item !== preview);
  
      // Optional: You can also remove the corresponding file from selectedAlbumFiles if needed
      this.selectedAlbumFiles = this.selectedAlbumFiles.filter((file: Blob, index: any) => {
        const reader = new FileReader();
        let filePreview = '';
        reader.onloadend = () => {
          filePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
        return filePreview !== preview;
      });
      // If all files are removed, reset the previews
      if (this.imagePreviews.length === 0) {
        this.resetPreviews();
      }
    }
  
  
    submitImageAlbum(): void {
      // Check if album name is provided
      if (!this.albumName || this.albumName.trim().length === 0) {
        this.toastr.warning('Please provide a valid album name.');
        return;
      }
  
      // Check if there are files selected
      if (this.selectedAlbumFiles.length === 0) {
        this.toastr.warning('Please select at least one file to upload.');
        return;
      }
  
      // Prepare the FormData object
      const formURlData = new FormData();
      formURlData.append('albumName', this.albumName.trim());
  
      // Append all selected files to the FormData object
      this.selectedAlbumFiles.forEach((file: string | Blob, index: any) => {
        formURlData.append(`file_${index}`, file);
      });
  
      // Call the service to submit the album
      this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
        next: resp => {
          if (resp.success) {
            this.toastr.success(resp.message);
            this.resetPreviews(); // Reset the form on success
          } else {
            this.toastr.warning(resp.message);
          }
        },
        error: error => {
          const errorMessage = error.error?.message || 'Something went wrong!';
          this.toastr.error(errorMessage);
        }
      });
    }
  
    resetPreviews(): void {
      this.imagePreviews = [];
      this.selectedAlbumFiles = [];
    }
    ////end////


    pdfPreviews: { name: string; url: SafeResourceUrl }[] = [];
    selectedPdfFiles: File[] = [];
    albumNamePdf: string = '';
  
    onPdfSelected(event: Event): void {
      const fileInput = event.target as HTMLInputElement;
  
      if (fileInput.files && fileInput.files.length > 0) {
        const files = Array.from(fileInput.files); // Convert FileList to an array
        const newFiles = files.filter(file => file.type === 'application/pdf');
  
        if (this.pdfPreviews.length + newFiles.length > 5) {
          this.toastr.warning('You can only upload up to 5 PDFs.');
          return;
        }
  
        newFiles.forEach(file => {
          const url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
          this.selectedPdfFiles.push(file);
          this.pdfPreviews.push({ name: file.name, url });
        });
      }
    }
  
    deletePdfPreview(pdfName: string): void {
      const index = this.pdfPreviews.findIndex(preview => preview.name === pdfName);
      if (index > -1) {
        this.pdfPreviews.splice(index, 1);
        this.selectedPdfFiles.splice(index, 1);
      }
    }
  
    submitPdfAlbum(): void {
      if (!this.albumNamePdf) {
        this.toastr.warning('Please provide an album name.');
        return;
      }
  
      if (this.selectedPdfFiles.length === 0) {
        this.toastr.warning('Please add at least one PDF.');
        return;
      }
  
      const formURlData = new FormData();
      formURlData.append('albumName', this.albumNamePdf);
  
      this.selectedPdfFiles.forEach((file, index) => {
        formURlData.append(`file_${index}`, file);
      });
  
      // Replace with your API call
      // Call the service to submit the album
      this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
        next: resp => {
          if (resp.success) {
            this.toastr.success('Album created successfully!');
            this.resetForm();
          } else {
            this.toastr.warning(resp.message);
          }
        },
        error: error => {
          const errorMessage = error.error?.message || 'Something went wrong!';
          this.toastr.error(errorMessage);
        }
      });
  
  
    }
  
    resetForm(): void {
      this.albumNamePdf = '';
      this.pdfPreviews = [];
      this.selectedPdfFiles = [];
    }

    getMonthName(month: number): string {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[month - 1]; // Subtract 1 since array is 0-based
    }

}

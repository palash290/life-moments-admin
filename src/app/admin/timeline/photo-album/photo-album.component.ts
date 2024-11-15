import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Location } from '@angular/common';

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

  constructor(private route: ActivatedRoute, private service: SharedService, private location: Location, private router: Router) { }

  ngOnInit() {
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
    this.getSubAdmins();
  }

  picLength: any;

  getSubAdmins() {
    const formURlData = new URLSearchParams();
    formURlData.set('date', this.date);
    this.service.postAPI(`sub-admin/get-timelinealbum`, formURlData).subscribe({
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

  getSelectedIds() {
    const selectedIds = this.imageObject
      .filter((item) => item.checked)
      .map((item) => item.id);

    console.log('Selected IDs:', selectedIds);
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
    const imageUrl = this.imageObject[this.currentIndex].images;
    const imageTitle = this.imageObject[this.currentIndex].title;

    // Create an Image object and set crossOrigin
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable cross-origin requests for this image
    img.src = imageUrl;

    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        // Convert the canvas to a Blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${imageTitle}.png`; // Set filename with title
            link.click();

            // Release memory by revoking the object URL
            URL.revokeObjectURL(link.href);
          }
        }, 'image/png');
      }
    };

    img.onerror = () => {
      console.error('Could not load image for download');
    };
  }


  backClicked() {
    this.location.back();
  }

  getMonth(year: any) {
    this.router.navigateByUrl(`/admin/main/timeline-month/${year}`);
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
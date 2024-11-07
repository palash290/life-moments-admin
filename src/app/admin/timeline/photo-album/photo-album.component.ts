import { Component } from '@angular/core';


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

  ngOnInit() {
    this.loadData();
  }

  loadData() {

    this.imageObject = [
      {
        id: 1,
        image: 'assets/img/girl.png',
        thumbImage: 'assets/img/girl.png', // Add this to avoid errors
        alt: 'Image 1 description'
      },
      {
        id: 2,
        image: 'assets/img/men_user.png',
        thumbImage: 'assets/img/men_user.png',
        alt: 'Image 2 description'
      },
      {
        id: 3,
        image: 'assets/img/old_men.png',
        thumbImage: 'assets/img/old_men.png', // Add this to avoid errors
        alt: 'Image 3 description'
      },
      {
        id: 4,
        image: 'assets/img/timeline_img.png',
        thumbImage: 'assets/img/timeline_img.png',
        alt: 'Image 4 description'
      },

      // Add more images as needed
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


  // Method to navigate to the previous image
  prevImage() {
    // Check if we are at the start of the array
    if (this.currentIndex === 0) {
      this.currentIndex = this.imageObject.length - 1; // Loop back to the last image
    } else {
      this.currentIndex--; // Move to the previous image
    }
  }

  // Method to navigate to the next image
  nextImage() {
    // Check if we are at the end of the array
    if (this.currentIndex === this.imageObject.length - 1) {
      this.currentIndex = 0; // Loop back to the first image
    } else {
      this.currentIndex++; // Move to the next image
    }
  }

  openModal(index: any) {
    this.currentIndex = index;
  }

  // Function to handle download action via the button
  downloadImage() {
    const imageUrl = this.imageObject[this.currentIndex].image;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = this.imageObject[this.currentIndex].alt; // Set the filename as the image's alt text
    link.click();
  }


}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-sub-albums',
  templateUrl: './sub-albums.component.html',
  styleUrl: './sub-albums.component.css'
})
export class SubAlbumsComponent {

  data: any[] = [];
  checkAll = false;
  selectedIds: number[] = [];
  albumId!: any;

  constructor(private router: Router, private route: ActivatedRoute, private service: SharedService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.albumId = params.get('albumId');
    });

    this.loadData();
  }

  loadData() {
    this.data = [
      {
        id: 1,
        image: '',
        title: 'Image 1',
        alt: 'Image 1 description'
      },
      {
        id: 2,
        image: 'assets/img/men_user.png',
        title: 'Image 2',
        alt: 'Image 2 description'
      },
      {
        id: 3,
        image: '',
        title: 'Image 3',
        alt: 'Image 3 description'
      },
      {
        id: 4,
        image: 'assets/img/old_men.png',
        title: 'Image 4',
        alt: 'Image 4 description'
      },
    ].map(item => ({ ...item, checked: false }));
  }

  toggleAllCheckboxes() {
    this.data.forEach((item) => (item.checked = this.checkAll));
    this.updateSelectedIds();
  }

  updateSelectedIds() {
    this.selectedIds = this.data
      .filter((item) => item.checked)
      .map((item) => item.id);
  }

  getSelectedIds() {
    const selectedIds = this.data
      .filter((item) => item.checked)
      .map((item) => item.id);

    console.log('Selected IDs:', selectedIds);
  }

  getPhotos(userId: number) {
    this.router.navigateByUrl(`/admin/main/photo-album/${userId}`);
  }


}

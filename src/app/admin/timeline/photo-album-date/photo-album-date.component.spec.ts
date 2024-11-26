import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoAlbumDateComponent } from './photo-album-date.component';

describe('PhotoAlbumDateComponent', () => {
  let component: PhotoAlbumDateComponent;
  let fixture: ComponentFixture<PhotoAlbumDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoAlbumDateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhotoAlbumDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

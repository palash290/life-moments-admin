import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoAlbumMonthComponent } from './photo-album-month.component';

describe('PhotoAlbumMonthComponent', () => {
  let component: PhotoAlbumMonthComponent;
  let fixture: ComponentFixture<PhotoAlbumMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoAlbumMonthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhotoAlbumMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

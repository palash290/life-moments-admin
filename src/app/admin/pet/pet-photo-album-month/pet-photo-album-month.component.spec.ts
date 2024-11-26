import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetPhotoAlbumMonthComponent } from './pet-photo-album-month.component';

describe('PetPhotoAlbumMonthComponent', () => {
  let component: PetPhotoAlbumMonthComponent;
  let fixture: ComponentFixture<PetPhotoAlbumMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetPhotoAlbumMonthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetPhotoAlbumMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

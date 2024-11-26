import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetPhotoAlbumYearComponent } from './pet-photo-album-year.component';

describe('PetPhotoAlbumYearComponent', () => {
  let component: PetPhotoAlbumYearComponent;
  let fixture: ComponentFixture<PetPhotoAlbumYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetPhotoAlbumYearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetPhotoAlbumYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

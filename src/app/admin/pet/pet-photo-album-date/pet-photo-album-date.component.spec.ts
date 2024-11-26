import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetPhotoAlbumDateComponent } from './pet-photo-album-date.component';

describe('PetPhotoAlbumDateComponent', () => {
  let component: PetPhotoAlbumDateComponent;
  let fixture: ComponentFixture<PetPhotoAlbumDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetPhotoAlbumDateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetPhotoAlbumDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

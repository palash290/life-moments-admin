import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetSubAlbumPhotosComponent } from './pet-sub-album-photos.component';

describe('PetSubAlbumPhotosComponent', () => {
  let component: PetSubAlbumPhotosComponent;
  let fixture: ComponentFixture<PetSubAlbumPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetSubAlbumPhotosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetSubAlbumPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

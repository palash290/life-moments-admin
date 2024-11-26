import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetSubAlbumComponent } from './pet-sub-album.component';

describe('PetSubAlbumComponent', () => {
  let component: PetSubAlbumComponent;
  let fixture: ComponentFixture<PetSubAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetSubAlbumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetSubAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

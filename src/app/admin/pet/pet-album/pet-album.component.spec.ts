import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAlbumComponent } from './pet-album.component';

describe('PetAlbumComponent', () => {
  let component: PetAlbumComponent;
  let fixture: ComponentFixture<PetAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetAlbumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAlbumPhotosComponent } from './sub-album-photos.component';

describe('SubAlbumPhotosComponent', () => {
  let component: SubAlbumPhotosComponent;
  let fixture: ComponentFixture<SubAlbumPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubAlbumPhotosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubAlbumPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAlbumsComponent } from './sub-albums.component';

describe('SubAlbumsComponent', () => {
  let component: SubAlbumsComponent;
  let fixture: ComponentFixture<SubAlbumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubAlbumsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

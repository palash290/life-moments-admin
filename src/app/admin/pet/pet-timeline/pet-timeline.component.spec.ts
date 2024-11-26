import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetTimelineComponent } from './pet-timeline.component';

describe('PetTimelineComponent', () => {
  let component: PetTimelineComponent;
  let fixture: ComponentFixture<PetTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

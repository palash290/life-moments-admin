import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineDateComponent } from './timeline-date.component';

describe('TimelineDateComponent', () => {
  let component: TimelineDateComponent;
  let fixture: ComponentFixture<TimelineDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimelineDateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

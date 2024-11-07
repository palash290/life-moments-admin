import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineMonthComponent } from './timeline-month.component';

describe('TimelineMonthComponent', () => {
  let component: TimelineMonthComponent;
  let fixture: ComponentFixture<TimelineMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimelineMonthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

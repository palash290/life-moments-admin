import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingReviewComponent } from './rating-review.component';

describe('RatingReviewComponent', () => {
  let component: RatingReviewComponent;
  let fixture: ComponentFixture<RatingReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatingReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

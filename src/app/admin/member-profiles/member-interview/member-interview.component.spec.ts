import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInterviewComponent } from './member-interview.component';

describe('MemberInterviewComponent', () => {
  let component: MemberInterviewComponent;
  let fixture: ComponentFixture<MemberInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberInterviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

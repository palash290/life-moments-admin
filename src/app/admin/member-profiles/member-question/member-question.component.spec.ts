import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberQuestionComponent } from './member-question.component';

describe('MemberQuestionComponent', () => {
  let component: MemberQuestionComponent;
  let fixture: ComponentFixture<MemberQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

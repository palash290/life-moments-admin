import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberProfilesComponent } from './member-profiles.component';

describe('MemberProfilesComponent', () => {
  let component: MemberProfilesComponent;
  let fixture: ComponentFixture<MemberProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberProfilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplePrivilegesComponent } from './multiple-privileges.component';

describe('MultiplePrivilegesComponent', () => {
  let component: MultiplePrivilegesComponent;
  let fixture: ComponentFixture<MultiplePrivilegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiplePrivilegesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiplePrivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInSchoolComponent } from './student-in-school.component';

describe('StudentInSchoolComponent', () => {
  let component: StudentInSchoolComponent;
  let fixture: ComponentFixture<StudentInSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentInSchoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

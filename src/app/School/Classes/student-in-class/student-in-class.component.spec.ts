import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInClassComponent } from './student-in-class.component';

describe('StudentInClassComponent', () => {
  let component: StudentInClassComponent;
  let fixture: ComponentFixture<StudentInClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentInClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

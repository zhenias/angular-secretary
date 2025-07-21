import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentsMassiveToClassComponent } from './add-students-massive-to-class.component';

describe('AddStudentsMassiveToClassComponent', () => {
  let component: AddStudentsMassiveToClassComponent;
  let fixture: ComponentFixture<AddStudentsMassiveToClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStudentsMassiveToClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStudentsMassiveToClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

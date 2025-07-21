import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanForClassComponent } from './lesson-plan-for-class.component';

describe('LessonPlanForClassComponent', () => {
  let component: LessonPlanForClassComponent;
  let fixture: ComponentFixture<LessonPlanForClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonPlanForClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPlanForClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewParentsComponent } from './view-parents.component';

describe('ViewParentsComponent', () => {
  let component: ViewParentsComponent;
  let fixture: ComponentFixture<ViewParentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewParentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

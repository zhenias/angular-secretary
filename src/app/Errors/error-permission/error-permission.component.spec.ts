import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPermissionComponent } from './error-permission.component';

describe('ErrorPermissionComponent', () => {
  let component: ErrorPermissionComponent;
  let fixture: ComponentFixture<ErrorPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorPermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

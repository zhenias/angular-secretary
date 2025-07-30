import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleCardEditComponent } from './bicycle-card-edit.component';

describe('BicycleCardEditComponent', () => {
  let component: BicycleCardEditComponent;
  let fixture: ComponentFixture<BicycleCardEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BicycleCardEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BicycleCardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

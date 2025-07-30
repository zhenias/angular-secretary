import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleCardDeleteComponent } from './bicycle-card-delete.component';

describe('BicycleCardDeleteComponent', () => {
  let component: BicycleCardDeleteComponent;
  let fixture: ComponentFixture<BicycleCardDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BicycleCardDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BicycleCardDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

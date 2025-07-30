import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleCardCreateComponent } from './bicycle-card-create.component';

describe('BicycleCardCreateComponent', () => {
  let component: BicycleCardCreateComponent;
  let fixture: ComponentFixture<BicycleCardCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BicycleCardCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BicycleCardCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

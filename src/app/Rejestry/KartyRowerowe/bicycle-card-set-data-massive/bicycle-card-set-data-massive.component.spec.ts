import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleCardSetDataMassiveComponent } from './bicycle-card-set-data-massive.component';

describe('BicycleCardSetDataMassiveComponent', () => {
  let component: BicycleCardSetDataMassiveComponent;
  let fixture: ComponentFixture<BicycleCardSetDataMassiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BicycleCardSetDataMassiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BicycleCardSetDataMassiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

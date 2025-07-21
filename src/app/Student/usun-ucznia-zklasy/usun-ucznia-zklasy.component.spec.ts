import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsunUczniaZKlasyComponent } from './usun-ucznia-zklasy.component';

describe('UsunUczniaZKlasyComponent', () => {
  let component: UsunUczniaZKlasyComponent;
  let fixture: ComponentFixture<UsunUczniaZKlasyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsunUczniaZKlasyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsunUczniaZKlasyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

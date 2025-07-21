import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajUczniaDoKlasyComponent } from './dodaj-ucznia-do-klasy.component';

describe('DodajUczniaDoKlasyComponent', () => {
  let component: DodajUczniaDoKlasyComponent;
  let fixture: ComponentFixture<DodajUczniaDoKlasyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DodajUczniaDoKlasyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DodajUczniaDoKlasyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

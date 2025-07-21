import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkreslUczniaZKlasyComponent } from './skresl-ucznia-zklasy.component';

describe('SkreslUczniaZKlasyComponent', () => {
  let component: SkreslUczniaZKlasyComponent;
  let fixture: ComponentFixture<SkreslUczniaZKlasyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkreslUczniaZKlasyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkreslUczniaZKlasyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

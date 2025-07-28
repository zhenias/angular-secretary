import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejestrKartRowerowychComponent } from './rejestr-kart-rowerowych.component';

describe('RejestrKartRowerowychComponent', () => {
  let component: RejestrKartRowerowychComponent;
  let fixture: ComponentFixture<RejestrKartRowerowychComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejestrKartRowerowychComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejestrKartRowerowychComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

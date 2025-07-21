import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingHTMLComponent } from './loading-html.component';

describe('LoadingHTMLComponent', () => {
  let component: LoadingHTMLComponent;
  let fixture: ComponentFixture<LoadingHTMLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingHTMLComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingHTMLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

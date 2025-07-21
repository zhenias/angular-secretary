import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportUIComponent } from './export-ui.component';

describe('ExportUIComponent', () => {
  let component: ExportUIComponent;
  let fixture: ComponentFixture<ExportUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportUIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

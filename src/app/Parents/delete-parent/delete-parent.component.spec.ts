import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteParentComponent } from './delete-parent.component';

describe('DeleteParentComponent', () => {
  let component: DeleteParentComponent;
  let fixture: ComponentFixture<DeleteParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcaPopupComponent } from './rca-popup.component';

describe('RcaPopupComponent', () => {
  let component: RcaPopupComponent;
  let fixture: ComponentFixture<RcaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RcaPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RcaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PDVComponent } from './pdv.component';

describe('PDVComponent', () => {
  let component: PDVComponent;
  let fixture: ComponentFixture<PDVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PDVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PDVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

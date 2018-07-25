import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrejanjeZnackeComponent } from './urejanje-znacke.component';

describe('UrejanjeZnackeComponent', () => {
  let component: UrejanjeZnackeComponent;
  let fixture: ComponentFixture<UrejanjeZnackeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrejanjeZnackeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrejanjeZnackeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

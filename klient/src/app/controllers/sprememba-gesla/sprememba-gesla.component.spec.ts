import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpremembaGeslaComponent } from './sprememba-gesla.component';

describe('SpremembaGeslaComponent', () => {
  let component: SpremembaGeslaComponent;
  let fixture: ComponentFixture<SpremembaGeslaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpremembaGeslaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpremembaGeslaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

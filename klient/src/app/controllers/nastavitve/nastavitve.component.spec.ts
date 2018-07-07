import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NastavitveComponent } from './nastavitve.component';

describe('NastavitveComponent', () => {
  let component: NastavitveComponent;
  let fixture: ComponentFixture<NastavitveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NastavitveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NastavitveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

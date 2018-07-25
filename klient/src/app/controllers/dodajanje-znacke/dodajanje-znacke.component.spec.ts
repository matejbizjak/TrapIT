import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajanjeZnackeComponent } from './dodajanje-znacke.component';

describe('DodajanjeZnackeComponent', () => {
  let component: DodajanjeZnackeComponent;
  let fixture: ComponentFixture<DodajanjeZnackeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodajanjeZnackeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodajanjeZnackeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

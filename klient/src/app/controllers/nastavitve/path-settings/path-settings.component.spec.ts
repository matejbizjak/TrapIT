import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathSettingsComponent } from './path-settings.component';

describe('PathSettingsComponent', () => {
  let component: PathSettingsComponent;
  let fixture: ComponentFixture<PathSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

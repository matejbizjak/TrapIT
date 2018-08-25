import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageInfoEditorComponent } from './home-page-info-editor.component';

describe('HomePageInfoEditorComponent', () => {
  let component: HomePageInfoEditorComponent;
  let fixture: ComponentFixture<HomePageInfoEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageInfoEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageInfoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

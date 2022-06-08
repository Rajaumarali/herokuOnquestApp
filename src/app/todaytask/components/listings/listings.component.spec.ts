import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayListingComponent } from './listings.component';

describe('ListingsComponent', () => {
  let component: TodayListingComponent;
  let fixture: ComponentFixture<TodayListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

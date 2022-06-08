import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetGreetListingComponent } from './listing.component';

describe('ListingComponent', () => {
  let component: MeetGreetListingComponent;
  let fixture: ComponentFixture<MeetGreetListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetGreetListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetGreetListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

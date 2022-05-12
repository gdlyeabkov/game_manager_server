import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestAddComponent } from './friend-request-add.component';

describe('FriendRequestAddComponent', () => {
  let component: FriendRequestAddComponent;
  let fixture: ComponentFixture<FriendRequestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendRequestAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

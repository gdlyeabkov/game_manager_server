import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMailForUsersComponent } from './send-mail-for-users.component';

describe('SendMailForUsersComponent', () => {
  let component: SendMailForUsersComponent;
  let fixture: ComponentFixture<SendMailForUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendMailForUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMailForUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

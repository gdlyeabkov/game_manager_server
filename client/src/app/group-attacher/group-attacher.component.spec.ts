import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAttacherComponent } from './group-attacher.component';

describe('GroupAttacherComponent', () => {
  let component: GroupAttacherComponent;
  let fixture: ComponentFixture<GroupAttacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupAttacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAttacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameTagComponent } from './create-game-tag.component';

describe('CreateGameTagComponent', () => {
  let component: CreateGameTagComponent;
  let fixture: ComponentFixture<CreateGameTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGameTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGameTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePointsStoreItemComponent } from './create-points-store-item.component';

describe('CreatePointsStoreItemComponent', () => {
  let component: CreatePointsStoreItemComponent;
  let fixture: ComponentFixture<CreatePointsStoreItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePointsStoreItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePointsStoreItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

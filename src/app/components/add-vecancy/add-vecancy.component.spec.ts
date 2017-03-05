/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddVecancyComponent } from './add-vecancy.component';

describe('AddVecancyComponent', () => {
  let component: AddVecancyComponent;
  let fixture: ComponentFixture<AddVecancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVecancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVecancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

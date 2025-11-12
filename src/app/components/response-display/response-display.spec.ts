import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseDisplay } from './response-display';

describe('ResponseDisplay', () => {
  let component: ResponseDisplay;
  let fixture: ComponentFixture<ResponseDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

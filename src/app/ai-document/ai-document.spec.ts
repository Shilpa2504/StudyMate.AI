import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiDocument } from './ai-document';

describe('AiDocument', () => {
  let component: AiDocument;
  let fixture: ComponentFixture<AiDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiDocument],
    }).compileComponents();

    fixture = TestBed.createComponent(AiDocument);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

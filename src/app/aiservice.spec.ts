import { TestBed } from '@angular/core/testing';

import { Aiservice } from './aiservice';

describe('Aiservice', () => {
  let service: Aiservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Aiservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

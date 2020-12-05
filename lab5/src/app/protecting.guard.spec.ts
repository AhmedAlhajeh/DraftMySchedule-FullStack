import { TestBed } from '@angular/core/testing';

import { ProtectingGuard } from './protecting.guard';

describe('ProtectingGuard', () => {
  let guard: ProtectingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProtectingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

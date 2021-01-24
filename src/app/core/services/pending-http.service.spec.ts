import { TestBed } from '@angular/core/testing';

import { PendingHttpService } from './pending-http.service';

describe('PendingService', () => {
  let service: PendingHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SpaceNewsService } from './space-news.service';

describe('SpaceNewsService', () => {
  let service: SpaceNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

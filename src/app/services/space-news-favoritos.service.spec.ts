import { TestBed } from '@angular/core/testing';

import { SpaceNewsFavoritosService } from './space-news-favoritos.service';

describe('SpaceNewsFavoritosService', () => {
  let service: SpaceNewsFavoritosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceNewsFavoritosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

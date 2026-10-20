import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { JeuService } from './jeu.service';

describe('JeuService', () => {
  let service: JeuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(JeuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

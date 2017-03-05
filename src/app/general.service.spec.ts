/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GeneralService } from './general.service';

describe('GeneralService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralService]
    });
  });

  it('should ...', inject([GeneralService], (service: GeneralService) => {
    expect(service).toBeTruthy();
  }));
});

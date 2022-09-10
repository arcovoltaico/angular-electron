import {MediaService} from './media.service';
import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';

let mediaService: MediaService;
// let valueServiceSpy: jasmine.SpyObj<MediaService>;

describe('MediaService', function() {
  let originalTimeout;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

    // const spy = jasmine.createSpyObj('DependencyService', ['getValue']);
    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        MediaService,
        // { provide: MediaService, useValue: spy }
      ]
    });
    // Inject both the service-to-test and its (spy) dependency
    mediaService = TestBed.inject(MediaService);
    // valueServiceSpy = TestBed.inject(Service) as jasmine.SpyObj<ValueService>;

  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('#test Observable example ', (done) => {
    const expected = 1;
    const observable$ = of(1);
    observable$.subscribe((result: number)=>{
      expect(result).toEqual(expected);
      done();
    });
  });

  it('#parseVolume should return expected data', (done) => {
    const ffmpegData = '[Parsed_volumedetect_0 @ 0x564635d62800] mean_volume: -22.6 dB';
    const result = mediaService.parseVolume(ffmpegData, 'mean_volume:');
    expect(result).toEqual('-22.6');
    done();
  });

});

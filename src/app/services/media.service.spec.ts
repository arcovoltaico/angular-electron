import {MediaService} from './media.service';
import {TestBed} from '@angular/core/testing';

let mediaService: MediaService;


describe('MediaService', function () {
  let originalTimeout;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

    TestBed.configureTestingModule({
      providers: [
        MediaService
      ]
    });
    mediaService = TestBed.inject(MediaService);

  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });


  it('#parseVolume should return expected data', (done) => {
    const ffmpegData = '[Parsed_volumedetect_0 @ 0x564635d62800] mean_volume: -22.6 dB';
    const result = mediaService.parseVolume(ffmpegData, 'mean_volume:');
    expect(result).toEqual('-22.6');
    done();
  });

  it('#getAudioVolumesSync should return volumes from video file', (done) => {
    const filepath = 'bSpJxBXlkgU.mp4';
    const result = mediaService.getAudioVolumesSync(filepath);
    // expect(result).toEqual(1);
    done();
  });


});

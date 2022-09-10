import {ProvisionService} from './provision.service';
import {PassThrough} from 'stream';
import {WriteStream} from 'fs';
import {MediaService} from './media.service';


describe('ProvisionService', function() {
  let service: ProvisionService;
  beforeEach(() => {
    service = new ProvisionService(new MediaService());
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
  });

  it('#getStreamPromise should return a promise',
    (done: DoneFn) => {
      const id = 'https://www.youtube.com/watch?v=Wch3gJG2GJ4';
      service.getStreamPromise(id).then(value => {
        expect(value).toBeInstanceOf(PassThrough);
        done();
      });
    });

  it('#downloadVideo returns a WriteStream',
    (done: DoneFn) => {
      //   const id = "tvQsyxLR7tk"; // technopop
      const id = 'Wch3gJG2GJ4'; // 1 sec video
      service.downloadVideo(id).subscribe(value => {
        expect(value).toBeInstanceOf(WriteStream);
        done();
      });
    });

});

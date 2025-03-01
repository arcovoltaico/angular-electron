import {ProvisionService} from './provision.service';
import {PassThrough} from 'stream';
import {MediaService} from "./media.service";


describe('ProvisionService', function () {
  let service: ProvisionService;
  beforeEach(() => {
    service = new ProvisionService(new MediaService());
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
  });

  it('#basicDownload should return a promise on Kraftwerk Video',
    (done: DoneFn) => {
      const id = 'bSpJxBXlkgU';  //Kraftwerk
      service.basicDownload(id);
    });

  it('#getStream should return a promise on video 1sec',
    (done: DoneFn) => {
      const id = 'Wch3gJG2GJ4';  // 1 sec video
      service.getStream(id).subscribe(stream => {
        expect(stream).toBeInstanceOf(PassThrough);
        done();
      });
    });


  it('#getStreamWithInfo  (alternativate method) should return a promise on video 1sec',
    (done: DoneFn) => {
      const id = 'Wch3gJG2GJ4';  // 1 sec video
      service.getStreamWithInfo(id).subscribe(stream => {
        expect(stream).toBeInstanceOf(PassThrough);
        done();
      });
    });

  // TODO: test exhausted as the download never finish
  it('#getStream should return a promise on long video',
    (done: DoneFn) => {
      const id = 'tvQsyxLR7tk';  // Buggles: TechnoPop
      service.getStream(id).subscribe(stream => {
        expect(stream).toBeInstanceOf(PassThrough);
        done();
      });
    });

  // TODO: test exhausted as the download never finish
  it('#getStreamWithInfo should return a promise on long video',
    (done: DoneFn) => {
      const id = 'tvQsyxLR7tk';  // Buggles: TechnoPop
      service.getStreamWithInfo(id).subscribe(stream => {
        expect(stream).toBeInstanceOf(PassThrough);
        done();
      });
    });


});

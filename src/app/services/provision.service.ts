import {Injectable} from '@angular/core';
import {NextObserver, Observable} from 'rxjs';
import ytdl from 'ytdl-core';
import * as FS from 'fs';
import {Config} from '../shared/config';
import {MediaService} from './media.service';

const fs: typeof FS = window.require('fs');

@Injectable()
export class ProvisionService {

  constructor(private mediaService: MediaService) {
  }

  getStreamWithInfo(url: string): Observable<any> {
    console.log('getting stream observable');
    return new Observable((observer: NextObserver<any>) => {
      // const url = 'https://www.youtube.com/watch?v=' + location;
      ytdl.getInfo(url).then(
        info => {
          console.log(info.formats);
          const formats = ytdl.filterFormats(info.formats, 'audioandvideo');

          if (formats.length < 1) {
            console.log('no formats retrieved');
            observer.error('Video formats not available');
            return;
          } else {
            // this.stopRetry = true;
          }
          console.log(formats);
          const downloadOptions = {
            quality: 'highest',
            format: formats[0]
          };

          const stream = ytdl.downloadFromInfo(info, downloadOptions);
          observer.next(stream); //Here you pass the stream directly
        }
        ,
        error => {
          console.error(error);
          alert('Video info not available:');
          console.log('stream has ERRORED', error.toString());
          observer.error(error);
          throw new Error('Video info not available');
        }
      );
    });
  }

  writeStreamToFile(filename, stream): Observable<any> {
    console.log('Copying stream into file');
    const filepath = Config.homePath ? Config.homePath + '/' + filename : filename;
    const file = fs.createWriteStream(filepath);
    stream.pipe(file);
    return new Observable((obs: NextObserver<any>) => {
      file.on('error', (e) => {
        console.log('file has not been downloaded ', e.toString());
        file.close();
        obs.error(e);
      });

      file.on('finish', () => {
        file.close();
        console.log('file has  been downloaded ');
        obs.next(file);
        obs.complete();
      });
    });
  }

}


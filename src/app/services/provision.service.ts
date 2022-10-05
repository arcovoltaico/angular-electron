import {Injectable} from '@angular/core';
import {NextObserver, Observable} from 'rxjs';
import ytdl from 'ytdl-core';
import * as FS from 'fs';
import {Config} from '../shared/config';

const fs: typeof FS = window.require('fs');

@Injectable()
export class ProvisionService {
  path: string;

  setPath(path: string) {
    this.path = path;
  }

  getStreamObservable(url: string): Observable<any> {
    console.log('getting stream observable');

    const stream = ytdl(url);

    return new Observable((obs: NextObserver<any>) => {
      stream.on('error', (e) => {
        console.log('stream has ERRORED', e.toString());
        obs.error(e);
      });

      stream.on('end', () => {
        console.log('stream has ENDED');
        obs.next(stream);
        obs.complete();
      });

      stream.on('finish', () => {
        console.log('stream has FINISHED');
        obs.next(stream);
        obs.complete();
      });
    });
  }

  writeStreamToFile(filename, stream): Observable<any> {
    console.log('Copying stream into file');
    const file = fs.createWriteStream(Config.homePath + '/' + filename);
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

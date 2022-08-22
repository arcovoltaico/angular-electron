import {Injectable} from '@angular/core';
import {NextObserver, Observable} from 'rxjs';
import * as FS from 'fs';
import ytdl from 'ytdl-core';


@Injectable()
export class ProvisionService {

  constructor() {
  }

  getYouTubeVideo(id: string): Observable<FS.WriteStream> {
    const stream = ytdl(id, {
      quality: 'lowest',
    });

    stream.on('error', err => {
      console.error(err);
    });

    return new Observable((observer: NextObserver<any>) => {
      const that = this;

      stream.on('error', (e) => {
        console.log('file has not been downloaded ' + e.toString());
        // stream.destroy();
        observer.error('file for DB not downloaded');
      });

      stream.on('finish', (data) => {
        console.log(data);
        observer.next(data);
      });
    });
  }

}

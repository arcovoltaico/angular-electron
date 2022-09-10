import {Injectable} from '@angular/core';
import {from, NextObserver, Observable, of} from 'rxjs';
import ytdl from 'ytdl-core';
import * as FS from 'fs';
import {PassThrough} from 'stream';
import {MediaService} from './media.service';

const fs: typeof FS = window.require('fs');

@Injectable()
export class ProvisionService {

  constructor(private mediaService: MediaService) {
  }

  // writeStreamToFile(stream): Observable<any> {
  //   // we copy the remote file o temp if it does not exist
  //   const file = fs.createWriteStream('video.mp4');
  //   return new Observable((obs: NextObserver<any>) => {
  //     file.on('error', (e) => {
  //       console.log('file has not been downloaded ' + e.toString());
  //       file.close();
  //       obs.error(e);
  //     });
  //
  //
  //     file.on('finish', () => {
  //       file.close();
  //       console.log('file has  been downloaded ');
  //       //  TODO: analyse volumes from the stream using the media service
  //       //  return volumes and assert them from the test
  //       // when successful, move tests and methods to Player 3
  //       obs.next(file);
  //       obs.complete();
  //     });
  //   });
  // }



  downloadVideo(id: string): Observable<any> {
    // we copy the remote file o temp if it does not exist
    const file = fs.createWriteStream('video.mp4');

    const volumesObserver = {
      next: (data) => {console.log(data)}};

    const observer = {
      next: (stream) => {
        stream.pipe(file);
      },
      error: (error: Error) => {
        console.error(error.message);
      },
      complete: () => console.log('Observer got a complete notification'),
    };

    const observable$ = from(this.getStreamPromise(id));
    observable$.subscribe(observer);


    return new Observable((obs: NextObserver<any>) => {
      file.on('error', (e) => {
        console.log('file has not been downloaded ' + e.toString());
        file.close();
        obs.error(e);
      });


      file.on('finish', () => {
        file.close();
        console.log('file has  been downloaded ');
        //  TODO: analyse volumes from the stream using the media service
        //  return volumes and assert them from the test
        // when successful, move tests and methods to Player 3
        obs.next(file);
        obs.complete();
      });
    });


  }



  getStreamPromise = async (url): Promise<any> => {
    console.log(`Downloading from ${url} ...`);

    let allReceived = false;
    return new Promise((resolve, reject) => {
      const stream = ytdl(url, {
        quality: 'highest',
        filter: (format) => format.container === 'mp4',
      })
        .on('progress', (_, totalDownloaded, total) => {
          console.log('totalDownloaded: ' + totalDownloaded);
          if (!allReceived) {
            console.log('total: ' + total);
            allReceived = true;
          }
        })
        .on('finish', () => {
          console.log('Successfully downloaded the stream!');
          resolve(stream);
        });

      this.mediaService.getAudioVolumes(stream).subscribe({
        next(volumes) {
          console.log('VOLUMES: ', volumes);
        },
        error(msg) {
          console.log('Error: ', msg);
        }
      });

    });
  };
}

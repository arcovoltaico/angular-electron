import {Injectable} from '@angular/core';
import {NextObserver, Observable} from 'rxjs';
import ffmpeg from 'fluent-ffmpeg-corrected';
import * as ffmpegBin from 'ffmpeg-static-electron';
import FS from "fs";

export interface IVolumes {
  meanVolume: string;
  maxVolume: string;
}


@Injectable()
export class MediaService {
  getAudioVolumes(stream: FS.WriteStream): Observable<IVolumes> {

    const ffmpegPath = ffmpegBin.path.replace('app.asar', 'app.asar.unpacked').replace('dist', 'node_modules/ffmpeg-static-electron');
    ffmpeg.setFfmpegPath(ffmpegPath);

    return new Observable((observer: NextObserver<IVolumes>) => {
      const that = this;

      ffmpeg(stream)
        .withAudioFilter('volumedetect')
        .addOption('-f', 'null')
        .audioBitrate(128)

        .on('progress', function (progress) {
          console.log(progress);
          console.log('Normalising Processing: ' + progress.percent + '% done');
        })

        .on('error', function (err) {
          // IT WILL ERROR UNLESS ELECTRON IS COMPILED ! so impossible to test?
          console.log('An error occurred while analysing: ' + err.message);
          observer.error('DBs are not accessible');
        })

        .on('end', (stdout: any, stderr: string) => {
          const max = that.parseVolume(stderr, 'max_volume:');
          const mean = that.parseVolume(stderr, 'mean_volume:');
          console.log('volume analysis done');
          observer.next({meanVolume: mean, maxVolume: max});
          observer.complete();
        })
        // .output('output.mp4')
        // .run();
        .save();
    });
  }


  // it gets the value of mean or max volume,
  // by getting the fragment after mean_volume: and before the first dB appearance
  parseVolume(msg: string, type: string): string {
    const n = msg.indexOf(type);
    if (n < 0) {
      return null;
    }
    const volTxt = msg.substring(n + type.length + 1);
    const n2 = volTxt.indexOf(' dB');

    return volTxt.slice(0, n2);
  }

}

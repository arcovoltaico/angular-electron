import {Injectable} from '@angular/core';
import {NextObserver, Observable} from 'rxjs';
import ffmpeg from 'fluent-ffmpeg-corrected';
import * as ffmpegBin from 'ffmpeg-static-electron';
import FS from 'fs';
import {Readable} from 'stream';
import {Config} from "../shared/config";

export interface IVolumes {
  meanVolume: string;
  maxVolume: string;
}


@Injectable()
export class MediaService {
  binPath = 'node_modules/ffmpeg-static-electron/bin';
  ffmpegPath = ffmpegBin.path
    .replace('app.asar/bin', 'app.asar.unpacked/' + this.binPath)
    .replace('node_modules/electron/dist/Electron.app/Contents/Resources/electron.asar/renderer/bin', this.binPath)
    .replace('browser/javascript', 'mac/x64') // TODO: platform hardcoded!
  ;
  // 1st replacement for the build version, with asar: true on electron-builder.json
  // amd the 2 ffmpeg dependencies  on the app/package.json
  // it detects the platform on build time (not sure if in M1 arm64 yet)

  // the other 2 replacements for the unit test and the  npm start executed

  getAudioVolumes(stream: FS.WriteStream): Observable<IVolumes> {
    console.log('analysing STREAM');
    console.log(this.ffmpegPath);
    ffmpeg.setFfmpegPath(this.ffmpegPath);

    return new Observable((observer: NextObserver<IVolumes>) => {
      const that = this;
      ffmpeg(stream.path)
        .withAudioFilter('volumedetect')
        .addOption('-f', 'null')
        .audioBitrate(128)

        .on('progress', function(progress) {
          console.log(progress);
          console.log('Normalising Processing: ' + progress.percent + '% done');
        })

        .on('error', function(err) {
          console.log('An error occurred while analysing: ' + err.message);
          observer.error('DBs are not accessible');
        })

        .on('end', (stdout: any, stderr: string) => {
          const max = that.parseVolume(stderr, 'max_volume:');
          const mean = that.parseVolume(stderr, 'mean_volume:');
          console.log('volume analysis done, MeanDB is ', mean);
          observer.next({meanVolume: mean, maxVolume: max});
          observer.complete();
        })
        .save('/dev/null');
    });
  }


  getAudioVolumesSync(stream: Readable | FS.WriteStream | FS.ReadStream | string) {
    console.log('analysing STREAM');
    ffmpeg.setFfmpegPath(this.ffmpegPath);

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
        console.error('An error occurred while analysing: ' + err.message);
        new Error('DBs are not accessible');
      })

      .on('end', (stdout: any, stderr: string) => {
        const max = that.parseVolume(stderr, 'max_volume:');
        const mean = that.parseVolume(stderr, 'mean_volume:');
        console.log('volume analysis done, MeanDB is ', mean);
        return ({meanVolume: mean, maxVolume: max});
      })
      .save('/dev/null');

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

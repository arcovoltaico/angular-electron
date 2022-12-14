## REQUISITES:
1. Run this from the root of your electron project AND from its app/ folder  
`npm i ffmpeg-static-electron`    
`npm i fluent-ffmpeg-corrected`     
   ####
   The dependencies installed on the /app folder are the onesthat will be available unpacked inside your app build. 
In this case, you will have the ffmepg binaries
inside `Resources/app.asar.unpacked/node_modules/ffmpeg-static-electron`   
2. ### Activate Asar the Builder 
   On the first level of `electron-builder.json` we need to be sure asar 
   is not false (true is the default) `"asar": true`
3. ### Tweak yoru dependencies
   We need to hack the following node modules package.json by adding :
- **fluent-ffmpeg-corrected**
  `"browser": { "fs": false, "child_process": false }`,
- **isexe**:  
  `"browser": { "fs": false}`

### IMPLEMENTING NORMALISATION

The component method

    downloadYoutube(id: string){
      const filename = id+'.mp4';
      const filepath = Config.homePath? Config.homePath + '/' + filename : filename;
      const stream =  ytdl(id).pipe(fs.createWriteStream(filepath));
          stream.on('finish', (data) => {
            console.log(stream);
            this.mediaService.getAudioVolumes(stream).subscribe((d) => {console.log('done', d);});
          });
    }


The service
    
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
      ffmpegPath = ffmpegBin.path
      .replace('app.asar/bin', 'app.asar.unpacked/' + this.binPath)
      .replace('node_modules/electron/dist/Electron.app/Contents/Resources/electron.asar/renderer/bin', this.binPath)
      .replace('browser/javascript', 'mac/x64') // TODO: platform hardcoded!
      ;

    getAudioVolumes(stream: Readable | FS.WriteStream): Observable<IVolumes> {
      if (!Config.isElectron){
      this.ffmpegPath= 'node_modules/ffmpeg-static-electron/bin/mac/x64/ffmpeg';
      }
      ffmpeg.setFfmpegPath(this.ffmpegPath);
      
          return new Observable((observer: NextObserver<IVolumes>) => {
            const that = this;
            ffmpeg(stream)
              .withAudioFilter('volumedetect')
              .addOption('-f', 'null')
              .audioBitrate(128)
      
              .on('progress', function(progress) {
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



### TO-DO :

CRITICAL :
https://stackoverflow.com/questions/74798085/ffmpeg-is-not-working-on-my-electron-angular-app

Build the app by `npm run electron:build`
Run it, and click the Download Kraftwerk Button

` An error occurred while analysing: Output format null is not available`


OTHER

1. Make a unit test using a local mp4
2. Not getting the error when running `npm start`. Is it impossible to run ffmpeg  that way?

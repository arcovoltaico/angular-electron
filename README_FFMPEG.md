## REQUISITES:
https://stackoverflow.com/questions/74798085/ffmpeg-is-not-working-on-my-electron-angular-app

1. Run this from the root of your electron project AND from its app/ folder  
`npm i ffmpeg-static-electron`    
`npm i fluent-ffmpeg-corrected`  
`npm install buffer -D`   
`npm install webpack -D`

    The dependencies installed on the /app folder are the onesthat will be available unpacked inside your app build. 
        In this case, you will have the ffmepg binaries
        inside `Resources/app.asar.unpacked/node_modules/ffmpeg-static-electron`   
3. ### Activate Asar the Builder 
   On the first level of `electron-builder.json` we need to be sure asar 
   is not false (true is the default) `"asar": true`
4. ### Tweak your dependencies
   We need to hack the following node modules package.json by adding :
- **fluent-ffmpeg-corrected**
  `"browser": { "fs": false, "child_process": false }`,
- **isexe**:  
  `"browser": { "fs": false}`

4. ### Update angular.webpack.js
   We need to add the following :
   ```
   const webpack = require("webpack");
   
   config.plugins = [
   ...config.plugins,
   new webpack.ProvidePlugin({
   Buffer: ['buffer', 'Buffer'],
   }),
   new NodePolyfillPlugin({
   excludeAliases: ["console"]
   })
   ];

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

    getAudioVolumes(stream: FS.WriteStream): Observable<IVolumes> {
      if (!Config.isElectron){
      this.ffmpegPath= 'node_modules/ffmpeg-static-electron/bin/mac/x64/ffmpeg';
      }
      ffmpeg.setFfmpegPath(this.ffmpegPath);
      
          return new Observable((observer: NextObserver<IVolumes>) => {
            const that = this;
            ffmpeg(stream.path)
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
Is it possible to make a unit test with a local mp4?
Is it possible to use ffmpeg from npm start?

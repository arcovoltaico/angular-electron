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
      .replace('node_modules/electron/dist/Electron.app/Contents/Resources/electron.asar/renderer/bin', 'bin')
      .replace('app.asar', 'app.asar.unpacked') // for the build version, with asar: true on electron-builder.json
      .replace('bin', 'node_modules/ffmpeg-static-electron/bin');
    
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
1. check that the binary is accesible when running as browser by `npm start`  

2. How to unit test it with a local file?    `Cannot read properties of undefined (reading 'isStream')`

3. ON Build Testing downloading the first button  Why I have the **dev/null** error?

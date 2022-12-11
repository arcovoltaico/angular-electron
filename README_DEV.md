### PRE-REQUISITES:
Read READNE_FFMPEG

### RUN THE APP
If you run `npm start` and then try to download any of the videos (by clicking a red button)
only the 1 SEC will be downloaded, while the others fail.

### BUILD THE APP
`npm run electron:build`

# TO-DO:  

1.FIX Provision Service (YT-DL)

 The test using long videos do not work. 
 Exposed on [StackOverFlow]("https://stackoverflow.com/questions/74753891/why-ytdl-does-not-work-inside-an-observable")
and on [GitHub](https://github.com/fent/node-ytdl-core/issues/1170)
- Why the code is only downloading the 1second YouTube video, not any other YT ?     
         If we run the test `getStream should return a promise on long video` and add breakpoints we see that the **stream.on('progress')**
is reached but at some point it goes into **stream.on('error')**

Probably  the timeout is related with the observable implementation

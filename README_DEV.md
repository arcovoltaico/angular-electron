### PRE-REQUISITES:
- check out on the branch the yt-dl (you already did)
- ####Hack the following node modules package.json by adding :
- **fluent-ffmpeg-corrected**
  `"browser": { "fs": false, "child_process": false }`,


- **isexe**:  
  `"browser": { "fs": false}`

### RUN THE APP
If you run `npm start` and then try to download any of the videos (by clicking a red button)
only the 1 SEC will be downloaded, while the others fail.

### BUILD THE APP
`npm run electron:build`

# TO-DO:  

1.Provision Service (YT-DL)

 The test using long videos do not work.

- Why the code is only downloading the 1second YouTube video, not any other YT ?     
         If we run the test `getStream should return a promise on long video` and add breakpoints we see that the **stream.on('progress')**
is reached but at some point it goes into **stream.on('error')**

2.Media Service (FLUENT-FFMPEG)
- Why the normalisation is not returning the dBs?
I need to know how to test the getAudioVolumes with a real Stream/File?

### basicDownload WORKS
so maybe the timeout is related with the observable implementation

###CHECK IF FROM HOME IS TRYING TO NORMALISE

###MAYBE THE 1 SEC VIDEO HAS NO AUDIO

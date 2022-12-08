IMPORTANT: the branch is the yt-dl

###FIX DEPENDENCIES
We need to edit the package.json from:
- **fluent-ffmpeg-corrected**
  `"browser": { "fs": false, "child_process": false }`,


- **isexe**:  
  `"browser": { "fs": false}`

# TO-DO:

- Why the code is only downloading the 1second Youtube video, not any other YT ?
- Why the normalisation is not returning the dBs?

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MediaService} from '../services/media.service';
import {ProvisionService} from '../services/provision.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MediaService, ProvisionService]
})
export class HomeComponent implements OnInit {
  mainVolume;

  constructor(private router: Router, private mediaService: MediaService, private provisionService: ProvisionService) {
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
  }

  downloadYoutubeVideo(youTubeId: string) {
    this.mainVolume = null;
    // const observable$ = this.provisionService.getStream(youTubeId);
    const observable$ = this.provisionService.getStreamWithInfo(youTubeId);
    const observer = {
      next: (stream) => {
        this.provisionService.writeStreamToFile(youTubeId + '.mp4', stream)
          .subscribe((file) => {
            console.log('File copied', file);
            this.mediaService.getAudioVolumes(file)
              .subscribe(
                (data) => {
                  console.log(data);
                  this.mainVolume = data.meanVolume;
                });
          });


      },
      error: (error: Error) => {
        console.error(error.message);
      },
      complete: () => {
        console.log('Get Stream is completed');
      },
    };

    observable$.subscribe(observer);
  }

}

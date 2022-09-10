import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MediaService} from '../services/media.service';
import {ProvisionService} from '../services/provision.service';
import {WriteStream} from "fs";
import {Readable} from "stream";

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

  downloadYoutubeVideo(youTubeId: string = 'tvQsyxLR7tk') {
    this.provisionService.downloadVideo(youTubeId)
      .subscribe(
        (stream) => {
          console.log(stream);
          console.log('VIDEO DATA is here');
          // TODO:  TO UPDATE WHEN TESTS ARE OK
          // this.analiseDbs(stream);
        });
  }

  analiseDbs(stream) {
    this.mediaService.getAudioVolumes(stream)
      .subscribe(
        (data) => {
          this.mainVolume = data.meanVolume;
        });
  }

}

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MediaService} from "../services/media.service";
import {ProvisionService} from "../services/provision.service";
import {WriteStream} from "fs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mainVolume;

  constructor(private router: Router, private mediaService: MediaService, private provisionService: ProvisionService) {
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.getYoutubeDbs('tvQsyxLR7tk')
  }

  getYoutubeDbs(YouTubeId: string) {

    this.provisionService.getYouTubeVideo(YouTubeId)
      .subscribe(
        (stream) => {
          console.log('VIDEO DATA is here');
          this.analiseDbs(stream);
        });
  }

  analiseDbs(stream: WriteStream) {
    this.mediaService.getAudioVolumes(stream)
      .subscribe(
        (data) => {
          this.mainVolume = data['mean_volume'];
        });
  }

}

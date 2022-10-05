import {Component, OnInit} from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import {Config} from './shared/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  ipcRenderer = window.require('electron').ipcRenderer;
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }


  ngOnInit(): void {
    this.ipcRenderer.on('showMainWindow', (event, paths) => {
      console.log('paths', paths);
      Config.homePath = paths.homePath;
      Config.tempPath = paths.tempPath;
    });
  }
}

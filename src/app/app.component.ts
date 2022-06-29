import { Component } from '@angular/core';

import * as PubNub from 'pubnub';
import { v4 as uuidv4 } from 'uuid';
import { Article } from './models/articles';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'realtime-data-stream-assessment';
  pubnub: PubNub;
  articles: Article[] = [];

  constructor() {
    this.pubnub = new PubNub({
      publishKey: 'empty',
      ssl: true,
      subscribeKey: 'sub-c-c00db4fc-a1e7-11e6-8bfd-0619f8945a4f',
      uuid: uuidv4(),
    });

    this.pubnub.subscribe({
      channels: ['hacker-news']
    });

    this.pubnub.addListener({
      status: (status) => { console.log('status', status); },
      message: (message) => {
        console.log('message', message);
        this.articles = [ ...message.message];
      },
    });
  };
}

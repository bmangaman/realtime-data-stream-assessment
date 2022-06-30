import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';

import * as PubNub from 'pubnub';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Article } from './models/articles';
import { addArticles } from './state/app.actions';
import { AppState } from './state/app.reducer';
import { selectApp } from './state/app.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'realtime-data-stream-assessment';
  pubnub: PubNub;

  articles: BehaviorSubject<{ articles: Article[], timestamp: Date, uuid: string }[]> = new BehaviorSubject<{articles: Article[], timestamp: Date, uuid: string }[]>([]);
  currentArticles: BehaviorSubject<Article[]> = new BehaviorSubject<Article[]>([]);
  currentTimestamp: BehaviorSubject<Date | undefined> = new BehaviorSubject<Date | undefined>(undefined);
  timestamps: BehaviorSubject<{ uuid: string, timestamp: Date}[]> = new BehaviorSubject<{ uuid: string, timestamp: Date}[]>([]);

  filteredArticles: Article[] = [];
  fitlerForm: FormGroup;
  firstLoad: boolean = true;

  /**
   * Uses the value in the filter results input to filter the list of articles.
   * If no value, return the whole list of articles.
   */
  filterArticles = () => {
    const searchValue = this.fitlerForm.get('search')?.value.toLowerCase();

    if (searchValue) {
      this.filteredArticles = this.currentArticles.value
        .filter((article: Article) => article.title.toLowerCase().includes(searchValue) || article.rank.toString() === searchValue);
    } else {
      this.filteredArticles = this.currentArticles.value;
    }
  }

  /**
   * Uses the (uuid) value in the timestamp selector to choose which list of articles to display.
   * If "Most Recent" (null), display the latest set of articles.
   */
  selectArticles = () => {
    const selectValue = this.fitlerForm.get('timestamp')?.value;

    let selectedArticles;

    if (selectValue) {
      selectedArticles = this.articles.value.find((articles) => articles.uuid === selectValue);
    } else {
      selectedArticles = this.articles.value[this.articles.value.length - 1];
    }

    this.currentArticles.next(selectedArticles?.articles || []);
    this.currentTimestamp.next(selectedArticles?.timestamp);
  };

  /**
   * On component load:
   *  - create the fitler form
   *  - set up the connection with PubNub to grab the live data
   */
  constructor(private store: Store<AppState>) {
    this.store.pipe(select(selectApp)).subscribe((articles) => this.articles.next(articles));

    this.fitlerForm = new FormGroup({
      search: new FormControl(''),
      timestamp: new FormControl(null),
    });

    // If the search input or current articles are updated, re-filter the articles
    this.fitlerForm.get('search')?.valueChanges.subscribe(() => this.filterArticles());
    this.currentArticles.subscribe(() => this.filterArticles());

    /**
     * If the timestamp or list of all articles are updated:
     *  - update to use the correct set of articles (based on the uuid/timstamp)
     *  - update the list of selectable timestamps
     */ 
    this.fitlerForm.get('timestamp')?.valueChanges.subscribe(() => this.selectArticles());
    this.articles.subscribe((articles: { articles: Article[], timestamp: Date, uuid: string }[]) => {
      const newTimestamps = [ ...articles ].map((article) => ({ uuid: article.uuid, timestamp: article.timestamp }));
      this.timestamps.next(newTimestamps);
      this.selectArticles();
    });

    this.pubnub = new PubNub({
      publishKey: 'empty',
      ssl: true,
      subscribeKey: 'sub-c-c00db4fc-a1e7-11e6-8bfd-0619f8945a4f',
      uuid: uuidv4(),
    });

    this.pubnub.subscribe({
      channels: ['hacker-news']
    });

    // When new data is grabbed from PubNub, update the list of articles, the lastUpdated timestamp, and the firstLoad flag.
    this.pubnub.addListener({
      message: (message) => {
        this.store.dispatch(addArticles({ articles: message.message, timestamp: new Date() }))
        this.firstLoad = false;
      },
    });
  };
}

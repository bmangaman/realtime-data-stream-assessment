import { Component, Input } from '@angular/core';

import { Article } from '../models/articles';

@Component({
  selector: 'articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {
  @Input() articles: Article[] = [];
}

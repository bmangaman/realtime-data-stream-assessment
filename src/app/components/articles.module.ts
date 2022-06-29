import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ArticlesComponent } from './articles.component';

@NgModule({
  declarations: [
    ArticlesComponent
  ],
  exports: [
    ArticlesComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
})
export class ArticlesModule { }

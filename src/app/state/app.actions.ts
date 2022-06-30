import { createAction } from '@ngrx/store';
import { Article } from '../models/articles';

export const addArticles = createAction(
  '[Articles] Add Articles',
  (articles: { articles: Article[], timestamp: Date} ) => ({articles})
);

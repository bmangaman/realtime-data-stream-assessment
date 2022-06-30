import { Action, createReducer, on } from '@ngrx/store';

import { v4 as uuidV4 } from 'uuid';

import * as AppActions from './app.actions';
import { Article } from '../models/articles';

export const appFeatureKey = 'app';

export interface AppState {
  articles: Array<{ uuid: string; articles: Article[]; timestamp: Date; }>;
}

export const initialState: AppState = {
  articles: [],
};

export const appReducer = createReducer(
  initialState,
  on(AppActions.addArticles,
    (state: AppState, {articles}) =>
      ({
        ...state,
        articles: [...state.articles, { uuid: uuidV4(), ...articles } ]
      })
    )
);

export function reducer(state: AppState | undefined, action: Action): any {
  return appReducer(state, action);
}

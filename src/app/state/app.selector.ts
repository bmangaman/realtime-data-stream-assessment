import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromApp from './app.reducer';

export const selectAppState = createFeatureSelector<fromApp.AppState>(
  fromApp.appFeatureKey,
);

export const selectApp = createSelector(
  selectAppState,
  (state: fromApp.AppState) => state.articles,
);

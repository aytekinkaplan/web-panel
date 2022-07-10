import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, AUTH_FEATURE_KEY } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(
  AUTH_FEATURE_KEY,
);


export const isLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state?.loggedIn || [],
);


export const token = createSelector(
  selectAuthState,
  (state: AuthState) => state?.token || [],
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';

import settingsReducer from './settings/settings.reducer';
import settingsReducerV2 from './settings/settingsSlice';
import sourcesReducerV2 from './sources/sourcesSlice';
import sourceReducer from './source/source.reducers';
import novelReducer from './novel/novel.reducer';
import novelReducerV2 from './novel/novelSlice';
import updatesReducer from './updates/updates.reducer';
import trackerReducer from './tracker/tracker.reducer';
import preferenceReducer from './preferences/preference.reducer';
import downloadsReducer from './downloads/downloads.reducer';
import downloadsReducerV2 from './downloads/downloadsSlice';
import localStorageReducer from './localStorage/localStorageSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['novelReducer'],
};

const reducers = combineReducers({
  settingsReducer,
  settingsReducerV2,
  sourceReducer,
  sourcesReducerV2,
  novelReducer,
  novelReducerV2,
  updatesReducer,
  trackerReducer,
  preferenceReducer,
  downloadsReducer,
  downloadsReducerV2,
  localStorageReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { metaReducers } from './meta-reducers';
import { localStorageSyncReducer } from '../core/state/local-storage-sync';

describe('metaReducers', () => {
  it('should include localStorageSyncReducer', () => {
    expect(metaReducers).toContain(localStorageSyncReducer);
    expect(metaReducers.length).toBe(1);
  });
});

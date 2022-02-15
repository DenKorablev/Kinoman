const DATE_FORMAT = {
  YEAR: 'YYYY',
  DURATION_HM: 'H[h] m[m]',
  DATE_HOUR: 'DD/MM/YY HH:mm',
  DATE: 'DD MMMM YYYY'
};

const SORT_TYPE = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite',
};

export { DATE_FORMAT, EMOTIONS, SORT_TYPE, UserAction, UpdateType, FilterType };

export const StatsType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const makeItemsUniq = (items) => [...new Set(items)];

export const getUniqueGenres = (films) => {
  const allGenres = films.map((film) => film.filmInfo.genre);
  const results = allGenres.reduce((result, element) => (result.concat(element)), []);
  return makeItemsUniq(results);
};

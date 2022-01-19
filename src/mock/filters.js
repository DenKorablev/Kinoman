const filmToFilters = {
  all: {
    text: 'All movies',
    count: (films) => films.length
  },
  watchlist: {
    text: 'Watchlist',
    count: (films) => films.filter((film) => film.userDetails.watchlist).length
  },
  history: {
    text: 'History',
    count: (films) => films.filter((film) => film.userDetails.alreadyWatched).length
  },
  favorite: {
    text: 'Favorites',
    count: (films) => films.filter((film) => film.userDetails.favorite).length
  }
};

const generateFilters = (films) => Object.entries(filmToFilters).map(([filterName, object]) => ({
  name: filterName,
  text: object.text,
  count: filterName !== 'all' ? object.count(films) : '',
}));

export { generateFilters };

import dayjs from 'dayjs';
import { getDurationMinutes, getDurationHours } from './date.js';
import { getProfileRaiting } from '../utils/common.js';

export const StatsType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const makeItemsUniq = (items) => [...new Set(items)];

export const getDataStatistics = (films, filterMode) => {
  const currentDate = new Date();
  let filmsWatched = [];

  switch (filterMode) {
    case StatsType.ALL:
      filmsWatched = films.filter((film) => film.userDetails.alreadyWatched);
      break;
    case StatsType.TODAY:
      filmsWatched = films
        .filter((film) => film.userDetails.alreadyWatched && dayjs(film.userDetails.watchingDate).isSame(currentDate, 'day'));
      break;
    case StatsType.WEEK:
      filmsWatched = films
        .filter((film) => film.userDetails.alreadyWatched && dayjs(film.userDetails.watchingDate).isSame(currentDate, 'week'));
      break;
    case StatsType.MONTH:
      filmsWatched = films
        .filter((film) => film.userDetails.alreadyWatched && dayjs(film.userDetails.watchingDate).isSame(currentDate, 'month'));
      break;
    case StatsType.YEAR:
      filmsWatched = films
        .filter((film) => film.userDetails.alreadyWatched && dayjs(film.userDetails.watchingDate).isSame(currentDate, 'year'));
      break;
  }

  const allFilmsGenres = filmsWatched.reduce((allGenres, film) => {
    allGenres.push(...film.filmInfo.genre);
    return allGenres;
  }, []);

  let genres = new Map();

  allFilmsGenres.forEach((genre) => {
    if (genres.has(genre)) {
      let genreCount = genres.get(genre);
      genres.set(genre, ++genreCount);
    } else {
      genres.set(genre, 1);
    }
  });

  genres = new Map([...genres.entries()].sort((a, b) => b[1] - a[1]));
  genres = [...genres.entries()].reduce((result, [type, value]) => {
    result.types.push(type.toUpperCase());
    result.values.push(value);
    return result;
  }, { types: [], values: [] });

  const userRank = getProfileRaiting(films);
  const topGenre = genres.types[0] || '';
  const duration = filmsWatched.reduce((result, film) => (result += film.filmInfo.runtime), 0);
  const durationHours = getDurationHours(duration);
  const durationMinutes = getDurationMinutes(duration);

  return {
    userRank,
    durationHours,
    durationMinutes,
    filmsWatched,
    topGenre,
    genres
  };
};

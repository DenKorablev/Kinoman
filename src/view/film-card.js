import AbstractView from './abstract.js';
import { DATE_FORMAT } from '../const.js';
import { dateConverter, durationConverter } from '../utils/date.js';

const getActiveClassName = (condition) => condition ? 'film-card__controls-item--active' : '';

export const createFilmCardTemplate = ({comments, filmInfo, userDetails}) => {
  const { title, totalRating, runtime, release, genre, poster, description } = filmInfo;
  const { favorite, alreadyWatched, watchlist } = userDetails;
  const releaseYear = dateConverter(release.date, DATE_FORMAT.YEAR);
  const durationFilm = durationConverter(runtime, DATE_FORMAT.DURATION_HM);

  return `
    <article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${releaseYear}</span>
          <span class="film-card__duration">${durationFilm}</span>
          <span class="film-card__genre">${genre.join(' ')}</span>
        </p>
        <img src="${poster}" alt="${title}" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getActiveClassName(watchlist)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getActiveClassName(alreadyWatched)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${getActiveClassName(favorite)}" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._clickHandler = this._clickHandler.bind(this);
    this._addWatchlistHandler = this._addWatchlistHandler.bind(this);
    this._watchedHandler = this._watchedHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _clickHandler(evt) {
    if (evt.target.className !== 'film-card__title'
      && evt.target.className !== 'film-card__poster'
      && evt.target.className !== 'film-card__comments') {
      return;
    }
    this._callback.filmClick(this._film);
  }

  _addWatchlistHandler() {
    this._callback.watchlistClick(this._film);
  }

  _watchedHandler() {
    this._callback.watchedClick(this._film);
  }

  _favoriteHandler() {
    this._callback.favoriteClick(this._film);
  }

  setClickHandler(callback) {
    this._callback.filmClick = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist ').addEventListener('click', this._addWatchlistHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteHandler);
  }
}

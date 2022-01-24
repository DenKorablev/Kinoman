import AbstractView from './abstract.js';
import { DATE_FORMAT } from '../const.js';
import { dateConverter, durationConverter } from '../util.js';

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
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.filmClick();
  }

  setClickHandler(callback) {
    this._callback.filmClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
  }
}

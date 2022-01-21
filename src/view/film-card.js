import { DATE_FORMAT } from '../const.js';
import { dateConverter, durationConverter, createElement } from '../util.js';

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

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
